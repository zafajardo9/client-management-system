# Phase 2 Technical Considerations

## Guiding Principles & Feature Vibe
- Carry forward the polished, opinionated feel from Phase 1 while embracing richer, collaborative experiences.
- Keep business logic centralized in server actions under `src/lib/actions/` and mirror contracts through API routes.
- Favor server-driven flows with optimistic enhancements where realtime feedback improves trust.
- Ensure every feature has measurable outcomes (engagement, responsiveness, governance) and instrumentation baked in.

## Growth & Narrative Stack

- Waitlist experience runs through a lightweight lead capture API (`src/lib/actions/waitlist/`) writing to CRM-friendly storage (Prisma table + webhook).
- Validate submissions with Zod; dedupe via email hash and track signup source for attribution.
- Changelog hub backed by `SystemChangelog` model with versioned entries; publish via server components with static revalidation and incremental updates.
- Draft/publish flow uses file-based MDX or rich-text stored in DB with history table for auditability.

## Realtime Infrastructure

- Evaluate Pusher Channels vs. Ably vs. Supabase Realtime for presence + typing indicators.
- Define event contracts for update comments, acknowledgements, and notifications.
- Assess server action patterns for broadcasting updates (consider edge compatibility).

## Data Model Extensions

- `ProjectComment`: threadable comments with soft deletes and author metadata.
- `UpdateAcknowledgement`: track client confirmation with timestamps.
- `BrandingProfile`: store branding assets (logo, theme colors) scoped per project.
- `ClientTag`: assignable labels linked to projects, updates, and clients with many-to-many relations.
- `TaskAppointment`: scheduled touchpoints with references to client tags, collaborator owner, reminders, and statuses.
- `KanbanColumn` / `KanbanCard`: configurable board state per project with ordering metadata and visibility scopes.
- Schema migrations must include indexes for frequent lookups (projectId, updateId).

## Integrations

- Notification pipeline as queue-first (e.g., using Upstash or Vercel Queues) to decouple triggers from sending.
- Slack/Teams webhooks with secret management and retry policies.
- Email templating via Resend or Postmark; ensure plain-text fallbacks.
- Consider CRM integration (HubSpot/AirTable) for waitlist export; abstract via adapter in `src/lib/integrations/`.
- Support RSS + JSON feeds for public changelog consumption.

## Security & Compliance

- Harden share link governance with rate limiting, audit logging, and optional password history.
- Data retention policies for comments and acknowledgements; consider GDPR implications.
- Waitlist entries must respect opt-in/opt-out preferences (double opt-in optional).
- Changelog and board updates require role checks; clients only view columns flagged client-visible.
- Appointment reminders must honor tenant-level notification settings and unsubscribe logic.

## Performance & Observability

- Monitor realtime subscription costs and payload sizes.
- Extend logging to capture comment and notification events with correlation IDs.
- Introduce feature flags for phased rollouts.
- Instrument waitlist conversion funnel, changelog engagement, and Kanban interaction telemetry via analytics provider.
- Cache changelog pages with revalidate tags; invalidate on publish/delete events.
