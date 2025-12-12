import { NextResponse } from "next/server";
import { manualIngestRequestSchema, manualIngestResponseSchema } from "@/lib/schemas/ingest";
import { ingestManualNote } from "@/lib/services/zep-client";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parseResult = manualIngestRequestSchema.safeParse(body);

  if (!parseResult.success) {
    return NextResponse.json({ error: parseResult.error.flatten() }, { status: 400 });
  }

  const correlationId = crypto.randomUUID();
  console.log(`[ingest-manual] correlation=${correlationId}`); // REQ-I-001

  const document = await ingestManualNote(parseResult.data);
  const payload = manualIngestResponseSchema.parse({ id: document.id, ingestedAt: document.ingestedAt });

  return NextResponse.json(payload, { status: 201 });
}
