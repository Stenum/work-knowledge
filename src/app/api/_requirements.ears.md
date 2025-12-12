# API Route Handlers Requirements

## Purpose
Implements BFF endpoints (REQ-H-001, REQ-A-006) for chat orchestration, manual ingestion, review retrieval, validation actions, and Microsoft Graph webhook intake.

## Inputs/Outputs
- `/api/chat` accepts `{ message, recentDays? }` and returns chat response plus beliefs (Zod validated, REQ-H-010).
- `/api/ingest/manual` accepts `{ content }` and returns created document (Zod validated).
- `/api/review` accepts `{ topic }` and returns matching beliefs.
- `/api/validate` accepts `{ id, action, text? }` and returns updated belief.
- `/api/webhooks/graph` accepts Graph notifications and triggers ingestion or queueing.

## External Dependencies
- Services in `src/services/*` for Graph/Zep/LLM/validation.
- Microsoft Graph webhook payload format.

## Traceability
- REQ-H-001, REQ-H-002 implemented via route handlers under `/app/api/**`.
- REQ-H-010 enforced using Zod schemas per endpoint.
- REQ-C-020 manual ingestion via `/api/ingest/manual`.
- REQ-F-001..012 via `/api/review` and `/api/validate`.
- REQ-C-010..013, REQ-C-050..052 partially supported via `/api/webhooks/graph` and subscription helpers.
- REQ-E-010..012 through `/api/chat` and downstream services.

## Key Files
- `src/app/api/chat/route.ts`
- `src/app/api/ingest/manual/route.ts`
- `src/app/api/review/route.ts`
- `src/app/api/validate/route.ts`
- `src/app/api/webhooks/graph/route.ts`

## Assumptions
- Authentication middleware provides Graph tokens (placeholder in webhook route).
- Webhook validation handshake omitted for brevity; add for production.
