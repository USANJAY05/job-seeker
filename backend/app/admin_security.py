from datetime import datetime, timedelta, timezone
from typing import Annotated
from uuid import uuid4

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jwt import InvalidTokenError
from pwdlib import PasswordHash
from sqlalchemy.ext.asyncio import AsyncSession

from .config import get_settings
from .database import get_session
from .models import AdminUser

ROLE_PERMISSIONS: dict[str, list[str]] = {
    "super_admin": ["*"],
    "admin": ["templates:read", "templates:create", "users:read", "roles:read"],
    "editor": ["templates:read", "templates:create", "roles:read"],
    "viewer": ["templates:read", "roles:read"],
}
ALL_PERMISSIONS = sorted({permission for values in ROLE_PERMISSIONS.values() for permission in values if permission != "*"} | {"users:manage"})
password_hash = PasswordHash.recommended()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/admin/auth/login", auto_error=False)
TokenDep = Annotated[str | None, Depends(oauth2_scheme)]
SessionDep = Annotated[AsyncSession, Depends(get_session)]


def effective_permissions(user: AdminUser) -> list[str]:
    return sorted(set(user.permissions if user.permissions is not None else ROLE_PERMISSIONS.get(user.role, [])))


def has_permission(user: AdminUser, permission: str) -> bool:
    permissions = effective_permissions(user)
    return "*" in permissions or permission in permissions


def hash_password(value: str) -> str:
    return password_hash.hash(value)


def verify_password(value: str, hashed: str) -> bool:
    try:
        return password_hash.verify(value, hashed)
    except Exception:
        return False


def issue_token(user: AdminUser) -> tuple[str, int]:
    settings = get_settings()
    if not settings.admin_jwt_secret or len(settings.admin_jwt_secret) < 32:
        raise HTTPException(status_code=503, detail="Admin authentication is not configured")
    ttl = max(5, settings.admin_token_ttl_minutes)
    expires = datetime.now(timezone.utc) + timedelta(minutes=ttl)
    token = jwt.encode(
        {"sub": user.id, "ver": user.token_version, "iss": settings.admin_jwt_issuer, "iat": datetime.now(timezone.utc), "exp": expires},
        settings.admin_jwt_secret,
        algorithm="HS256",
    )
    return token, ttl * 60


async def current_admin(token: TokenDep, session: SessionDep) -> AdminUser:
    unauthorized = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired admin token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    settings = get_settings()
    if not token or not settings.admin_jwt_secret or len(settings.admin_jwt_secret) < 32:
        raise unauthorized
    try:
        claims = jwt.decode(token, settings.admin_jwt_secret, algorithms=["HS256"], issuer=settings.admin_jwt_issuer)
        user_id = claims.get("sub")
        if not isinstance(user_id, str):
            raise unauthorized
    except InvalidTokenError as exc:
        raise unauthorized from exc
    user = await session.get(AdminUser, user_id)
    if user is None or not user.is_active or claims.get("ver") != user.token_version:
        raise unauthorized
    return user


CurrentAdminDep = Annotated[AdminUser, Depends(current_admin)]


def require_permission(permission: str):
    async def checker(user: CurrentAdminDep) -> AdminUser:
        if not has_permission(user, permission):
            raise HTTPException(status_code=403, detail=f"Missing permission: {permission}")
        return user

    return checker


def new_admin_user(email: str, encoded_password: str, role: str, permissions: list[str] | None = None) -> AdminUser:
    return AdminUser(id=str(uuid4()), email=email.strip().lower(), password_hash=encoded_password, role=role, permissions=permissions)
