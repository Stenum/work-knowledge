import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>Chat</CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-slate-600">Ask questions and let the assistant pull from memory.</p>
          <Button asChild>
            <Link href="/chat">Open chat</Link>
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>Manual ingestion</CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-slate-600">Submit notes that should become part of memory.</p>
          <Button asChild variant="outline">
            <Link href="/manual">Add note</Link>
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>Review & validation</CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-slate-600">Inspect what the assistant believes and approve or correct.</p>
          <Button asChild variant="outline">
            <Link href="/review">Review beliefs</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
