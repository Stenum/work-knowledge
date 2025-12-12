import { NextRequest, NextResponse } from "next/server";
import { reviewQuerySchema, reviewResponseSchema } from "@/lib/schemas/review";
import { queryMemory } from "@/lib/services/zep-client";

export async function GET(request: NextRequest) {
  const query = reviewQuerySchema.safeParse({ topic: request.nextUrl.searchParams.get("topic") ?? undefined });

  if (!query.success) {
    return NextResponse.json({ error: query.error.flatten() }, { status: 400 });
  }

  const correlationId = crypto.randomUUID();
  console.log(`[review] correlation=${correlationId}`); // REQ-I-002

  const beliefs = await queryMemory(query.data.topic);
  const payload = reviewResponseSchema.parse({ beliefs });
  return NextResponse.json(payload);
}
