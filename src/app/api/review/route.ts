import { NextRequest, NextResponse } from "next/server";
import { reviewQuerySchema } from "@/lib/schemas/review";
import { queryMemory } from "@/lib/services/zep-client";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const topic = url.searchParams.get("topic") ?? undefined;
  const parsed = reviewQuerySchema.safeParse({ topic });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid topic" }, { status: 400 }); // REQ-H-010
  }

  const beliefs = await queryMemory(parsed.data.topic);
  return NextResponse.json({ beliefs });
}
