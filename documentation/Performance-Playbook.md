# Performance Playbook

## Render Strategy
- SSR/RSC-first for complete pages. Avoid client-side waterfalls.
- Use `loading.tsx` + Suspense boundaries for secondary content.
- Avoid large client bundles; prefer server components.

## Data Layer
- Prisma: select only necessary fields; add indexes; paginate.
- Use short-lived queries; avoid N+1 with proper relations and `include/select`.
- Cache safe GETs with `revalidate` where possible. Invalidate cache on mutations.

## Network
- Minimize requests; batch where sensible via actions.
- Use HTTP compression (Vercel default) and proper caching headers.

## Frontend
- Tree-shake and code-split; lazy-load heavy client components.
- Use `next/image` for images; optimize SVGs.
- Keep interaction handlers small; prefer `useTransition` for non-blocking state.

## Tooling and Budgets
- Bundle size budgets per route (JS < 150KB gz). Fail CI if exceeded.
- Lint for `react/no-unstable-nested-components`, exhaustive deps, and `no-floating-promises`.

## Observability
- Basic web vitals logging to console/endpoint.
- Structured logs for actions with request IDs.
