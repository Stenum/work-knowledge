# UI Requirements

## Purpose
Implements Next.js app router pages and client components for chat (REQ-G-002), manual note input (REQ-G-003), and review/validation (REQ-G-004).

## Inputs/Outputs
- User messages submitted via `ChatPanel` to `/api/chat`.
- Notes submitted via `ManualNoteForm` to `/api/ingest/manual`.
- Review queries and validation actions via `ReviewList` hitting `/api/review` and `/api/validate`.

## Dependencies
- shadcn-style UI components in `src/components/ui/*` with Tailwind styling.
- Providers for React Query and NextAuth sessions.

## Traceability
- REQ-A-001..006: Next.js TS app router with small components.
- REQ-G-001..011: Chat, manual note, and validation flows.
- REQ-G-020: Loading states implemented in chat/manual/review components.
- REQ-F-001..012: UI presents beliefs and allows Accept/Reject/Correct.

## Key Files
- `src/app/page.tsx`
- `src/app/chat/page.tsx`
- `src/app/manual/page.tsx`
- `src/app/review/page.tsx`
- `src/components/chat/ChatPanel.tsx`
- `src/components/notes/ManualNoteForm.tsx`
- `src/components/review/ReviewList.tsx`

## Assumptions
- API endpoints available under `/api/**`.
- Authentication handled globally; UI focuses on feature flows.
