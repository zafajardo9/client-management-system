# Product Requirements Document (PRD)

## 1. Overview
A platform for creators (admins) to manage projects and publish progress updates/changelogs that can be securely shared with clients via links. One creator can own multiple projects and invite collaborators. Clients can view a project's updates without needing an account (via share links) or via authenticated access if invited.

## 2. Goals and Non-Goals
- Goals
  - Enable creators to create and manage multiple projects.
  - Post rich updates (title, body, attachments, status, tags) and changelogs per project.
  - Generate share links for clients to see the project's updates.
  - Support collaborators per project with role-based access.
  - Fast first load; complete page render (SSR/RSC) for primary data.
  - Provide stable APIs mirrored by server actions.
- Non-Goals (v1)
  - Real-time comments/threads.
  - In-app payments/subscriptions.
  - Complex analytics dashboards.

## 3. Users and Personas
- Creator (Admin)
  - Creates projects, posts updates, manages collaborators, shares with clients.
- Collaborator
  - Limited permissions: can post updates or view depending on role.
- Client Viewer
  - Consumes updates via share link (public or password-protected link).

## 4. Key Use Cases
- Create a project and invite collaborators.
- Post an update with title, markdown body, and optional attachments.
- Share a read-only link of project updates with clients.
- Browse updates timeline with filters (status, tags, date).
- Edit/delete an update.
- Transfer project ownership or share with another user.

## 5. Functional Requirements
- Authentication via Clerk.
- Project CRUD with role-based membership (owner, editor, viewer).
- Updates CRUD with pagination and filters.
- Share links: create, revoke, password protect, and control visibility (all updates or a subset by tag/status).
- Activity log of major actions (optional in v1, but model-ready).
- API endpoints under `src/app/api/...` and server actions under `src/lib/actions/...` with barrel exports.

## 6. Non-Functional Requirements
- Performance: SSR-first, ship minimal JS, cached data, 50ms p75 TTFB for cached routes on Vercel.
- Security: Authz checks on every server action and API handler. Protect share links.
- Reliability: Handle network errors gracefully; idempotent mutations.
- Observability: Structured logging for actions and API; request IDs.
- Accessibility: Follow shadcn/ui and Radix best practices; keyboard nav; color contrast.

## 7. Success Metrics
- Time to First Byte (TTFB) p75 < 200ms uncached; < 50ms cached.
- Time to Interactive (TTI) p75 < 2s on mid-tier devices.
- Error rate on actions < 1%.
- Share link view success rate > 99%.

## 8. Constraints and Assumptions
- Next.js App Router, React Server Components, Node 18+, PostgreSQL.
- Clerk provides user identity. Prisma maps `User` via `clerkUserId`.

## 9. Release Plan (v1)
- Phase 1: Auth + Data model + Dashboard shell.
- Phase 2: Projects CRUD + Updates CRUD + Share Links.
- Phase 3: Polishing, perf, and docs.

## 10. Risks
- Database connection limits (mitigate with pooling and short-lived queries).
- Abuse of public share links (mitigate with tokens, optional password, revocation, rate limiting).
- Unbounded update lists (paginate and index).
