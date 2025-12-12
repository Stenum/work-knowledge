# Component requirements: Manual note page

## Purpose
Allows the user to submit manual notes that are ingested into Zep as manual source documents.

## Inputs/Outputs
- Submits `{ note }` to `/api/ingest/manual`.
- Displays success or error status for the ingestion attempt.

## External dependencies
- Manual ingestion API.
- Tailwind + shadcn components for layout and controls.

## EARS coverage
- REQ-G-001, REQ-G-003, REQ-G-011, REQ-G-020, REQ-C-020.

## Traceability
- Implementation: `page.tsx` consuming `ManualNoteForm`.
- Dependencies: `@/components/notes/manual-note-form`.
- Assumptions: Authentication is stubbed; UI relies on optimistic feedback.
