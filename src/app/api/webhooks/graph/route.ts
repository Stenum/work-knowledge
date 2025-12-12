import { NextResponse } from "next/server";
import { syncReviewGraph } from "@/lib/services/review-service";

export async function POST(request: Request) {
  const payload = await request.json();
  const result = await syncReviewGraph(payload);
  return NextResponse.json({ received: true, result });
}
