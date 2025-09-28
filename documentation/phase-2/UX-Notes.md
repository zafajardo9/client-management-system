# Phase 2 UX Notes

## Design System Direction
- Lean into a modern, spacious layout that mirrors Phase 1 but elevates polish with Tailwind utility composition and shadcn/ui primitives.
- Prioritize consistency by reusing shared component patterns (e.g., `Card`, `Dialog`, `DropdownMenu`, `Avatar`, `Toast`) and extending variants locally when needed.
- Ensure every interactive flow includes responsive states (hover, focus, disabled, loading) using Tailwind state modifiers and shadcn/ui accessible underpinnings.
- Every surface must support both light and dark themes; gradients, backgrounds, and typography should include `dark:` variants to preserve contrast and mood.
- Establish a brand-defining gradient motif that persists in both themes. Configure gradient tokens/utilities in `src/app/globals.css` and apply layered backgrounds at the page shell level (e.g., `src/app/page.tsx`), while keeping foreground cards readable via light/dark surface variants.

## Growth & Narrative

- Waitlist signup should feel premium: use `Card` + `Stepper` pattern with subtle gradients and trust markers.
- Capture goals/use cases in contextual helper text so prospects understand value before submitting.
- Changelog hub organized by quarters with `Accordion` groupings and inline `Badge` chips for status (Shipped, In Progress, Planned).
- Provide filters for changelog (tags, date) using `Tabs` or `SegmentedControl`, and ensure future roadmap entries stand out.
- Surface CTAs to join waitlist or request demos throughout changelog sections.

## Collaboration Enhancements

- Comment threads should support nested replies up to two levels for clarity.
- Presence indicators display attendee avatars with live status (typing, viewing, idle).
- Notifications: users configure channel preferences; ensure digest mode for high-volume projects.
- Project Kanban board uses draggable `Card` columns with color-coded stages and inline indicators for assignees and due dates.
- Kanban columns should expose quick actions (`DropdownMenu`) for status, reassignment, and client visibility toggles.

## Client Engagement

- Acknowledgement flow prompts clients to confirm receipt; provide optional notes field.
- Health dashboard surfaces key metrics (updates published this month, outstanding acknowledgements).
- Branding controls offer real-time preview and accessibility checks (contrast, font choices).
- Client tagging UI should highlight segment badges with `Tooltip` previews and allow bulk tag application.
- Task appointment flow pairs calendar picker (`Popover` + `Calendar`) with timezone hints and reminder toggles.
- Provide clients a read-only Kanban snapshot with callouts for tasks needing feedback.

## Governance & Integrations

- Share link settings display upcoming password expiration and allow one-click rotation.
- Slack/Teams notifications include deep links back to the update detail view.
- Bulk import/export uses guided steps with progress indicator and validation summary.
- Waitlist admin view should support status filters (new, engaged, converted) and export actions.
- Changelog editing uses autosave drafts with version history to preserve transparency.

## Accessibility Considerations

- Maintain keyboard operability for all new interactive elements (comments, modals, toggles).
- Provide screen reader announcements for realtime changes (e.g., new comment posted).
- Ensure all notifications have semantic roles and dismiss actions.
- Include ARIA drag-and-drop hints for Kanban interactions and appointment scheduling components.
