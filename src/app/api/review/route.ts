import { NextResponse } from "next/server";
import { createReview, listReviews } from "@/lib/services/review-service";

export async function GET() {
  const reviews = await listReviews();
  return NextResponse.json({ reviews });
}

export async function POST(request: Request) {
  const { subject } = await request.json();
  const review = await createReview(subject ?? "");
  return NextResponse.json(review, { status: 201 });
}
