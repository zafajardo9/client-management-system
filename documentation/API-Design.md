# API Design

APIs live under `src/app/api/*`. Each handler imports the corresponding server actions from `src/lib/actions/*`. All actions and folders have `index.ts` barrel exports.

## Conventions

- Auth: Clerk session required except for public share routes.
- Content-Type: `application/json` for JSON endpoints; multipart for uploads (future).
- Error shape: `{ error: { code: string; message: string; details?: any } }`.
- Pagination: `?page=1&pageSize=20` with `X-Total-Count` header.

## Implemented Endpoints

- Projects
  - `GET /api/projects` — list projects for current user
  - `POST /api/projects` — create project
  - `GET /api/projects/:id` — get project details
  - `PATCH /api/projects/:id` — update project

- Updates
  - `GET /api/projects/:id/updates` — list updates (filters: status, tags, page)
  - `POST /api/projects/:id/updates` — create update
  - `GET /api/updates/:updateId` — get single update
  - `PATCH /api/updates/:updateId` — edit update
  - `DELETE /api/updates/:updateId` — delete update

- Share Links
  - `POST /api/projects/:id/share-links` — create share link
  - `GET /api/projects/:id/share-links` — list links
  - `PATCH /api/share-links/:id` — update (enable/disable, password, visibility, tags)
  - `DELETE /api/share-links/:id` — revoke

- Public Share (no auth)
  - `GET /api/share/:slug` — fetch public updates per share link (respects visibility + tag filter)

## Actions Mapping (examples)

- `src/lib/actions/projects/createProject.ts`
- `src/lib/actions/projects/getProjects.ts`
- `src/lib/actions/projects/updateProject.ts`
- `src/lib/actions/projects/index.ts` (barrel)
- Same pattern for `updates` and `shareLinks`.

Public share:

- `src/lib/actions/shareLinks/getPublicUpdatesBySlug.ts`

## Response Examples

```json
// GET /api/projects
{
  "data": [{"id":"p1","name":"Site Redesign","isArchived":false}],
  "meta": {"page":1,"pageSize":20,"total":1}
}
```

```json
// Error
{ "error": { "code": "FORBIDDEN", "message": "You do not have access to this project." } }
```

Notes
- Middleware enforces auth for all routes except `/`, `/share/*`, and `/api/share/*`.
- Error shape is `{ error: { code: string; message: string; details?: any } }`.

## Planned Endpoints

- Projects
  - `DELETE /api/projects/:id` — archive/delete project
  - `POST /api/projects/:id/members` — add member
  - `DELETE /api/projects/:id/members/:userId` — remove member
