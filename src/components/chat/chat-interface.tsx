"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ChatMessage {
  id: string;
  from: "user" | "assistant";
  text: string;
}

interface ContextItem {
  id: string;
  content: string;
  source: string;
  status: string;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [context, setContext] = useState<ContextItem[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [systemNotice, setSystemNotice] = useState<string | null>(null);
  const [recentDays, setRecentDays] = useState<number>(7);

  useEffect(() => {
    setSystemNotice(
      "This assistant retrieves context from Zep memory and asks for validation when needed."
    );
  }, []);

  async function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      from: "user",
      text: input.trim(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setInput("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.text, recentDays }),
      });
      const data = await response.json();
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        from: "assistant",
        text: data.reply ?? "I could not generate a response.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setContext(data.context ?? []);
    } catch {
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        from: "assistant",
        text: "Something went wrong while talking to the assistant.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-5xl">
      <CardHeader>
        <CardTitle>Assistant Chat</CardTitle>
        {systemNotice ? (
          <p className="text-sm text-slate-600">{systemNotice}</p>
        ) : null}
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-[3fr_2fr]">
          <div className="space-y-4">
            <div className="space-y-2 max-h-[360px] overflow-y-auto border rounded-md p-3 bg-slate-50">
              {messages.length === 0 ? (
                <p className="text-sm text-slate-500">
                  Start the conversation to see the assistant retrieve memory and ask for clarifications.
                </p>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className="space-y-1">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      {message.from === "user" ? "You" : "Assistant"}
                    </p>
                    <p className="rounded-md bg-white p-3 text-sm shadow-sm border border-slate-200">
                      {message.text}
                    </p>
                  </div>
                ))
              )}
            </div>
            <form className="space-y-3" onSubmit={sendMessage}>
              <Textarea
                placeholder="Ask about your work, meetings, or conversations."
                value={input}
                onChange={(event) => setInput(event.target.value)}
                disabled={loading}
              />
              <div className="flex items-center gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? "Sending..." : "Send"}
                </Button>
                <Input
                  type="number"
                  min={1}
                  max={30}
                  className="w-28"
                  placeholder="Recent days"
                  value={recentDays}
                  onChange={(event) => setRecentDays(Number(event.target.value) || 1)}
                />
                <p className="text-xs text-slate-500">Recent-day preference is enforced in the BFF.</p>
              </div>
            </form>
          </div>
          <div className="space-y-3 rounded-md border p-3 bg-slate-50">
            <p className="text-sm font-semibold text-slate-700">Context used</p>
            {context.length === 0 ? (
              <p className="text-xs text-slate-500">No recent context retrieved yet.</p>
            ) : (
              <ul className="space-y-2 text-xs text-slate-700">
                {context.map((item) => (
                  <li key={item.id} className="rounded border bg-white p-2 shadow-sm">
                    <p className="font-medium">{item.content}</p>
                    <p className="text-slate-600">Source: {item.source}</p>
                    <p className="text-indigo-700">Status: {item.status}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
