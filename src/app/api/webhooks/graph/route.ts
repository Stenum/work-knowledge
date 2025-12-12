import { NextResponse } from "next/server";
import { graphNotificationSchema } from "@/lib/schemas/webhook";
import { enqueueGraphEvent } from "@/lib/services/graph-client";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = graphNotificationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid notification" }, { status: 400 }); // REQ-H-010
  }

  for (const event of parsed.data.value) {
    await enqueueGraphEvent(event);
  }

  return NextResponse.json({ received: true });
}
