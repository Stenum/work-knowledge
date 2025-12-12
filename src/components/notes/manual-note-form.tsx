"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export function ManualNoteForm() {
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!note.trim()) return;

    setLoading(true);
    setStatus(null);
    try {
      const response = await fetch("/api/ingest/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note }),
      });

      if (!response.ok) {
        throw new Error("Unable to save note");
      }

      setStatus("Note ingested successfully.");
      setNote("");
    } catch {
      setStatus("There was an issue sending the note to memory.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Manual Note Ingestion</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <Textarea
            placeholder="Capture quick notes about your work, decisions, or meetings."
            value={note}
            onChange={(event) => setNote(event.target.value)}
            disabled={loading}
          />
          <div className="flex items-center gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send to memory"}
            </Button>
            {status ? <p className="text-sm text-slate-600">{status}</p> : null}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
