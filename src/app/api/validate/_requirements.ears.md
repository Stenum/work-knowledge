# Component requirements: /api/validate

## Purpose
Apply Accept/Reject/Correct actions to beliefs and persist the updated status back to memory/Zep.

## Inputs/Outputs
- **POST /api/validate** accepts `{ beliefId, action: 'accept'|'reject'|'correct', correctedText? }`.
- Returns `{ success: boolean, belief: { id, content, status } | null }`.

## External dependencies
- `@/lib/services/zep-client` for validation updates.

## EARS coverage
- REQ-H-001, REQ-H-002, REQ-H-010, REQ-F-010, REQ-F-011, REQ-F-012, REQ-I-002.

## Traceability
- Implementation: `route.ts` (Zod validation, correlation logging, status updates).
- Dependencies: `@/lib/services/zep-client`, `@/lib/schemas/validate`.
- Assumptions: A corrected text marks the belief as `corrected` and persists content changes.
