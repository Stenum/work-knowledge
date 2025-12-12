# Component requirements: /api/ingest/manual

## Purpose
Receives manual notes from the UI and ingests them into Zep with metadata identifying the manual source.

## Inputs/Outputs
- **POST /api/ingest/manual** accepts `{ note: string }`.
- Returns `{ id: string, ingestedAt: string }` representing the stored belief.

## External dependencies
- Zep client stub for ingestion.
- Zod schema for boundary validation.

## EARS coverage
- REQ-H-001, REQ-H-002, REQ-H-010, REQ-C-020, REQ-C-030.

## Traceability
- Implementation: `route.ts` (validates payload, invokes ingestion helper).
- Dependencies: `@/lib/schemas/ingest`, `@/lib/services/zep-client`.
- Assumptions: Persistence is in-memory for the MVP; production would persist to Zep.
