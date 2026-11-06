from sqlalchemy import Boolean, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class Resume(Base):
    __tablename__ = "resumes"

    id: Mapped[str] = mapped_column(String(80), primary_key=True)
    filename: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    target: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    target_icon: Mapped[str | None] = mapped_column(String(80))
    status: Mapped[str] = mapped_column(String(80), nullable=False, default="Draft", index=True)
    status_tone: Mapped[str | None] = mapped_column(String(40))
    ats_score: Mapped[int | None] = mapped_column(Integer)
    engine: Mapped[str] = mapped_column(String(80), nullable=False, default="XeLaTeX")
    skills: Mapped[list[str]] = mapped_column(JSONB, nullable=False, default=list)
    extra_skill_count: Mapped[int | None] = mapped_column(Integer)
    compiled_label: Mapped[str] = mapped_column(String(120), nullable=False, default="Not compiled")
    compile_status: Mapped[str] = mapped_column(String(120), nullable=False, default="Draft")
    filter_ids: Mapped[list[str]] = mapped_column(JSONB, nullable=False, default=list)
    highlighted: Mapped[bool | None] = mapped_column(Boolean)
    source: Mapped[str | None] = mapped_column(Text)
    form: Mapped[dict | None] = mapped_column(JSONB)


class Template(Base):
    __tablename__ = "templates"

    id: Mapped[str] = mapped_column(String(80), primary_key=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    description: Mapped[str] = mapped_column(String(1000), nullable=False, default="")
    icon: Mapped[str] = mapped_column(String(80), nullable=False, default="file-document-outline")
    category_ids: Mapped[list[str]] = mapped_column(JSONB, nullable=False, default=list)
    actions: Mapped[list[dict]] = mapped_column(JSONB, nullable=False, default=list)
    can_bookmark: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    bookmarked: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    verified: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    source: Mapped[str | None] = mapped_column(Text)
    badge: Mapped[dict | None] = mapped_column(JSONB)
    placeholders: Mapped[dict] = mapped_column(JSONB, nullable=False, default=dict)
    source_object_key: Mapped[str | None] = mapped_column(String(1024))
    source_checksum: Mapped[str | None] = mapped_column(String(64))
    source_size_bytes: Mapped[int | None] = mapped_column(Integer)


class AdminUser(Base):
    __tablename__ = "admin_users"

    id: Mapped[str] = mapped_column(String(80), primary_key=True)
    email: Mapped[str] = mapped_column(String(320), nullable=False, unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(512), nullable=False)
    token_version: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    role: Mapped[str] = mapped_column(String(40), nullable=False, default="viewer")
    permissions: Mapped[list[str] | None] = mapped_column(JSONB)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)


class OperatorProfile(Base):
    __tablename__ = "operator_profiles"

    id: Mapped[str] = mapped_column(String(80), primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False, default="")
    headline: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    location: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    summary: Mapped[str] = mapped_column(Text, nullable=False, default="")
    email: Mapped[str] = mapped_column(String(320), nullable=False, default="")
    skills: Mapped[list[str]] = mapped_column(JSONB, nullable=False, default=list)
    links: Mapped[list[dict]] = mapped_column(JSONB, nullable=False, default=list)
    experience: Mapped[list[dict]] = mapped_column(JSONB, nullable=False, default=list)
    projects: Mapped[list[dict]] = mapped_column(JSONB, nullable=False, default=list)
    education: Mapped[list[dict]] = mapped_column(JSONB, nullable=False, default=list)
    targets: Mapped[list[dict]] = mapped_column(JSONB, nullable=False, default=list)
