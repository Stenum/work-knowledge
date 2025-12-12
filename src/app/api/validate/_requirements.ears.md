# Component requirements: /api/validate

## Purpose
Applies validation actions (accept, reject, correct) to beliefs stored in Zep.

## Inputs/Outputs
- **POST /api/validate** accepts `{ beliefId: string, action: 'accept'|'reject'|'correct', correctedText?: string }`.
- Returns `{ success: boolean, belief: Belief | null }` describing the update result.

## External dependencies
- Zep client stub for updating belief state.
- Zod schema for validation.

## EARS coverage
- REQ-H-001, REQ-H-002, REQ-H-010, REQ-F-010, REQ-F-011, REQ-F-012.

## Traceability
- Implementation: `route.ts` (validates payload, applies updates via Zep client).
- Dependencies: `@/lib/schemas/validate`, `@/lib/services/zep-client`.
- Assumptions: Corrections immediately set status to accepted in this MVP.
