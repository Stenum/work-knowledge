# Component requirements: /api/review

## Purpose
Provides beliefs for a requested topic so the UI can render a review and validation list.

## Inputs/Outputs
- **GET /api/review?topic=...** with optional topic string.
- Returns `{ beliefs: Belief[] }` reflecting current stored beliefs.

## External dependencies
- Zep client stub for querying memory.

## EARS coverage
- REQ-H-001, REQ-H-002, REQ-H-010, REQ-F-001, REQ-F-002.

## Traceability
- Implementation: `route.ts` (validates query string and returns beliefs).
- Dependencies: `@/lib/schemas/review`, `@/lib/services/zep-client`.
- Assumptions: Filtering is text-based; future iterations can request structured filters.
