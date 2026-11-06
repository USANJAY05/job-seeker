from hashlib import sha256
from uuid import uuid4

from fastapi import HTTPException
from redis.asyncio import Redis
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.concurrency import run_in_threadpool

from .cache import invalidate
from .models import Template
from .object_storage import get_object_storage
from .schemas import TemplateCreate


async def create_template_record(payload: TemplateCreate, session: AsyncSession, redis: Redis) -> Template:
    template_id = payload.id or str(uuid4())
    source = payload.source
    checksum = sha256(source.encode("utf-8")).hexdigest()
    key = f"templates/{template_id}/source-{uuid4().hex}-{checksum}.tex"
    record = Template(
        id=template_id,
        **payload.model_dump(exclude={"id", "source"}),
        source=None,
        source_object_key=key,
        source_checksum=checksum,
        source_size_bytes=len(source.encode("utf-8")),
    )
    storage = get_object_storage()
    try:
        await run_in_threadpool(storage.put_text, key, source, checksum)
    except Exception as exc:
        raise HTTPException(status_code=503, detail="Template source storage is unavailable") from exc
    session.add(record)
    try:
        await session.commit()
    except IntegrityError as exc:
        await session.rollback()
        await run_in_threadpool(storage.delete, key)
        raise HTTPException(status_code=409, detail="Template id already exists") from exc
    except Exception:
        await session.rollback()
        await run_in_threadpool(storage.delete, key)
        raise
    await session.refresh(record)
    await invalidate(redis, "templates:*")
    return record
