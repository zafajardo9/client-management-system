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

## Data Fetching
- Fetch primary data in the page (RSC) so the whole page loads complete.
- Use `loading.tsx` for skeletons.
- Use streaming for secondary sections below the fold as needed.
