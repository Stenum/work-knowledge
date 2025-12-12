# Work Assistant with Zep Memory

This Next.js app (App Router, TypeScript) delivers a minimal personal work assistant UI and BFF. It includes chat, manual note ingestion, and belief review/validation backed by stubbed Zep, Graph, and LLM clients.

## Features
- Chat interface that retrieves recent memory and responds via an LLM stub.
- Manual note ingestion flow that stores notes as `manual` source documents.
- Review and validation list to accept or reject beliefs captured from Teams/email/calendar/manual sources.
- Zod validation on every API boundary and lightweight service stubs with correlation logging.
- Tailwind CSS with shadcn-style UI primitives for buttons, cards, inputs, and text areas.

## Getting Started
1. Install dependencies (already bundled in `package-lock.json`):
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) to use the assistant.

## Architecture Notes
- Route handlers live under `src/app/api/**` and rely on Zod schemas in `src/lib/schemas`.
- Integration stubs for Zep, Graph, and the LLM are in `src/lib/services`.
- Each UI surface (chat, manual notes, review) has its own page under `src/app` and small React components under `src/components`.
- EARS requirement documents sit next to each component to capture scope and traceability.

Secrets for Graph, Zep, and LLM services are **not** committed (REQ-J-001); wire your chosen auth provider before production use.
