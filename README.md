# Personal Assistant with Zep Memory

This Next.js (App Router, TypeScript) app implements a minimal personal work assistant that ingests Microsoft Graph data and manual notes into a Zep-like memory store, lets the assistant answer questions, and enables validation of beliefs.

## Getting started

```bash
npm install
npm run dev
```

Configure environment variables for Azure AD (NextAuth) and feature toggles:

- `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`, `AZURE_TENANT_ID`
- `ENABLE_TEAMS_INGESTION`, `ENABLE_EMAIL_INGESTION`, `ENABLE_CALENDAR_INGESTION`, `ENABLE_MANUAL_INGESTION`
- `ZEP_BASE_URL`, `LLM_MODEL`, `RECENT_DAYS`

## Features
- Chat UI backed by `/api/chat` that queries memory and composes responses.
- Manual note ingestion endpoint `/api/ingest/manual` and UI form.
- Review & validation UI hitting `/api/review` and `/api/validate` for Accept/Reject/Correct flows.
- Graph webhook receiver `/api/webhooks/graph` and local queue for retry when downstream services are unavailable.
- Local JSON persistence in `.data` for demonstration purposes.

Each module includes an accompanying `_requirements.ears.md` file mapping to global requirements.
