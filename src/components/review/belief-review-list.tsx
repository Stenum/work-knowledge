"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Belief {
  id: string;
  content: string;
  source: string;
  sourceId: string;
  timestamp?: string;
  status: string;
  participants?: string[];
  subject?: string;
  url?: string;
}

export function BeliefReviewList() {
  const [beliefs, setBeliefs] = useState<Belief[]>([]);
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState("");
  const [corrections, setCorrections] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const fetchBeliefs = useCallback(async () => {
    setLoading(true);
    setError(null);
    const params = topic ? `?topic=${encodeURIComponent(topic)}` : "";
    const response = await fetch(`/api/review${params}`);
    const data = await response.json();
    setBeliefs(data.beliefs ?? []);
    setLoading(false);
  }, [topic]);

  useEffect(() => {
    fetchBeliefs();
  }, [fetchBeliefs]);

  async function updateBelief(id: string, action: "accept" | "reject" | "correct") {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          beliefId: id,
          action,
          correctedText: action === "correct" ? corrections[id] : undefined,
        }),
      });
      if (!response.ok) {
        throw new Error("Validation failed");
      }
      await fetchBeliefs();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update belief");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Review & Validation</CardTitle>
        <p className="text-sm text-slate-600">
          Accept, reject, or correct beliefs captured from graph sources and manual notes.
        </p>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-3">
          <Input
            placeholder="Filter by topic (optional)"
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
          />
          <Button onClick={fetchBeliefs} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </Button>
        </div>
        {error ? <p className="mb-3 text-sm text-rose-600">{error}</p> : null}
        <div className="space-y-3">
          {beliefs.length === 0 ? (
            <p className="text-sm text-slate-500">No beliefs available yet.</p>
          ) : (
            beliefs.map((belief) => (
              <div key={belief.id} className="rounded-md border p-3 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{belief.content}</p>
                    <p className="text-xs text-slate-600">
                      Source: {belief.source} · {belief.sourceId}
                      {belief.timestamp ? ` · ${new Date(belief.timestamp).toLocaleString()}` : ""}
                    </p>
                    {belief.subject ? (
                      <p className="text-xs text-slate-600">Subject: {belief.subject}</p>
                    ) : null}
                    {belief.participants?.length ? (
                      <p className="text-xs text-slate-600">Participants: {belief.participants.join(", ")}</p>
                    ) : null}
                    {belief.url ? (
                      <a className="text-xs text-indigo-600 underline" href={belief.url} target="_blank" rel="noreferrer">
                        Open in Microsoft 365
                      </a>
                    ) : null}
                    <p className="text-xs font-semibold text-indigo-700">Status: {belief.status}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateBelief(belief.id, "reject")}
                      disabled={loading}
                    >
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => updateBelief(belief.id, "accept")}
                      disabled={loading}
                    >
                      Accept
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-600" htmlFor={`correct-${belief.id}`}>
                    Provide a correction (optional)
                  </label>
                  <Textarea
                    id={`correct-${belief.id}`}
                    placeholder="Propose the correct statement and mark it as verified"
                    value={corrections[belief.id] ?? ""}
                    onChange={(event) =>
                      setCorrections((prev) => ({ ...prev, [belief.id]: event.target.value }))
                    }
                    disabled={loading}
                  />
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => updateBelief(belief.id, "correct")}
                    disabled={loading || !corrections[belief.id]}
                  >
                    Submit correction
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
