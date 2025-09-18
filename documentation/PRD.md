# Product Requirements Document (PRD)

## 1. Overview

A platform with authentication (Clerk) where a logged-in creator can manage multiple projects and publish progress updates/changelogs. Projects can be shared via secure links for clients to view, and creators can invite other authenticated users as collaborators with roles. Clients can view a project's updates without an account via share links, or via authenticated access if invited.

## 2. Goals and Non-Goals

- Goals
  - Enable authenticated users (creators) to create and manage multiple projects.
  - Post rich updates (title, markdown body, status, tags) and changelogs per project.
  - Generate share links for clients to see project updates.
  - Invite collaborators per project with role-based access.
  - Allow ownership transfer of a project from one user to another (owner-only).
  - Fast first load; complete page render (SSR/RSC) for primary data.
  - Provide stable APIs mirrored by server actions.

- Non-Goals (v1)
  - Real-time comments/threads.
  - In-app payments/subscriptions.
  - Complex analytics dashboards.

## 3. Users and Personas

- Creator (Admin)
  - Creates projects, posts updates, manages collaborators, shares with clients, can transfer ownership.
- Collaborator
  - Limited permissions by role: OWNER/EDITOR/VIEWER.
- Client Viewer
  - Consumes updates via share link (public or password-protected link) without logging in.

## 4. Key Use Cases

- Login via Clerk and create multiple projects.
- Invite collaborators (add member) to a project with a role.
- Post an update with title, markdown body, and tags.
- Share project updates via a public share link (optionally password-protected) with visibility control.
- Browse updates timeline with filters (status, tags, date).
- Edit/delete an update.
- Transfer project ownership to another authenticated user (owner-only).

## 5. Functional Requirements

- Authentication via Clerk.
- Project CRUD with role-based membership (OWNER, EDITOR, VIEWER).
- Ownership transfer (OWNER can designate another member as OWNER; previous owner becomes EDITOR by default).
- Updates CRUD with pagination and filters.
- Share links: create, revoke, password protect, and control visibility (ALL vs PUBLISHED_ONLY) and tag filters.
- Activity log of major actions (optional in v1, but model-ready).
- API endpoints under `src/app/api/...` and server actions under `src/lib/actions/...` with barrel exports.

## 6. Non-Functional Requirements

- Performance: SSR-first, ship minimal JS, cached data, 50ms p75 TTFB for cached routes on Vercel.
- Security: Authz checks on every server action and API handler. Protect share links.
- Reliability: Handle network errors gracefully; idempotent mutations.
- Observability: Structured logging for actions and API; request IDs.
- Accessibility: Follow shadcn/ui and Radix best practices; keyboard nav; color contrast.

## 6.1 Access Control

- All creator routes require authentication.
- Authorization checks in every server action based on membership role.
- Public share routes are accessible without login but limited to data allowed by the link configuration (visibility and tags, optional password).

## 7. Success Metrics
- Time to First Byte (TTFB) p75 < 200ms uncached; < 50ms cached.
- Time to Interactive (TTI) p75 < 2s on mid-tier devices.
- Error rate on actions < 1%.
- Share link view success rate > 99%.

## 8. Constraints and Assumptions

- Next.js App Router, React Server Components, Node 18+, PostgreSQL.
- Clerk provides user identity. Prisma maps `User` via `clerkUserId`.
- Environment configuration via `.env` and `.env.local` for Clerk and Database.
- Middleware protects non-public routes.

## 9. Release Plan (v1)
- Phase 1: Auth + Data model + Dashboard shell.
- Phase 2: Projects CRUD + Updates CRUD + Share Links.
- Phase 3: Polishing, perf, and docs.

## 10. Risks
- Database connection limits (mitigate with pooling and short-lived queries).
- Abuse of public share links (mitigate with tokens, optional password, revocation, rate limiting).
- Unbounded update lists (paginate and index).
