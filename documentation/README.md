# Client Management System — Documentation

Welcome to the documentation for the Admin + Client update sharing platform.
This system uses Next.js (App Router), TypeScript, Prisma, Clerk, shadcn/ui, and Tailwind CSS.

- Stack: Next.js 14+, React Server Components, Prisma (PostgreSQL), Clerk, shadcn/ui, Tailwind CSS, Zod
- Principles: Senior-level code quality, performance-first, organized components per page, SSR-first to deliver complete pages, server actions + API parity, barrel exports (`index.ts`).

## Table of Contents

- PRD: `documentation/PRD.md`
- Architecture: `documentation/Architecture.md`
- Data Modeling: `documentation/Data-Modeling.md`
- API Design: `documentation/API-Design.md`
- Testing Strategy: `documentation/Testing-Strategy.md`
- Frontend Structure: `documentation/Frontend-Structure.md`
- Performance Playbook: `documentation/Performance-Playbook.md`
- Implementation Plan: `documentation/Implementation-Plan.md`
- Engineering Rules: `rules/ENGINEERING_RULES.md`

## Quick Overview

- Audience: Project creators (admins) and clients who consume shared updates via secure links.
- Core: A creator can create multiple projects, post updates/changelogs, and share them with clients via links. Projects can have multiple collaborators.
- Auth: Clerk for secure, fast authentication.
- Data: Prisma models with indexes for fast queries; strict TypeScript + Zod validation.
- UI: shadcn/ui + Tailwind; components organized by page with barrel exports.
- Perf: Prefer RSC/SSR, stream with Suspense only for secondary content, cache smartly, ship minimal JS.

## Features

- Multi-project per authenticated user (creator)
- Role-based collaboration per project (Owner, Editor, Viewer)
- Updates per project with status, markdown body, and tags
- Share links with visibility controls (ALL or PUBLISHED_ONLY) and optional tag filters
- Public updates view by share slug (no login required)
- Consistent server actions powering both RSC and API routes

## Directory Highlights

- `src/app/` — App Router routes (dashboard + public share pages)
- `src/components/` — Page-scoped and shared components with barrel exports
- `src/lib/` — Server actions, db client, validators, utilities
- `src/app/api/` — Route handlers (API), aligned with actions in `src/lib/actions`
- `prisma/` — Prisma schema and migrations

## Conventions

- Always create `index.ts` barrels for component folders and action folders.
- Keep server actions colocated in `src/lib/actions/` and import from API handlers and RSC components.
- SSR-first: fetch data on the server so pages load complete. Use Suspense for secondary modules only.
- Validate all inputs with Zod. Return consistent error shapes.

## Authentication & Access Control

- Clerk handles login, session, and user identity.
- Middleware protects all routes except `/`, `/share/*`, and `/api/share/*`.
- Authenticated creators can create and manage multiple projects.
- Projects support collaborators with roles:
  - OWNER: full control, can transfer ownership
  - EDITOR: create and edit updates
  - VIEWER: read-only access
  - Access checks are enforced in server actions and mirrored by API handlers.

## Getting Started

1. Create environment files
   - `.env` (root) — must include `DATABASE_URL` for Prisma CLI
   - `.env.local` — include Clerk keys and any Next.js runtime env
     - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
     - `CLERK_SECRET_KEY`

2. Install dependencies
   - `npm install`

3. Generate Prisma Client and run migrations
   - `npx prisma generate`
   - `npx prisma migrate dev --name init`

4. Run the app
   - `npm run dev` then open <http://localhost:3000>

Notes
- Middleware protects all routes except `/`, `/share/*`, and `/api/share/*`.
- API route handlers mirror server actions under `src/lib/actions/*`.
- Every new API route and every page backed by server actions MUST include corresponding tests. See `documentation/Testing-Strategy.md`.

See each document in `documentation/` and standards in `rules/` for details.