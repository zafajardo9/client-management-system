# Frontend Structure

Using Next.js App Router with RSC-first. Components are organized by page, with local `index.ts` barrels. Shared atoms live under `src/components/shared/`.

## Routes (proposed)
- `/dashboard` — list of your projects, create project CTA
- `/projects/[projectId]` — project overview + updates list
- `/projects/[projectId]/updates/[updateId]` — update details/edit
- `/share/[slug]` — public client view for updates

## Directory Structure (proposed)
```
src/
  app/
    dashboard/
      page.tsx
      loading.tsx
      components/
        ProjectCard.tsx
        CreateProjectDialog.tsx
        index.ts
    projects/
      [projectId]/
        page.tsx
        loading.tsx
        components/
          UpdatesList.tsx
          ProjectHeader.tsx
          NewUpdateDialog.tsx
          index.ts
        updates/
          [updateId]/
            page.tsx
            components/
              UpdateForm.tsx
              index.ts
    share/
      [slug]/
        page.tsx
        loading.tsx
        components/
          PublicUpdateList.tsx
          index.ts
  components/
    shared/
      EmptyState.tsx
      PageHeader.tsx
      DataTable.tsx
      index.ts
  lib/
    actions/
      projects/
        createProject.ts
        getProjects.ts
        updateProject.ts
        index.ts
      updates/
        createUpdate.ts
        getUpdates.ts
        updateUpdate.ts
        index.ts
      shareLinks/
        createShareLink.ts
        getShareLinks.ts
        index.ts
      index.ts
    db.ts
    validators/
      projects.ts
      updates.ts
      index.ts
  app/api/...
```

## UI & Forms
- shadcn/ui components for consistent, accessible UI.
- Forms: `react-hook-form` + `@hookform/resolvers/zod` for validation.
- Prefer RSC for data fetching. Use Client Components only for interactive pieces.

## Shared Atoms (created)
- `src/components/shared/PageHeader.tsx` — page title/subtitle with optional actions.
- `src/components/shared/EmptyState.tsx` — empty-state pattern.
- Barrel: `src/components/shared/index.ts`.

## Data Fetching
- Fetch primary data in the page (RSC) so the whole page loads complete.
- Use `loading.tsx` for skeletons.
- Use streaming for secondary sections below the fold as needed.

## shadcn/ui Components to Generate (initial set)
These are the primitives we will standardize on next. Please generate these with `shadcn/ui` and Tailwind classes.

- Forms
  - Button
  - Input
  - Textarea
  - Label
  - Select

- Layout & Content
  - Card
  - Separator
  - Skeleton
  - Badge

- Overlays & Feedback
  - Dialog
  - AlertDialog
  - Toast (with Toaster and hook)
  - Tooltip

- Tables (optional in v1)
  - Table

Mapping to pages/components
- Dashboard (`src/app/dashboard/page.tsx`)
  - Card for project list container; Button/Input/Textarea/Label for CreateProjectForm.
- Project page (`src/app/projects/[projectId]/page.tsx`)
  - NewUpdateForm uses Button/Input/Textarea/Select/Label.
  - Updates list uses Badge for tags; Skeleton for loading; later Card/Table if needed.
  - ShareLinksSection uses Button/Input/Select/Label; AlertDialog for destructive revoke; Toast for feedback.
- Update detail (`src/app/projects/[projectId]/updates/[updateId]/page.tsx`)
  - UpdateForm uses Button/Input/Textarea/Select/Label; AlertDialog for delete.
- Public share (`src/app/share/[slug]/page.tsx`)
  - Badge for tags; Skeleton for loading.

Notes
- Keep components tree-shakeable; prefer server-rendered pages and small client footprints.
- If Tailwind v4 is kept, ensure shadcn templates are compatible; otherwise prefer Tailwind v3.4.x for maximum compatibility.
