import logging
import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.concurrency import run_in_threadpool
from redis.asyncio import Redis
from sqlalchemy import func, select, text
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

from .config import get_settings
from .admin_security import hash_password, new_admin_user
from .models import AdminUser, Base
from .object_storage import get_object_storage
from .routes import admin, profile, resumes, templates

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    database_url = settings.database_url
    if database_url.startswith("postgresql://"):
        database_url = database_url.replace("postgresql://", "postgresql+asyncpg://", 1)
    engine = create_async_engine(database_url, pool_pre_ping=True)
    app.state.session_factory = async_sessionmaker(engine, expire_on_commit=False)
    app.state.redis = Redis.from_url(settings.redis_url, decode_responses=True, health_check_interval=30)
    app.state.object_storage = get_object_storage()

    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)
        await connection.execute(text("ALTER TABLE templates ADD COLUMN IF NOT EXISTS placeholders JSONB NOT NULL DEFAULT '{}'::jsonb"))
        await connection.execute(text("ALTER TABLE templates ADD COLUMN IF NOT EXISTS source_object_key VARCHAR(1024)"))
        await connection.execute(text("ALTER TABLE templates ADD COLUMN IF NOT EXISTS source_checksum VARCHAR(64)"))
        await connection.execute(text("ALTER TABLE templates ADD COLUMN IF NOT EXISTS source_size_bytes INTEGER"))
        await connection.execute(text("ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS token_version INTEGER NOT NULL DEFAULT 0"))
    if settings.admin_jwt_secret and len(settings.admin_jwt_secret) >= 32 and settings.admin_bootstrap_email and settings.admin_bootstrap_password:
        async with app.state.session_factory() as session:
            bootstrap_email = settings.admin_bootstrap_email.strip().lower()
            existing = await session.scalar(select(AdminUser).where(func.lower(AdminUser.email) == bootstrap_email))
            if existing is None:
                bootstrap = new_admin_user(bootstrap_email, await run_in_threadpool(hash_password, settings.admin_bootstrap_password), "super_admin")
                session.add(bootstrap)
                try:
                    await session.commit()
                    logger.info("Bootstrapped configured admin account")
                except IntegrityError:
                    await session.rollback()
    elif settings.admin_bootstrap_email or settings.admin_bootstrap_password:
        logger.warning("Admin bootstrap requires ADMIN_JWT_SECRET of at least 32 characters and both bootstrap credentials")
    for attempt in range(10):
        try:
            await run_in_threadpool(app.state.object_storage.ensure_bucket)
            break
        except Exception as exc:
            if attempt == 9:
                logger.warning("Object storage is unavailable; template source operations will fail until it is configured: %s", exc)
            else:
                await asyncio.sleep(1)
    try:
        await app.state.redis.ping()
    except Exception as exc:
        logger.warning("Redis is unavailable; API will run without cache: %s", exc)

    try:
        yield
    finally:
        await app.state.redis.aclose()
        app.state.object_storage.client.close()
        await engine.dispose()


app = FastAPI(title="Job Buddy API", version="0.1.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)
app.include_router(resumes.router)
app.include_router(templates.router)
app.include_router(admin.router)
app.include_router(profile.router)


@app.get("/health", tags=["health"])
async def health():
    return {"status": "ok"}
