from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field, model_validator


def to_camel(value: str) -> str:
    first, *rest = value.split("_")
    return first + "".join(part.capitalize() for part in rest)


class APIModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)


class ResumeFields(APIModel):
    filename: str
    target: str = ""
    target_icon: str | None = None
    status: str = "Draft"
    status_tone: str | None = None
    ats_score: int | None = Field(default=None, ge=0, le=100)
    engine: str = "XeLaTeX"
    skills: list[str] = Field(default_factory=list)
    extra_skill_count: int | None = Field(default=None, ge=0)
    compiled_label: str = "Not compiled"
    compile_status: str = "Draft"
    filter_ids: list[str] = Field(default_factory=list)
    highlighted: bool | None = None
    source: str | None = None
    form: dict[str, Any] | None = None


class ResumeCreate(ResumeFields):
    id: str | None = None


class ResumeUpdate(APIModel):
    filename: str | None = None
    target: str | None = None
    target_icon: str | None = None
    status: str | None = None
    status_tone: str | None = None
    ats_score: int | None = Field(default=None, ge=0, le=100)
    engine: str | None = None
    skills: list[str] | None = None
    extra_skill_count: int | None = Field(default=None, ge=0)
    compiled_label: str | None = None
    compile_status: str | None = None
    filter_ids: list[str] | None = None
    highlighted: bool | None = None
    source: str | None = None
    form: dict[str, Any] | None = None


class ResumeOut(ResumeFields):
    id: str


class PlaceholderDefinition(APIModel):
    type: Literal["string", "number", "boolean", "array", "object"]
    required: bool = False
    max_length: int | None = Field(default=None, ge=1, le=100_000)
    max_items: int | None = Field(default=None, ge=1, le=1000)
    item_max_length: int | None = Field(default=None, ge=1, le=100_000)
    max_properties: int | None = Field(default=None, ge=1, le=1000)
    key_max_length: int | None = Field(default=None, ge=1, le=500)
    item: "PlaceholderDefinition | dict[str, PlaceholderDefinition] | str | None" = None
    items: "PlaceholderDefinition | str | None" = None


class TemplateFields(APIModel):
    title: str
    description: str = ""
    icon: str = "file-document-outline"
    category_ids: list[str] = Field(default_factory=list)
    actions: list[dict[str, Any]] = Field(default_factory=list)
    can_bookmark: bool = False
    bookmarked: bool = False
    verified: bool = False
    badge: dict[str, Any] | None = None
    placeholders: dict[str, PlaceholderDefinition] = Field(default_factory=dict)

    @model_validator(mode="after")
    def validate_template_content(self):
        placeholders = self.placeholders
        if len(placeholders) > 200:
            raise ValueError("A template can define at most 200 placeholders")
        extras = placeholders.get("extras")
        if extras and extras.type != "array":
            raise ValueError("The extras placeholder must be an array")
        if extras and not isinstance(extras.item, dict):
            raise ValueError("The extras array item must define key and value fields")
        if extras and set(extras.item) != {"key", "value"}:
            raise ValueError("The extras array item must define exactly key and value")
        if extras and (extras.item["key"].type != "string" or extras.item["value"].type != "string"):
            raise ValueError("The extras key and value fields must be strings")
        if extras and extras.max_items is None:
            raise ValueError("The extras array must define maxItems")
        if extras and (extras.item["key"].max_length is None or extras.item["value"].max_length is None):
            raise ValueError("The extras key and value fields must define maxLength")
        return self


class TemplateCreate(TemplateFields):
    source: str = Field(min_length=1)
    id: str | None = None

    @model_validator(mode="after")
    def validate_source_size(self):
        if len(self.source.encode("utf-8")) > 2_000_000:
            raise ValueError("Template source must be 2 MB or smaller")
        return self


class TemplateOut(TemplateFields):
    id: str


class BookmarkUpdate(APIModel):
    bookmarked: bool


AdminRoleName = Literal["super_admin", "admin", "editor", "viewer"]


class AdminLogin(APIModel):
    email: str = Field(min_length=3, max_length=320, pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
    password: str = Field(min_length=1, max_length=1024)


class AdminPasswordChange(APIModel):
    current_password: str = Field(min_length=1, max_length=1024)
    new_password: str = Field(min_length=12, max_length=1024)


class AdminUserCreate(APIModel):
    email: str = Field(min_length=3, max_length=320, pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
    password: str = Field(min_length=12, max_length=1024)
    role: AdminRoleName = "viewer"
    permissions: list[str] | None = None


class AdminRoleAssignment(APIModel):
    role: AdminRoleName
    permissions: list[str] | None = None
    is_active: bool | None = None


class AdminUserOut(APIModel):
    id: str
    email: str
    role: AdminRoleName
    permissions: list[str]
    is_active: bool


class AdminLoginResponse(APIModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: AdminUserOut


class AdminRoleOut(APIModel):
    name: AdminRoleName
    permissions: list[str]


class ProfileDetail(APIModel):
    id: str
    title: str
    description: str
    github_url: str | None = None
    live_url: str | None = None
    start_date: str | None = None
    end_date: str | None = None


class ProfileFields(APIModel):
    name: str = ""
    headline: str = ""
    location: str = ""
    summary: str = ""
    email: str = ""
    skills: list[str] = Field(default_factory=list)
    links: list[ProfileDetail] = Field(default_factory=list)
    experience: list[ProfileDetail] = Field(default_factory=list)
    projects: list[ProfileDetail] = Field(default_factory=list)
    education: list[ProfileDetail] = Field(default_factory=list)
    targets: list[ProfileDetail] = Field(default_factory=list)


class ProfileUpdate(APIModel):
    name: str | None = None
    headline: str | None = None
    location: str | None = None
    summary: str | None = None
    email: str | None = None
    skills: list[str] | None = None
    links: list[ProfileDetail] | None = None
    experience: list[ProfileDetail] | None = None
    projects: list[ProfileDetail] | None = None
    education: list[ProfileDetail] | None = None
    targets: list[ProfileDetail] | None = None


class ProfileOut(ProfileFields):
    pass
