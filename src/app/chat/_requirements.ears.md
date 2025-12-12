# Component requirements: Chat page

## Purpose
Provide the primary chat interface for interacting with the assistant, displaying responses and the context the assistant used.

## Inputs/Outputs
- Renders the `ChatInterface` component.
- Sends messages to `/api/chat` and surfaces context returned by the backend.

## External dependencies
- BFF endpoint `/api/chat` validated with Zod.
- UI primitives from shadcn/ui.

## EARS coverage
- REQ-G-001, REQ-G-002, REQ-G-010, REQ-G-020, REQ-E-020.

## Traceability
- Implementation: `page.tsx` delegates to `ChatInterface` in `@/components/chat/chat-interface`.
- Assumptions: Authentication handled globally; component focuses on UX and request orchestration.
