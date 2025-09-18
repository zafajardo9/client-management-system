# API Design

APIs live under `src/app/api/*`. Each handler should import corresponding server actions from `src/lib/actions/*`. All actions and folders must have `index.ts` barrel exports.

## Conventions
- Auth: Clerk session required except for public share routes.
- Content-Type: `application/json` for JSON endpoints; multipart for uploads (future).
- Error shape: `{ error: { code: string; message: string; details?: any } }`.
- Pagination: `?page=1&pageSize=20` with `X-Total-Count` header.

## Endpoints

- Projects
  - `GET /api/projects` — list projects for current user
  - `POST /api/projects` — create project
  - `GET /api/projects/:id` — get project details
  - `PATCH /api/projects/:id` — update project
  - `DELETE /api/projects/:id` — archive/delete project
  - `POST /api/projects/:id/members` — add member
  - `DELETE /api/projects/:id/members/:userId` — remove member

- Updates
  - `GET /api/projects/:id/updates` — list updates (filters: status, tags, q)
  - `POST /api/projects/:id/updates` — create update
  - `GET /api/updates/:updateId` — get single update
  - `PATCH /api/updates/:updateId` — edit update
  - `DELETE /api/updates/:updateId` — delete update

- Share Links
  - `POST /api/projects/:id/share-links` — create share link
  - `GET /api/projects/:id/share-links` — list links
  - `PATCH /api/share-links/:id` — update (enable/disable, password)
  - `DELETE /api/share-links/:id` — revoke
  - `GET /api/share/:slug` — public view details needed to render

## Actions Mapping (examples)
- `src/lib/actions/projects/createProject.ts`
- `src/lib/actions/projects/getProjects.ts`
- `src/lib/actions/projects/updateProject.ts`
- `src/lib/actions/projects/index.ts` (barrel)
- Same pattern for `updates` and `shareLinks`.

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
