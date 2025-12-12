# Component requirements: Service stubs

## Purpose
Provide minimal stubs for Zep, LLM, and Graph integrations used by the BFF route handlers.

## Inputs/Outputs
- Zep client accepts ingest, query, and validation requests and returns belief records.
- LLM client accepts chat messages and enriches them with recent context.
- Graph client accepts webhook events and logs them for ingestion.

## External dependencies
- None beyond standard libraries; these are placeholders for third-party SDKs.

## EARS coverage
- REQ-D-001, REQ-D-002, REQ-D-003, REQ-E-001, REQ-E-011, REQ-C-030, REQ-I-001.

## Traceability
- Implementations: `zep-client.ts`, `llm-client.ts`, `graph-client.ts`.
- Assumptions: In-memory storage only; production systems would persist to Zep and include retry policies.
