# Component requirements: services layer

## Purpose
Shared clients and in-memory reliability helpers for Graph, Zep, and LLM orchestration. The services translate API calls into memory operations, enforce idempotency, and capture fallbacks when external services are unavailable.

## Inputs/Outputs
- `graph-client.ts` accepts Graph webhook payloads and emits normalized ingestion documents.
- `zep-client.ts` ingests documents, queries memory, and applies validation updates. When Zep is unreachable it queues documents in `memory-store.ts`.
- `llm-client.ts` builds assistant replies using retrieved memory and validation prompts.
- `memory-store.ts` maintains an in-memory source of truth with retry queues and deduplicated documents.

## External dependencies
- Optional Zep HTTP API (configured via `ZEP_API_URL` + `ZEP_API_KEY`).
- Microsoft Graph (simulated fetch helper awaiting real tokens).

## EARS coverage
- REQ-C-040, REQ-C-042, REQ-D-001, REQ-D-002, REQ-D-003, REQ-E-011, REQ-E-012, REQ-I-001, REQ-I-002.

## Traceability
- Implementations: `graph-client.ts`, `zep-client.ts`, `llm-client.ts`, `memory-store.ts`.
- Idempotent ingestion and queueing captured in `memory-store.ts`.
- Zep push/update with correlation logging hooks in callers.
- Assumptions: actual Graph authentication is supplied by hosting environment; Zep calls gracefully degrade to in-memory persistence when unreachable.
