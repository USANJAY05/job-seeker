from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from redis.asyncio import Redis
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.concurrency import run_in_threadpool

from ..admin_security import (
    ALL_PERMISSIONS,
    ROLE_PERMISSIONS,
    CurrentAdminDep,
    SessionDep,
    effective_permissions,
    hash_password,
    issue_token,
    new_admin_user,
    require_permission,
    verify_password,
)
from ..config import get_settings
from ..database import get_redis
from ..models import AdminUser, Template
from ..schemas import (
    AdminLogin,
    AdminLoginResponse,
    AdminPasswordChange,
    AdminRoleAssignment,
    AdminRoleOut,
    AdminUserCreate,
    AdminUserOut,
    TemplateCreate,
    TemplateOut,
)
from ..template_service import create_template_record

router = APIRouter(prefix="/api/admin", tags=["admin"])
RedisDep = Annotated[Redis, Depends(get_redis)]


def _user_out(user: AdminUser) -> AdminUserOut:
    return AdminUserOut(
        id=user.id,
        email=user.email,
        role=user.role,
        permissions=effective_permissions(user),
        is_active=user.is_active,
    )


def _validate_permissions(role: str, permissions: list[str] | None) -> None:
    if permissions is None:
        return
    invalid = sorted(set(permissions) - set(ALL_PERMISSIONS) - {"*"})
    if invalid:
        raise HTTPException(status_code=422, detail=f"Unknown permissions: {', '.join(invalid)}")
    if role != "super_admin" and ("*" in permissions or "users:manage" in permissions):
        raise HTTPException(status_code=422, detail="Only super_admin can receive elevated administration permissions")
    if role == "super_admin" and set(permissions) != {"*"}:
        raise HTTPException(status_code=422, detail="super_admin permissions cannot be overridden")


@router.post("/auth/login", response_model=AdminLoginResponse)
async def login(payload: AdminLogin, session: SessionDep):
    settings = get_settings()
    if not settings.admin_jwt_secret or len(settings.admin_jwt_secret) < 32:
        raise HTTPException(status_code=503, detail="Admin authentication is not configured")
    user = await session.scalar(select(AdminUser).where(func.lower(AdminUser.email) == payload.email.lower()))
    valid = await run_in_threadpool(verify_password, payload.password, user.password_hash if user else "invalid-hash")
    if user is None or not user.is_active or not valid:
        raise HTTPException(status_code=401, detail="Incorrect email or password", headers={"WWW-Authenticate": "Bearer"})
    token, expires_in = issue_token(user)
    return AdminLoginResponse(access_token=token, expires_in=expires_in, user=_user_out(user))


@router.get("/me", response_model=AdminUserOut)
async def get_me(user: CurrentAdminDep):
    return _user_out(user)


@router.get("/me/permissions")
async def get_my_permissions(user: CurrentAdminDep):
    return {"role": user.role, "permissions": effective_permissions(user)}


@router.post("/auth/change-password", status_code=status.HTTP_204_NO_CONTENT)
async def change_password(payload: AdminPasswordChange, user: CurrentAdminDep, session: SessionDep):
    valid = await run_in_threadpool(verify_password, payload.current_password, user.password_hash)
    if not valid:
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    user.password_hash = await run_in_threadpool(hash_password, payload.new_password)
    user.token_version += 1
    await session.commit()
    return None


@router.get("/roles", response_model=list[AdminRoleOut], dependencies=[Depends(require_permission("roles:read"))])
async def list_roles():
    return [AdminRoleOut(name=role, permissions=permissions) for role, permissions in ROLE_PERMISSIONS.items()]


@router.get("/users", response_model=list[AdminUserOut], dependencies=[Depends(require_permission("users:read"))])
async def list_admin_users(session: SessionDep):
    users = (await session.scalars(select(AdminUser).order_by(AdminUser.email))).all()
    return [_user_out(user) for user in users]


@router.post("/users", response_model=AdminUserOut, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_permission("users:manage"))])
async def create_admin_user(payload: AdminUserCreate, session: SessionDep):
    _validate_permissions(payload.role, payload.permissions)
    user = new_admin_user(payload.email, await run_in_threadpool(hash_password, payload.password), payload.role, payload.permissions)
    session.add(user)
    try:
        await session.commit()
    except IntegrityError as exc:
        await session.rollback()
        raise HTTPException(status_code=409, detail="An admin user with that email already exists") from exc
    await session.refresh(user)
    return _user_out(user)


@router.patch("/users/{user_id}/role", response_model=AdminUserOut, dependencies=[Depends(require_permission("users:manage"))])
async def update_admin_user(user_id: str, payload: AdminRoleAssignment, session: SessionDep, actor: CurrentAdminDep):
    _validate_permissions(payload.role, payload.permissions)
    user = await session.get(AdminUser, user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="Admin user not found")
    if user.id == actor.id and (payload.role != "super_admin" or payload.is_active is False):
        raise HTTPException(status_code=409, detail="You cannot remove your own super_admin access")
    if user.is_active and user.role == "super_admin" and (payload.role != "super_admin" or payload.is_active is False):
        active_super_admins = await session.scalar(select(func.count()).select_from(AdminUser).where(AdminUser.role == "super_admin", AdminUser.is_active.is_(True)))
        if (active_super_admins or 0) <= 1:
            raise HTTPException(status_code=409, detail="At least one active super_admin must remain")
    user.role = payload.role
    if "permissions" in payload.model_fields_set:
        user.permissions = payload.permissions
    if payload.is_active is not None:
        user.is_active = payload.is_active
    await session.commit()
    await session.refresh(user)
    return _user_out(user)


@router.get("/templates", response_model=list[TemplateOut], dependencies=[Depends(require_permission("templates:read"))])
async def list_admin_templates(session: SessionDep):
    records = (await session.scalars(select(Template).order_by(Template.title))).all()
    return records


@router.post("/templates", response_model=TemplateOut, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_permission("templates:create"))])
async def create_admin_template(payload: TemplateCreate, session: SessionDep, redis: RedisDep):
    return await create_template_record(payload, session, redis)
