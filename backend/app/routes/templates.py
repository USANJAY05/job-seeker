from typing import Annotated
from hashlib import sha256
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, Query, Request, Response, status
from redis.asyncio import Redis
from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.concurrency import run_in_threadpool

from ..cache import get_cached, invalidate, set_cached
from ..config import get_settings
from ..database import get_redis, get_session
from ..admin_security import require_permission
from ..models import Resume, Template
from ..object_storage import S3ObjectStorage, get_object_storage
from ..schemas import BookmarkUpdate, ResumeOut, TemplateCreate, TemplateOut
from ..template_service import create_template_record

router = APIRouter(prefix="/api/templates", tags=["templates"])
settings = get_settings()
SessionDep = Annotated[AsyncSession, Depends(get_session)]
RedisDep = Annotated[Redis, Depends(get_redis)]


def _source_key(template_id: str, checksum: str) -> str:
    return f"templates/{template_id}/source-{uuid4().hex}-{checksum}.tex"


async def _load_source(template: Template, session: AsyncSession, storage: S3ObjectStorage) -> str:
    if template.source_object_key:
        try:
            return await run_in_threadpool(storage.get_text, template.source_object_key)
        except Exception as exc:
            raise HTTPException(status_code=503, detail="Template source storage is unavailable") from exc
    if not template.source:
        raise HTTPException(status_code=404, detail="Template source is unavailable")

    # Move legacy PostgreSQL text to object storage on first source access.
    source = template.source
    checksum = sha256(source.encode("utf-8")).hexdigest()
    key = _source_key(template.id, checksum)
    try:
        await run_in_threadpool(storage.put_text, key, source, checksum)
    except Exception as exc:
        raise HTTPException(status_code=503, detail="Template source storage is unavailable") from exc
    template.source_object_key = key
    template.source_checksum = checksum
    template.source_size_bytes = len(source.encode("utf-8"))
    template.source = None
    await session.commit()
    return source


@router.get("", response_model=list[TemplateOut])
async def list_templates(
    session: SessionDep,
    redis: RedisDep,
    q: str | None = None,
    category: str | None = None,
    limit: Annotated[int, Query(ge=1, le=100)] = 50,
    offset: Annotated[int, Query(ge=0)] = 0,
):
    normalized_q = (q or "").strip().lower()
    key = f"templates:list:{normalized_q}:{category or ''}:{limit}:{offset}"
    cached = await get_cached(redis, key)
    if cached is not None:
        return cached

    statement = select(Template)
    if category:
        statement = statement.where(Template.category_ids.contains([category]))
    if normalized_q:
        like = f"%{normalized_q}%"
        statement = statement.where(or_(Template.title.ilike(like), Template.description.ilike(like)))
    records = (await session.scalars(statement.order_by(Template.title).limit(limit).offset(offset))).all()
    result = [TemplateOut.model_validate(record).model_dump(mode="json", by_alias=True) for record in records]
    await set_cached(redis, key, result, settings.cache_ttl_seconds)
    return result


@router.post("", response_model=TemplateOut, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_permission("templates:create"))])
async def create_template(payload: TemplateCreate, session: SessionDep, redis: RedisDep):
    return await create_template_record(payload, session, redis)


@router.get("/{template_id}", response_model=TemplateOut)
async def get_template(template_id: str, session: SessionDep, redis: RedisDep):
    key = f"templates:item:{template_id}"
    cached = await get_cached(redis, key)
    if cached is not None:
        return cached
    record = await session.get(Template, template_id)
    if record is None:
        raise HTTPException(status_code=404, detail="Template not found")
    result = TemplateOut.model_validate(record).model_dump(mode="json", by_alias=True)
    await set_cached(redis, key, result, settings.cache_ttl_seconds)
    return result


@router.get("/{template_id}/source", response_class=Response)
async def get_template_source(template_id: str, request: Request, session: SessionDep, redis: RedisDep):
    template = await session.get(Template, template_id)
    if template is None:
        raise HTTPException(status_code=404, detail="Template not found")

    storage = get_object_storage()
    legacy_source = template.source is not None and not template.source_object_key
    if legacy_source:
        source = await _load_source(template, session, storage)
        await invalidate(redis, "templates:*")
    else:
        if not template.source_object_key:
            raise HTTPException(status_code=404, detail="Template source is unavailable")
        checksum = template.source_checksum or ""
        etag = f'"{checksum}"' if checksum else None
        if etag and request.headers.get("if-none-match") == etag:
            return Response(status_code=304, headers={"ETag": etag})
        cache_key = f"templates:source:{template_id}:{checksum}"
        source = await get_cached(redis, cache_key)
        if source is None:
            source = await _load_source(template, session, storage)
            await set_cached(redis, cache_key, source, settings.cache_ttl_seconds)

    checksum = template.source_checksum or sha256(source.encode("utf-8")).hexdigest()
    return Response(
        content=source,
        media_type="text/plain",
        headers={
            "ETag": f'"{checksum}"',
            "Cache-Control": "private, max-age=60",
            "Content-Disposition": f'inline; filename="template-{safe_filename(template_id)}.tex"',
        },
    )


def safe_filename(value: str) -> str:
    safe = "".join(char for char in value if char.isalnum() or char in "-_ ").strip()
    return safe or "template"


@router.patch("/{template_id}", response_model=TemplateOut)
async def update_template(template_id: str, payload: BookmarkUpdate, session: SessionDep, redis: RedisDep):
    record = await session.get(Template, template_id)
    if record is None:
        raise HTTPException(status_code=404, detail="Template not found")
    record.bookmarked = payload.bookmarked
    await session.commit()
    await session.refresh(record)
    await invalidate(redis, "templates:*")
    return record


@router.post("/{template_id}/fork", response_model=ResumeOut, status_code=status.HTTP_201_CREATED)
async def fork_template(template_id: str, session: SessionDep, redis: RedisDep):
    template = await session.get(Template, template_id)
    if template is None:
        raise HTTPException(status_code=404, detail="Template not found")
    source_text = await _load_source(template, session, get_object_storage())
    resume = Resume(
        id=str(uuid4()),
        filename=f"{template.title}.tex",
        target="Target role not set",
        status="Draft",
        status_tone="neutral",
        engine="XeLaTeX",
        skills=[],
        compiled_label="Not compiled",
        compile_status="Draft",
        filter_ids=["draft"],
        source=source_text,
    )
    session.add(resume)
    await session.commit()
    await session.refresh(resume)
    await invalidate(redis, "resumes:*")
    return resume
