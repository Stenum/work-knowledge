# Services module requirements

## Purpose
Provides server-side service layer for Microsoft Graph integration, Zep memory operations, LLM orchestration, validation, ingestion queueing, and subscription management. Each file has single responsibility (REQ-A-006).

## Inputs/Outputs
- Receives documents and belief updates from BFF route handlers.
- Reads/writes JSON storage in `.data` via storage helpers.
- Communicates with external Graph SDK (graphClient) and simulates Zep/LLM interactions.

## Dependencies
- Microsoft Graph SDK (`@microsoft/microsoft-graph-client`).
- Local storage utilities.
- Environment configuration from `src/lib/config.ts`.

## Requirement Traceability
- REQ-C-042: Idempotent ingestion in `zepClient.ts`.
- REQ-D-001/REQ-D-002: Memory ingest/search implemented in `zepClient.ts`.
- REQ-E-001/REQ-E-010: Chat orchestration implemented in `assistantOrchestrator.ts`.
- REQ-C-020: Manual ingestion handled in `assistantOrchestrator.ts`.
- REQ-C-040/REQ-C-041: Queueing and retry metadata captured in `ingestionQueue.ts`.
- REQ-C-050..052: Subscription state persisted in `subscriptionStore.ts`.
- REQ-F-010..012: Validation actions implemented in `validationService.ts`.
- REQ-I-001..002: Logging hooks ready via service boundaries (placeholder for observability).

## Key Files
- `src/services/assistantOrchestrator.ts`
- `src/services/zepClient.ts`
- `src/services/graphClient.ts`
- `src/services/ingestionQueue.ts`
- `src/services/subscriptionStore.ts`
- `src/services/validationService.ts`

## Assumptions & Limitations
- Uses local JSON storage for demonstration; production should replace with persistent DB.
- Graph token retrieval is delegated to NextAuth session; not included in service signatures.
- Zep API calls simulated locally to satisfy architecture without external calls.
