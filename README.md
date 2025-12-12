# Work Knowledge Starter

This repository scaffolds a Next.js (App Router) project with TypeScript, Tailwind CSS, and a shadcn/ui setup. It includes feature folders, shared service clients, and a BullMQ worker directory to make it easy to plug in real integrations later.

## Project layout
- `src/app/(features)/chat` – Chat experience powered by Zep + LLM service stubs and `/api/chat` & `/api/notes` endpoints.
- `src/app/(features)/review` – Review flow built on the LLM and graph webhook stubs with `/api/review` routes.
- `src/app/(features)/connections` – Connection overview backed by the graph client placeholder and `/api/webhooks/graph`.
- `src/lib/clients` – Shared clients for Zep, graph, and LLM services.
- `src/lib/services` – Service layer that API routes and server components consume.
- `worker` – BullMQ queues and workers for ingestion and delta sync jobs.

## API surface
- `POST /api/chat` – Accepts `{ "prompt": string }` and returns Zep + LLM stub data.
- `GET /api/notes` – Returns stubbed note data from the Zep client.
- `GET /api/review` – Lists stub review items.
- `GET /api/review/[id]` – Loads a single review and summary.
- `POST /api/webhooks/graph` – Accepts webhook payloads routed to the graph client stub.

## Scripts
- `npm run dev` – Start the Next.js dev server.
- `npm run build` – Build for production.
- `npm run start` – Run the production build.
- `npm run lint` – Lint the codebase.

Bring your own environment variables (e.g., `REDIS_URL`, `ZEP_API_KEY`, `GRAPH_API_URL`, `LLM_MODEL`) when replacing the stubs with live clients.
