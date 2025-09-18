# Testing Strategy

This project uses Vitest for unit/integration testing of server actions and API route handlers.

## Goals

- Ensure every new API route and server action has corresponding tests.
- Prevent regressions with fast feedback in CI/local.
- Keep tests isolated from external services with mocks.

## Scope and Conventions

- API route tests live under `src/tests/api/` mirroring the route path.
  - Example: `src/app/api/projects/route.ts` → `src/tests/api/projects.route.test.ts`
  - Example: `src/app/api/projects/[id]/route.ts` → `src/tests/api/projects.id.route.test.ts`
  - Example: `src/app/api/updates/[updateId]/route.ts` → `src/tests/api/updates.updateId.route.test.ts`
- Action tests (optional initially) may live under `src/tests/actions/<domain>.test.ts`.
- Test file naming: use `.test.ts` or `.spec.ts`.

## Mocks

- Mock `@/lib/actions` when testing API routes to avoid DB/Clerk calls.
- For action tests, mock `@/lib/db` (Prisma client) and any external SDKs.

## Examples

- See the following files for working patterns:
  - `src/tests/api/projects.route.test.ts`
  - `src/tests/api/projects.id.route.test.ts`
  - `src/tests/api/projects.id.updates.route.test.ts`
  - `src/tests/api/updates.updateId.route.test.ts`
  - `src/tests/api/projects.id.share-links.route.test.ts`
  - `src/tests/api/share-links.id.route.test.ts`
  - `src/tests/api/share.slug.route.test.ts`

## Running Tests

- Run suite: `npm run test`
- Watch mode: `npm run test:watch`
- Coverage: `npm run test:coverage`

## Requirements (Must Do)

- When you add a new API route under `src/app/api/...`, add a matching test under `src/tests/api/...`.
- When you add or modify a server action in `src/lib/actions/...`, add/update tests.
- For every new page that depends on server actions or API routes, ensure those backends have tests.
- Keep error shape consistent in tests: `{ error: { code: string; message: string; details?: any } }`.

## CI Guidance

- Block merges if `npm run test` fails.
- Aim to keep coverage growing over time (recommended: lines >= 80% for API routes).
