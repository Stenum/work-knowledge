# work-knowledge

## Project Goals
- Provide an AI-assisted knowledge base that surfaces accurate answers backed by project documentation and code.
- Deliver a fast, reliable developer experience with a clear boundary between user-facing features and background processing.
- Keep data private and auditable by integrating human-in-the-loop review flows and transparent data retention.

## Architecture Overview
- **Next.js BFF**: The web app exposes a backend-for-frontend layer that handles user authentication, routes chat/search requests, and orchestrates calls to downstream services. API routes encapsulate business logic so the frontend stays lightweight.
- **Ingestion Worker**: A background worker ingests documentation and repository content, normalizes metadata, and schedules embeddings or enrichment tasks. It runs independently of the web tier to avoid blocking user traffic.
- **Zep Integration**: Zep stores conversational memory and vector embeddings. The BFF writes user interactions and retrieval metadata to Zep, while the ingestion worker batches new documents into the same store for unified retrieval.

## Development Setup
- **Node.js**: Use Node.js 20.x (LTS) for local development to match CI/runtime expectations.
- **Install dependencies**: `npm install`
- **Environment**: Copy `.env.example` to `.env.local` and fill in API keys for Zep and any OAuth providers.

### Package Scripts
- `npm run dev`: Start the Next.js dev server with hot reload and API routes.
- `npm run lint`: Run linting to enforce code quality.
- `npm run build`: Create an optimized production build of the BFF and frontend.
- `npm run start`: Serve the production build locally.
- `npm run worker`: Launch the ingestion worker (e.g., with `ts-node` or a bundled entrypoint).

## Contribution Guidelines
- Open a draft PR early to share context and get feedback on design decisions.
- Keep changes scoped; prefer small, reviewable commits with descriptive messages.
- Follow the existing code style (lint before pushing) and document any new environment variables in the README or `.env.example`.

## Testing Guidelines
- Run `npm run lint` and any relevant unit/integration test scripts before opening a PR.
- For ingestion changes, validate the worker against a small fixture dataset before touching production data.
- If you modify API routes or Zep integrations, include a brief test plan in the PR description (e.g., manual steps or sample requests).
