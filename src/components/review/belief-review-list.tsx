"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Belief {
  id: string;
  text: string;
  source: string;
  timestamp?: string;
  status: string;
}

export function BeliefReviewList() {
  const [beliefs, setBeliefs] = useState<Belief[]>([]);
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState("");

  const fetchBeliefs = useCallback(async () => {
    setLoading(true);
    const params = topic ? `?topic=${encodeURIComponent(topic)}` : "";
    const response = await fetch(`/api/review${params}`);
    const data = await response.json();
    setBeliefs(data.beliefs ?? []);
    setLoading(false);
  }, [topic]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBeliefs();
  }, [fetchBeliefs]);

  async function updateBelief(id: string, action: "accept" | "reject") {
    setLoading(true);
    await fetch("/api/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ beliefId: id, action }),
    });
    await fetchBeliefs();
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
        <div className="space-y-3">
          {beliefs.length === 0 ? (
            <p className="text-sm text-slate-500">No beliefs available yet.</p>
          ) : (
            beliefs.map((belief) => (
              <div key={belief.id} className="rounded-md border p-3 bg-slate-50">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">{belief.text}</p>
                    <p className="text-xs text-slate-600">
                      Source: {belief.source} {belief.timestamp ? `· ${belief.timestamp}` : ""}
                    </p>
                    <p className="text-xs text-indigo-600">Status: {belief.status}</p>
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
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
