# Component requirements: /api/chat

## Purpose
Chat orchestration endpoint that validates user prompts, retrieves memory context, and composes LLM-style responses while honoring validation requirements.

## Inputs/Outputs
- **POST /api/chat** accepts `{ message: string, recentDays?: number }`.
- Returns `{ reply: string, context: Belief[] }` where beliefs include source metadata and validation status.

## External dependencies
- `@/lib/services/zep-client` for context retrieval.
- `@/lib/services/llm-client` for composing the response.

## EARS coverage
- REQ-H-001, REQ-H-002, REQ-H-010, REQ-E-010, REQ-E-011, REQ-E-020, REQ-I-002.

## Traceability
- Implementation: `route.ts` (Zod validation, correlation logging, context-first responses).
- Dependencies: `@/lib/services/zep-client`, `@/lib/services/llm-client`, `@/lib/schemas/chat`.
- Assumptions: Authentication/session middleware provides Graph tokens separately.
