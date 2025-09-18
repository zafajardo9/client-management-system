# Component Organization

Organize by page and usage, with local barrels for ergonomic imports.

## Principles
- Keep components small, focused, and colocated with their page.
- Promote shared atoms/molecules to `src/components/shared/`.
- Prefer Server Components; use Client Components only for interactivity.

## Example
```
src/app/projects/[projectId]/
  page.tsx               // RSC page: fetches project + updates
  loading.tsx            // skeletons
  components/
    ProjectHeader.tsx    // server or client if interactive
    UpdatesList.tsx      // server-driven list
    NewUpdateDialog.tsx  // client component (form)
    index.ts             // barrel export
```

## Barrel Export Pattern
```ts
// src/app/projects/[projectId]/components/index.ts
export { default as ProjectHeader } from "./ProjectHeader";
export { default as UpdatesList } from "./UpdatesList";
export { default as NewUpdateDialog } from "./NewUpdateDialog";
```

## Shadcn/ui Usage
- Use primitives and compose variants with Tailwind.
- Keep variant creation in the component file; document props with TS types.
