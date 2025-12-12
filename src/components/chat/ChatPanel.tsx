'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

interface ChatItem {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatPanel() {
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message) return;
    setLoading(true);
    setHistory((prev) => [...prev, { role: 'user', content: message }]);
    const res = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
    const data = await res.json();
    setHistory((prev) => [...prev, { role: 'assistant', content: data.response }]);
    setMessage('');
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>Chat with your assistant</CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {history.map((item, idx) => (
            <div key={idx} className="rounded-md border border-slate-200 p-3">
              <div className="text-xs uppercase text-slate-500">{item.role}</div>
              <div className="text-sm whitespace-pre-wrap">{item.content}</div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center space-x-2 text-sm text-slate-500">
              <Spinner />
              <span>Thinking...</span>
            </div>
          )}
        </div>
        <Textarea
          placeholder="Ask about your work..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button onClick={sendMessage} disabled={loading || !message}>
          Send
        </Button>
      </CardContent>
    </Card>
  );
}
