from typing import Annotated
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from redis.asyncio import Redis
from sqlalchemy import or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from ..cache import get_cached, invalidate, set_cached
from ..config import get_settings
from ..database import get_redis, get_session
from ..exports.registry import resume_exporters
from ..models import Resume
from ..schemas import ResumeCreate, ResumeOut, ResumeUpdate

router = APIRouter(prefix="/api/resumes", tags=["resumes"])
settings = get_settings()
SessionDep = Annotated[AsyncSession, Depends(get_session)]
RedisDep = Annotated[Redis, Depends(get_redis)]


@router.get("", response_model=list[ResumeOut])
async def list_resumes(
    session: SessionDep,
    redis: RedisDep,
    q: str | None = None,
    status_filter: Annotated[str | None, Query(alias="status")] = None,
    limit: Annotated[int, Query(ge=1, le=100)] = 50,
    offset: Annotated[int, Query(ge=0)] = 0,
):
    normalized_q = (q or "").strip().lower()
    key = f"resumes:list:{normalized_q}:{status_filter or ''}:{limit}:{offset}"
    cached = await get_cached(redis, key)
    if cached is not None:
        return cached

    statement = select(Resume)
    if status_filter:
        statement = statement.where(Resume.status == status_filter)
    if normalized_q:
        like = f"%{normalized_q}%"
        statement = statement.where(or_(Resume.filename.ilike(like), Resume.target.ilike(like)))
    records = (await session.scalars(statement.order_by(Resume.filename).limit(limit).offset(offset))).all()
    result = [ResumeOut.model_validate(record).model_dump(mode="json", by_alias=True) for record in records]
    await set_cached(redis, key, result, settings.cache_ttl_seconds)
    return result


@router.post("", response_model=ResumeOut, status_code=status.HTTP_201_CREATED)
async def create_resume(payload: ResumeCreate, session: SessionDep, redis: RedisDep):
    record = Resume(id=payload.id or str(uuid4()), **payload.model_dump(exclude={"id"}))
    session.add(record)
    try:
        await session.commit()
    except IntegrityError as exc:
        await session.rollback()
        raise HTTPException(status_code=409, detail="Resume id already exists") from exc
    await session.refresh(record)
    await invalidate(redis, "resumes:*")
    return record


@router.get("/{resume_id}", response_model=ResumeOut)
async def get_resume(resume_id: str, session: SessionDep, redis: RedisDep):
    key = f"resumes:item:{resume_id}"
    cached = await get_cached(redis, key)
    if cached is not None:
        return cached
    record = await session.get(Resume, resume_id)
    if record is None:
        raise HTTPException(status_code=404, detail="Resume not found")
    result = ResumeOut.model_validate(record).model_dump(mode="json", by_alias=True)
    await set_cached(redis, key, result, settings.cache_ttl_seconds)
    return result


@router.get("/{resume_id}/download", response_class=Response, responses={200: {"content": {"application/pdf": {"schema": {"type": "string", "format": "binary"}}}}})
async def download_resume(
    resume_id: str,
    session: SessionDep,
    format: Annotated[str, Query(min_length=1, max_length=20)] = "pdf",
):
    record = await session.get(Resume, resume_id)
    if record is None:
        raise HTTPException(status_code=404, detail="Resume not found")
    exporter = resume_exporters.get(format)
    if exporter is None:
        supported = ", ".join(resume_exporters.formats)
        raise HTTPException(status_code=400, detail=f"Unsupported format '{format}'. Supported formats: {supported}")
    exported = exporter.export(ResumeOut.model_validate(record))
    stem = record.filename.rsplit("/", 1)[-1].rsplit("\\", 1)[-1].rsplit(".", 1)[0]
    safe_stem = "".join(char for char in stem if char.isalnum() or char in "-_ ").strip() or "resume"
    return Response(
        content=exported.content,
        media_type=exported.media_type,
        headers={"Content-Disposition": f'attachment; filename="{safe_stem}.{exported.extension}"'},
    )


@router.patch("/{resume_id}", response_model=ResumeOut)
async def update_resume(resume_id: str, payload: ResumeUpdate, session: SessionDep, redis: RedisDep):
    record = await session.get(Resume, resume_id)
    if record is None:
        raise HTTPException(status_code=404, detail="Resume not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(record, field, value)
    await session.commit()
    await session.refresh(record)
    await invalidate(redis, "resumes:*")
    return record


@router.delete("/{resume_id}", response_model=ResumeOut)
async def delete_resume(resume_id: str, session: SessionDep, redis: RedisDep):
    record = await session.get(Resume, resume_id)
    if record is None:
        raise HTTPException(status_code=404, detail="Resume not found")
    result = ResumeOut.model_validate(record)
    await session.delete(record)
    await session.commit()
    await invalidate(redis, "resumes:*")
    return result


@router.post("/{resume_id}/duplicate", response_model=ResumeOut, status_code=status.HTTP_201_CREATED)
async def duplicate_resume(resume_id: str, session: SessionDep, redis: RedisDep):
    source = await session.get(Resume, resume_id)
    if source is None:
        raise HTTPException(status_code=404, detail="Resume not found")
    values = ResumeOut.model_validate(source).model_dump(exclude={"id"})
    values["filename"] = source.filename[:-4] + "_copy.tex" if source.filename.lower().endswith(".tex") else source.filename + "_copy"
    values["status"] = "Draft"
    values["status_tone"] = "neutral"
    values["highlighted"] = False
    duplicate = Resume(id=str(uuid4()), **values)
    session.add(duplicate)
    await session.commit()
    await session.refresh(duplicate)
    await invalidate(redis, "resumes:*")
    return duplicate
