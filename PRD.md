# PRD.md

# Project: Personal Assistant with Zep Memory (Teams/Outlook/Calendar + Manual Notes)

## 1. Summary
A personal assistant that reasons about Ask as a person and about day-to-day work conversations and artifacts (Microsoft Teams, Outlook email, calendar, and manual inputs). The assistant stores structured, up-to-date memory in Zep and supports a lightweight “review & validate” loop so Ask can correct or confirm facts conversationally.

This project intentionally avoids ontology work, semantic web tooling, and bespoke data modeling. It relies on:
- Microsoft Graph for data access (Teams/Outlook/Calendar)
- Zep for memory storage and retrieval
- An LLM provider for reasoning and conversational UX

The system you build is primarily: UI + BFF + ingestion + orchestration glue.

---

## 2. Goals
- Provide a chat-based assistant that answers questions using relevant, recent work context.
- Ingest Teams messages, emails, calendar events, and manual notes into Zep with minimal metadata.
- Provide a “Review & Validate” workflow to confirm/correct what the assistant believes.
- Keep the architecture minimal and library-first, using standard components wherever possible.
- Make requirements easy to evolve: **each implemented component must have an EARS section written AFTER implementation**.

---

## 3. Non-Goals
- Building a formal ontology (OWL/SHACL), a triplestore, or SPARQL endpoints.
- Building a full analytics dashboard or BI tool.
- Perfect recall of everything ever seen (focus is on relevance + recency, with access to history on demand).
- Replacing Microsoft compliance solutions (eDiscovery, retention policies, etc.).
- Multi-user or enterprise-grade tenancy (v1 assumes single-user, personal deployment).

---

## 4. Users & Personas
### Primary user
- Ask (single user)

### Secondary “users” (systems)
- Microsoft Graph
- Zep
- LLM provider

---

## 5. User Stories
### Chat
- As Ask, I want to ask “What’s important today?” and get a concise answer grounded in recent Teams/Email/Calendar.
- As Ask, I want to ask “What do you know about Adam?” and get a structured summary with evidence.
- As Ask, I want the assistant to say “I’m not sure” when it lacks evidence and to ask me clarifying questions.

### Review & Validate
- As Ask, I want to review what the assistant believes about a topic/entity and quickly Accept/Reject items.
- As Ask, I want to correct a fact in plain language and have the memory updated accordingly.

### Manual input
- As Ask, I want to add a note (“Remember: Christian prefers architecture-first decisions”) and have it used in future answers.

### Control
- As Ask, I want to toggle data sources (Teams/Email/Calendar/Notes) on/off.

---

## 6. Functional Requirements (System-Level, minimal)
### Ingestion
- Ingest Teams messages (where Ask is participant) into Zep.
- Ingest Outlook emails (sent/received by Ask) into Zep.
- Ingest Calendar events (created/updated on Ask’s primary calendar) into Zep.
- Ingest manual notes into Zep.

### Assistant orchestration
- Provide a chat endpoint where an LLM can:
  - query Zep for relevant memory
  - return an answer and optionally a validation payload (facts to confirm)
- Provide a “review” endpoint that returns candidate beliefs/facts for a topic.

### Validation
- Support Accept/Reject on a list of candidate facts.
- Support “free-text correction” (Ask writes a correction) that the LLM converts into a structured update call to Zep.

### Configuration
- Allow enabling/disabling each source.
- Store OAuth credentials and API keys securely.

---

## 7. Non-Functional Requirements
### Simplicity
- Prefer libraries over custom code.
- Minimal glue services; consolidate where reasonable.

### Maintainability
- Small components, split into files.
- Clear boundaries: UI, BFF, ingestion, adapters.
- Every implemented component must have:
  - A concise README header comment (what it does)
  - An EARS requirements block **written AFTER implementation** (see AGENTS.md)

### Security
- Least-privilege Graph scopes.
- Secrets in env vars / secret manager (no secrets in repo).
- Audit-friendly logging without storing sensitive content in logs.

### Reliability
- Ingestion uses queue/retry with backoff.
- Idempotency for ingestion events.

### Privacy
- Transparent source toggles.
- Clear “what is being ingested” indicators.

---

## 8. UX Requirements (v1)
### Chat UI
- A single-page chat experience
- Show citations/evidence snippets (lightweight)
- “Review knowledge” action from chat

### Review UI
- List facts with:
  - statement text
  - optional evidence source indicator (Teams/Email/Calendar/Manual)
  - Accept / Reject controls

### Settings UI
- Toggle switches for each source
- Connection status indicators (Graph/Zep/LLM)

---

## 9. Technical Constraints
- Frontend/BFF must use:
  - React + Next.js + Node.js
- Prefer a well-supported UI library:
  - shadcn/ui + Tailwind CSS (recommended default)
- Prefer minimal state management:
  - React state + server actions / API routes; avoid heavy client stores unless needed
- Component size:
  - Small, single-responsibility components, split into files

---

## 10. Proposed Architecture (Minimal)
### Components
1) **Next.js App**
   - UI pages (Chat, Review, Settings)
   - BFF endpoints (API routes / route handlers)
2) **Ingestion Worker (Node)**
   - Receives Graph change notifications OR scheduled polling
   - Fetches item content
   - Sends to Zep
3) **Adapters**
   - Graph adapter (fetch message/email/event)
   - Zep adapter (ingest/query/update)
   - LLM adapter (chat with tool-calling)

### Data flow (high level)
- Graph → Ingestion Worker → Zep
- UI → BFF → LLM ↔ (tool calls) ↔ Zep → BFF → UI
- UI Review actions → BFF → Zep (confirm/reject/update)

---

## 11. Integrations
### Microsoft Graph
- Auth: OAuth (authorization code flow)
- Inputs:
  - Teams messages (chatMessage)
  - Outlook messages
  - Calendar events

### Zep
- Store documents and query memory
- Store or update “verified/corrected” facts if supported

### LLM provider
- Chat completion with tool calling:
  - query_memory
  - review_memory
  - apply_correction
  - confirm_fact / reject_fact (or equivalent)

---

## 12. Acceptance Criteria (v1)
- Chat answers incorporate recent context from Teams/Email/Calendar when relevant.
- Manual notes influence subsequent answers.
- Review screen shows candidate facts and allows Accept/Reject.
- Corrections applied by user are reflected in later answers.
- Source toggles prevent new ingestion from disabled sources.
- Codebase uses Next.js/React/Node, library-first UI, and small split components.
- Every implemented component is documented with EARS **after** implementation.

---

## 13. Success Metrics
- % of queries answered with cited evidence from ingested sources
- # of successful validations/corrections per week
- User-perceived usefulness (simple thumbs up/down per answer)
- Mean time to correct wrong beliefs (from detection to update)

---

## 14. Open Questions (tracked, not blockers)
- Whether to use Graph webhooks vs scheduled polling for v1
- Exact Zep fact update semantics available in the chosen Zep deployment
- Best minimal Graph scopes for each enabled source
