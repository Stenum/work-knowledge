# Component requirements: Manual notes page

## Purpose
Allow the user to submit ad-hoc notes for ingestion into Zep with clear feedback on success or failure.

## Inputs/Outputs
- Renders `ManualNoteForm` which posts to `/api/ingest/manual`.
- Displays loading state and success/error messages.

## External dependencies
- `/api/ingest/manual` BFF endpoint.
- shadcn/ui components.

## EARS coverage
- REQ-G-001, REQ-G-003, REQ-G-011, REQ-G-020, REQ-C-020.

## Traceability
- Implementation: `page.tsx` using `ManualNoteForm` at `@/components/notes/manual-note-form`.
- Assumptions: Note body is free-form text; backend handles metadata enrichment.
