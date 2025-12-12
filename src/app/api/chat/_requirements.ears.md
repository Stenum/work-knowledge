# Component requirements: /api/chat

## Purpose
Implements the chat orchestration endpoint that brokers requests between the UI, Zep memory, and the LLM stub.

## Inputs/Outputs
- **POST /api/chat** accepts a JSON body `{ message: string, recentDays?: number }`.
- Returns `{ reply: string, context: Belief[] }` where beliefs summarize recent Zep context.

## External dependencies
- Zep client stub for context retrieval.
- LLM client stub to compose responses with retrieved context.

## EARS coverage
- REQ-H-001, REQ-H-002, REQ-H-010, REQ-E-010, REQ-E-011, REQ-E-020, REQ-I-002.

## Traceability
- Implementation: `route.ts` (validates with Zod, logs correlation IDs).
- Dependencies: `@/lib/services/zep-client`, `@/lib/services/llm-client`, `@/lib/schemas/chat`.
- Assumptions: Authentication is stubbed; tokens would be supplied by auth middleware in a production environment.
