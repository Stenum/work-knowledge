# Component requirements: Chat page

## Purpose
Provides a chat UI for interacting with the assistant using the `/api/chat` endpoint.

## Inputs/Outputs
- Sends user messages to `/api/chat`.
- Renders assistant replies and system notices about memory retrieval.

## External dependencies
- Chat route handler for responses.
- Tailwind + shadcn components for layout and inputs.

## EARS coverage
- REQ-G-001, REQ-G-002, REQ-G-010, REQ-G-020, REQ-E-001.

## Traceability
- Implementation: `page.tsx` consuming `ChatInterface`.
- Dependencies: `@/components/chat/chat-interface`.
- Assumptions: Streaming is not yet wired; responses arrive as full payloads.
