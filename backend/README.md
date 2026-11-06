# Job Buddy API

The backend uses FastAPI, PostgreSQL, and Redis. PostgreSQL stores resume records, template records, and the operator profile. Redis caches read responses and invalidates the relevant cache keys after writes. The database starts empty; it does not load preview mock records.

## Run the stack

From the repository root:

```sh
docker compose up --build
```

The API is available at `http://localhost:8000`; interactive OpenAPI docs are at `http://localhost:8000/docs`. Compose starts PostgreSQL on `5432`, Redis on `6379`, and MinIO on `9000` (console `9001`). For Expo web or the iOS simulator, set `EXPO_PUBLIC_API_URL=http://localhost:8000` before starting Metro. For a physical phone, use the development machine's LAN address instead of `localhost`.

To run only the API process outside Docker, start PostgreSQL and Redis, install `backend/requirements.txt`, and run:

```sh
cd backend
cp .env.example .env
uvicorn app.main:app --reload
```

## Routes

| Method | Path | Behavior |
| --- | --- | --- |
| GET | `/health` | Health status |
| GET, POST | `/api/resumes` | List/search resumes; create a resume |
| GET, PATCH, DELETE | `/api/resumes/:id` | Read, update, or remove a resume |
| POST | `/api/resumes/:id/duplicate` | Duplicate a resume |
| GET | `/api/resumes/:id/download?format=pdf` | Download a resume in the requested registered format |
| GET | `/api/templates` | List/search templates, with optional `category` and `q` filters |
| POST | `/api/templates` | Create a template (`templates:create` bearer permission required) |
| GET, PATCH | `/api/templates/:id` | Read a template or update its `bookmarked` value |
| GET | `/api/templates/:id/source` | Fetch full template source text on demand |
| POST | `/api/templates/:id/fork` | Create a resume from a template with source |
| POST | `/api/admin/auth/login` | Sign in and receive a bearer token |
| POST | `/api/admin/auth/change-password` | Change the signed-in admin's password and revoke their existing tokens |
| GET | `/api/admin/me`, `/api/admin/me/permissions` | Inspect the signed-in admin and effective permissions |
| GET | `/api/admin/roles` | Read available roles and their permission sets |
| GET, POST | `/api/admin/users` | List admin users or create a user (requires `users:read` / `users:manage`) |
| PATCH | `/api/admin/users/:id/role` | Change a user's role/permissions or deactivate them (`users:manage`) |
| GET, POST | `/api/admin/templates` | List or create templates with role-based permission checks |
| GET, PUT, PATCH | `/api/profile` | Read or update the operator profile |

Resume and template responses preserve the app's camelCase JSON contract. Resume sources/forms and template/profile nested records are stored in PostgreSQL. Template source text lives in S3-compatible object storage; PostgreSQL stores the object key, checksum, size, metadata, and placeholder schema. Redis caches template reads/source text with a short TTL and fails open when unavailable.

Template creation accepts `source` as the full UTF-8 template text (up to 2 MB) and `placeholders` as a typed schema for template variables. The API writes source bytes to the configured S3-compatible object store and returns metadata without the source body; fetch it from `GET /api/templates/:id/source` when opening the template. Placeholder types are `string`, `number`, `boolean`, `array`, or `object`; limits such as `maxLength`, `maxItems`, and `itemMaxLength` are supported. The reserved `extras` placeholder must be an array of `{ key, value }` string entries, allowing each user to add multiple custom key/value values. Define `maxItems` and `maxLength` on both `extras` fields. Example:

```json
{
  "title": "Software Engineer Resume",
  "source": "{{fullName}}\\n{{#extras}}{{key}}: {{value}}{{/extras}}",
  "placeholders": {
    "fullName": { "type": "string", "required": true, "maxLength": 120 },
    "extras": {
      "type": "array", "required": false, "maxItems": 20,
      "item": {
        "key": { "type": "string", "required": true, "maxLength": 80 },
        "value": { "type": "string", "required": true, "maxLength": 500 }
      }
    }
  }
}
```

Existing databases add the object-key, checksum, size, and `placeholders` columns at API startup. Legacy template sources stored in PostgreSQL are copied to object storage and removed from the row the first time the source endpoint or fork endpoint is used.

Local development uses MinIO through the same S3 API client. For AWS S3, set `OBJECT_STORAGE_ENDPOINT_URL` empty, configure `OBJECT_STORAGE_REGION` and AWS credentials through the standard AWS environment/role chain, and set `OBJECT_STORAGE_BUCKET` to the deployed bucket. Keep `OBJECT_STORAGE_FORCE_PATH_STYLE=false` for AWS; Compose sets it to `true` for MinIO.

Admin auth uses short-lived HS256 bearer tokens and Argon2 password hashes. Configure a random `ADMIN_JWT_SECRET` of at least 32 characters and one-time `ADMIN_BOOTSTRAP_EMAIL` / `ADMIN_BOOTSTRAP_PASSWORD` values before the first API start. The bootstrap account receives `super_admin`; subsequent users are created through the protected users endpoint. Template creation requires `templates:create` on both `/api/admin/templates` and `/api/templates`. Roles are `super_admin`, `admin`, `editor`, and `viewer`; `GET /api/admin/roles` and `/api/admin/me/permissions` expose role grants. Roles and permissions are reloaded from PostgreSQL on every protected request, so changes take effect without waiting for token expiry. For Compose, put these variables in a root `.env`; for direct local runs, set them in `backend/.env`.

Default role grants: `super_admin` has all permissions; `admin` can read/create templates and read users/roles; `editor` can read/create templates and inspect roles; `viewer` can read templates and inspect roles. Only `super_admin` can manage admin accounts or grant elevated permissions. Password changes invalidate the user's existing bearer tokens.

Example login:

```sh
curl -X POST http://localhost:8000/api/admin/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@example.com","password":"your-bootstrap-password"}'
```

Use the returned `accessToken` as `Authorization: Bearer <token>` for admin endpoints.

Resume exports use the `app/exports` interface and registry. The PDF exporter is registered by default and renders the structured resume form (with basic record metadata as a fallback). To add DOCX or another format, implement `ResumeExporter`, register it in `registry.py`, and add its dependency if needed; the download route and query parameter remain unchanged. Export output is returned as an attachment with its format-specific MIME type and extension.

Profile project entries accept optional `githubUrl` and `liveUrl` values. Experience entries accept optional `startDate` and `endDate` strings; the UI uses `YYYY-MM` and allows `Present` for an ongoing role.

The credentials and CORS origins in the compose file are for local development only. Before deploying to a public production environment, configure deployment secrets, TLS, authentication and per-user profile ownership, Alembic migrations, and deployment-specific CORS.
