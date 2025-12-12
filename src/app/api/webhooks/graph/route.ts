import { NextResponse } from "next/server";
import { webhookEventSchema } from "@/lib/schemas/webhook";
import { enqueueGraphEvent } from "@/lib/services/graph-client";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parseResult = webhookEventSchema.safeParse(body);

  if (!parseResult.success) {
    return NextResponse.json({ error: parseResult.error.flatten() }, { status: 400 });
  }

  const correlationId = crypto.randomUUID();
  console.log(`[graph-webhook] correlation=${correlationId}`); // REQ-I-001

  const results = await Promise.all(
    parseResult.data.value.map((event) => enqueueGraphEvent(event, correlationId))
  );

  return NextResponse.json({ received: true, results });
}
