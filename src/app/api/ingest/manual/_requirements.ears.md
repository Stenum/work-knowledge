# Component requirements: /api/ingest/manual

## Purpose
Accept manual notes from the UI and ingest them into Zep (or the in-memory queue) with consistent metadata.

## Inputs/Outputs
- **POST /api/ingest/manual** accepts `{ note: string }`.
- Returns `{ id: string, ingestedAt: string }`.

## External dependencies
- `@/lib/services/zep-client` to persist the note.

## EARS coverage
- REQ-H-001, REQ-H-002, REQ-H-010, REQ-C-020, REQ-C-030, REQ-I-001.

## Traceability
- Implementation: `route.ts` (validates payload and logs correlation ID).
- Dependencies: `@/lib/services/zep-client`, `@/lib/schemas/ingest`.
- Assumptions: Zep credentials optional; ingestion is still stored locally if remote call fails.
