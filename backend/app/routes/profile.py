from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from ..cache import get_cached, invalidate, set_cached
from ..config import get_settings
from ..database import get_redis, get_session
from ..models import OperatorProfile
from ..schemas import ProfileFields, ProfileOut, ProfileUpdate

router = APIRouter(prefix="/api/profile", tags=["profile"])
settings = get_settings()
SessionDep = Annotated[AsyncSession, Depends(get_session)]
RedisDep = Annotated[Redis, Depends(get_redis)]
PROFILE_ID = "default"


@router.get("", response_model=ProfileOut)
async def get_profile(session: SessionDep, redis: RedisDep):
    key = "profile:default"
    cached = await get_cached(redis, key)
    if cached is not None:
        return cached
    record = await session.get(OperatorProfile, PROFILE_ID)
    if record is None:
        record = OperatorProfile(id=PROFILE_ID)
        session.add(record)
        await session.commit()
        await session.refresh(record)
    result = ProfileOut.model_validate(record).model_dump(mode="json", by_alias=True)
    await set_cached(redis, key, result, settings.cache_ttl_seconds)
    return result


@router.put("", response_model=ProfileOut)
async def replace_profile(payload: ProfileFields, session: SessionDep, redis: RedisDep):
    record = await session.get(OperatorProfile, PROFILE_ID)
    values = payload.model_dump()
    if record is None:
        record = OperatorProfile(id=PROFILE_ID, **values)
        session.add(record)
    else:
        for field, value in values.items():
            setattr(record, field, value)
    await session.commit()
    await session.refresh(record)
    await invalidate(redis, "profile:*")
    return record


@router.patch("", response_model=ProfileOut)
async def patch_profile(payload: ProfileUpdate, session: SessionDep, redis: RedisDep):
    record = await session.get(OperatorProfile, PROFILE_ID)
    if record is None:
        raise HTTPException(status_code=404, detail="Profile not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        if value is not None and field in {"links", "experience", "projects", "education", "targets"}:
            value = [item.model_dump() for item in value]
        setattr(record, field, value)
    await session.commit()
    await session.refresh(record)
    await invalidate(redis, "profile:*")
    return record
