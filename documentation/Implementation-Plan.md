# Implementation Plan (Step-by-Step)

## Progress Update (as of now)

- Phase 0: Complete
  - Next.js App Router, TS, Tailwind v4 configured.
  - Clerk middleware in `middleware.ts` protecting non-public routes.
  - Prisma schema created and `src/lib/db.ts` singleton in place.
  - Actions scaffolded with barrels: `projects`, `updates`, `shareLinks`.
- Phase 1: Complete
  - Prisma models for User, Project, ProjectMember, Update, ShareLink implemented.
  - Validators for updates/projects added under `src/lib/validators`.
- Phase 2: Complete
  - `projects`: create, list, getById, update.
  - `updates`: create, list (filters/pagination supported), getById, update, delete.
  - `shareLinks`: create, list, update, revoke, public fetch by slug.
- Phase 3: Complete
  - API routes mapped to actions with consistent error shape and tests under `src/tests/api/*`.
- Phase 4: In progress (major items done)
  - `/dashboard`: list projects + Create Project form.
  - `/projects/[projectId]`: project header, Updates list, New Update form, Share Links section.
  - `/projects/[projectId]/updates/[updateId]`: Update detail page with edit/delete form.
  - `/share/[slug]`: public updates list.
  - `loading.tsx` skeletons added for all key routes.

## Next Steps (short-term)

- UI polish with shadcn/ui
  - Replace primitive inputs/buttons/forms with shadcn components for consistency and accessibility.
  - Introduce `Dialog`, `AlertDialog`, `Toast`, `Badge`, `Card`, `Skeleton`, etc.
- Updates page enhancements
  - Filters (status, tags) + pagination controls on `/projects/[projectId]` wired to API query params.
  - Optional: Markdown rendering preview for update body.
- App chrome
  - Add top navigation with Clerk auth controls in `src/app/layout.tsx`.
- Collaboration UI
  - Members management (add/remove, roles). Implement actions and API per planned endpoints, then UI.
- Perf & accessibility
  - Bundle trim, keyboard/focus pass, and minor performance wins.

## Phase 0: Setup
1. Initialize Next.js App Router (TS), Tailwind, shadcn/ui.
2. Configure Clerk (env keys, middleware) and protected routes.
3. Add Prisma with PostgreSQL; create `prisma/schema.prisma` from Data-Modeling.md.
4. Create `src/lib/db.ts` Prisma client with singleton pattern.
5. Add `src/lib/actions/` with subfolders and barrel `index.ts` files.

## Phase 1: Models & Migrations
1. Run `prisma migrate dev` to create tables.
2. Seed minimal data (optional).
3. Implement Zod validators for projects and updates.

## Phase 2: Actions
1. Implement `projects` actions: create, list, getById, update, archive.
2. Implement `updates` actions: create, list (filters), getById, update, delete.
3. Implement `shareLinks` actions: create, list, update, revoke, getBySlug.

## Phase 3: API Routes
1. Map API endpoints to actions (see API-Design.md).
2. Return consistent JSON shapes and status codes.
3. Add pagination + filtering.

## Phase 4: Pages & Components
1. `/dashboard` — list projects; create project dialog.
2. `/projects/[projectId]` — project header + updates list; new update dialog.
3. `/projects/[projectId]/updates/[updateId]` — update form.
4. `/share/[slug]` — public updates view.

## Phase 5: Performance & Polish
1. Add `loading.tsx` and Suspense boundaries.
2. Optimize queries (indexes, selects).
3. Bundle analyze and reduce JS.
4. Accessibility pass (keyboard, labels, focus).

## Phase 6: Deployment
1. Configure environment variables (Clerk, Database URL).
2. Deploy to Vercel; set `DATABASE_URL` and Clerk keys.
3. Add monitoring and error reporting.
