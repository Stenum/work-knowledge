# Library Requirements

## Purpose
Provides shared utilities including authentication configuration (NextAuth with Azure AD), configuration values, Tailwind helpers, and storage accessors.

## Inputs/Outputs
- Exposes `authOptions` for `/api/auth/[...nextauth]`.
- Supplies environment-driven config for services (Graph, Zep, LLM, ingestion toggles).
- Utility `cn` merges class names; storage helpers persist JSON documents.

## Dependencies
- `next-auth` with Azure AD provider.
- Node `fs` for persistence.

## Traceability
- REQ-B-001..004: Authentication via Microsoft identity using NextAuth.
- REQ-C-040..042: Storage utilities backing ingestion queue and idempotency.
- REQ-J-002/REQ-J-003: Config flags to enable/disable ingestion sources.

## Key Files
- `src/lib/auth.ts`
- `src/lib/config.ts`
- `src/lib/storage.ts`
- `src/lib/utils.ts`
