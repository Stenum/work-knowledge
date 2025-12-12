'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import { Belief } from '@/types/memory';

export function ReviewList() {
  const [topic, setTopic] = useState('');
  const [items, setItems] = useState<Belief[]>([]);
  const [loading, setLoading] = useState(false);
  const [correction, setCorrection] = useState<Record<string, string>>({});

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/review', {
      method: 'POST',
      body: JSON.stringify({ topic }),
    });
    const data = await res.json();
    setItems(data.beliefs || []);
    setLoading(false);
  };

  const act = async (id: string, action: 'accept' | 'reject' | 'correct') => {
    const res = await fetch('/api/validate', {
      method: 'POST',
      body: JSON.stringify({ id, action, text: correction[id] }),
    });
    if (res.ok) load();
  };

  return (
    <Card>
      <CardHeader>Review beliefs</CardHeader>
      <CardContent className="space-y-3">
        <div className="flex space-x-2">
          <Input placeholder="Topic or entity" value={topic} onChange={(e) => setTopic(e.target.value)} />
          <Button onClick={load} disabled={!topic || loading}>
            {loading ? 'Loading...' : 'Load'}
          </Button>
        </div>
        {loading && (
          <div className="flex items-center space-x-2 text-sm text-slate-500">
            <Spinner />
            <span>Fetching from memory...</span>
          </div>
        )}
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-md border border-slate-200 p-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">{item.text}</div>
                <Badge>{item.source || 'unknown'}</Badge>
              </div>
              <div className="text-xs text-slate-500">Status: {item.status || 'pending'}</div>
              <div className="mt-2 flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => act(item.id, 'accept')}>
                  Accept
                </Button>
                <Button variant="outline" size="sm" onClick={() => act(item.id, 'reject')}>
                  Reject
                </Button>
              </div>
              <div className="mt-2 space-y-2">
                <Textarea
                  placeholder="Provide a correction"
                  value={correction[item.id] || ''}
                  onChange={(e) => setCorrection({ ...correction, [item.id]: e.target.value })}
                />
                <Button size="sm" onClick={() => act(item.id, 'correct')} disabled={!correction[item.id]}>
                  Correct
                </Button>
              </div>
            </div>
          ))}
          {!items.length && !loading && <div className="text-sm text-slate-500">No beliefs loaded yet.</div>}
        </div>
      </CardContent>
    </Card>
  );
}
