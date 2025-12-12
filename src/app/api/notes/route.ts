import { NextResponse } from "next/server";
import { listNotes } from "@/lib/services/notes-service";

export async function GET() {
  const notes = await listNotes();
  return NextResponse.json({ notes });
}
