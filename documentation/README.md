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

See each document in `documentation/` and standards in `rules/` for details.
 