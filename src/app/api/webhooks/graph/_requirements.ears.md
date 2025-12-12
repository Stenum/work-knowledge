# Component requirements: /api/webhooks/graph

## Purpose
Receives Graph webhook notifications and forwards them to the ingestion pipeline.

## Inputs/Outputs
- **POST /api/webhooks/graph** accepts the standard Graph notification envelope with a `value` array.
- Responds with `{ received: true }` after logging/queuing events.

## External dependencies
- Graph client stub to enqueue events.
- Zod schema to validate incoming notifications.

## EARS coverage
- REQ-H-001, REQ-H-002, REQ-H-010, REQ-C-010, REQ-C-011, REQ-C-012, REQ-C-013, REQ-C-050.

## Traceability
- Implementation: `route.ts` (validates and logs webhook deliveries).
- Dependencies: `@/lib/services/graph-client`, `@/lib/schemas/webhook`.
- Assumptions: This MVP simply logs events; persistence and replay queues would be added later.
