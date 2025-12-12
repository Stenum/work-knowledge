import { NextResponse } from "next/server";
import { manualIngestRequestSchema } from "@/lib/schemas/ingest";
import { ingestManualNote } from "@/lib/services/zep-client";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = manualIngestRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid note" }, { status: 400 }); // REQ-H-010
  }

  const belief = await ingestManualNote(parsed.data); // REQ-C-020

  return NextResponse.json({ id: belief.id, ingestedAt: belief.ingestedAt });
}
