# Component requirements: /api/review

## Purpose
Expose beliefs from memory for review and validation workflows with optional topic filtering.

## Inputs/Outputs
- **GET /api/review?topic=optional** returns `{ beliefs: Belief[] }` including source metadata and validation status.

## External dependencies
- `@/lib/services/zep-client` for querying memory.

## EARS coverage
- REQ-H-001, REQ-H-002, REQ-H-010, REQ-F-001, REQ-F-002, REQ-I-002.

## Traceability
- Implementation: `route.ts` (query validation + correlation logging).
- Dependencies: `@/lib/schemas/review`, `@/lib/services/zep-client`.
- Assumptions: Topic filter performs substring matching against content/subject/topic hints.
