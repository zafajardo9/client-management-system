# Implementation Plan (Step-by-Step)

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
