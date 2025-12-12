'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

export function ManualNoteForm() {
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    setStatus(null);
    const res = await fetch('/api/ingest/manual', {
      method: 'POST',
      body: JSON.stringify({ content: note }),
    });
    setStatus(res.ok ? 'Saved to memory' : 'Failed to save');
    setNote('');
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>Manual note</CardHeader>
      <CardContent className="space-y-3">
        <Textarea
          placeholder="Paste a note or summary to store in memory"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <Button onClick={submit} disabled={!note || loading}>
          {loading ? (
            <span className="flex items-center space-x-2">
              <Spinner /> <span>Sending...</span>
            </span>
          ) : (
            'Ingest note'
          )}
        </Button>
        {status && <div className="text-sm text-slate-600">{status}</div>}
      </CardContent>
    </Card>
  );
}
