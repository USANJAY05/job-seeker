from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    database_url: str = "postgresql+asyncpg://jobbuddy:jobbuddy@localhost:5432/jobbuddy"
    redis_url: str = "redis://localhost:6379/0"
    cors_origins: str = "http://localhost:8081,http://localhost:19006"
    cache_ttl_seconds: int = 60
    object_storage_endpoint_url: str | None = None
    object_storage_region: str = "us-east-1"
    object_storage_access_key_id: str | None = None
    object_storage_secret_access_key: str | None = None
    object_storage_bucket: str = "job-buddy-templates"
    object_storage_force_path_style: bool = False
    admin_jwt_secret: str | None = None
    admin_jwt_issuer: str = "job-buddy-api"
    admin_token_ttl_minutes: int = 60
    admin_bootstrap_email: str | None = None
    admin_bootstrap_password: str | None = None

    @property
    def allowed_origins(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
