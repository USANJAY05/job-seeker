import json
import logging
from typing import Any

from redis.asyncio import Redis

logger = logging.getLogger(__name__)


async def get_cached(redis: Redis, key: str) -> Any | None:
    try:
        value = await redis.get(key)
        return json.loads(value) if value else None
    except Exception as exc:  # cache failures must not take the API down
        logger.warning("Redis read failed for %s: %s", key, exc)
        return None


async def set_cached(redis: Redis, key: str, value: Any, ttl: int) -> None:
    try:
        await redis.set(key, json.dumps(value, separators=(",", ":")), ex=ttl)
    except Exception as exc:
        logger.warning("Redis write failed for %s: %s", key, exc)


async def invalidate(redis: Redis, pattern: str) -> None:
    try:
        keys = [key async for key in redis.scan_iter(match=pattern, count=200)]
        if keys:
            await redis.delete(*keys)
    except Exception as exc:
        logger.warning("Redis invalidation failed for %s: %s", pattern, exc)
