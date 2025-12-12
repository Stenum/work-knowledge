import { NextResponse } from 'next/server';
import { z } from 'zod';
import { enqueueDocument } from '@/services/ingestionQueue';
import { fetchEmail, fetchEvent, fetchTeamsMessage } from '@/services/graphClient';
import { ingestDocument, upsertBeliefsFromDocuments } from '@/services/zepClient';

const notificationSchema = z.object({
  value: z.array(
    z.object({
      resource: z.string(),
      resourceData: z.object({
        id: z.string(),
        odataType: z.string().optional(),
        odataId: z.string().optional(),
      }),
    }),
  ),
});

// REQ-C-010..013 Graph webhook ingestion
export async function POST(request: Request) {
  const body = await request.json();
  const parsed = notificationSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const token = '';
  for (const notification of parsed.data.value) {
    const resource = notification.resource;
    try {
      if (resource.includes('/messages/')) {
        const doc = await fetchEmail(token, notification.resourceData.id);
        await ingestDocument(doc);
        await upsertBeliefsFromDocuments([doc]);
      } else if (resource.includes('/events/')) {
        const doc = await fetchEvent(token, notification.resourceData.id);
        await ingestDocument(doc);
        await upsertBeliefsFromDocuments([doc]);
      } else if (resource.includes('/chats/')) {
        const parts = resource.split('/');
        const chatId = parts[1];
        const messageId = notification.resourceData.id;
        const doc = await fetchTeamsMessage(token, chatId, messageId);
        await ingestDocument(doc);
        await upsertBeliefsFromDocuments([doc]);
      }
    } catch (_error) {
      console.warn('Webhook ingestion failed', _error);
      enqueueDocument({
        source: 'email',
        sourceId: notification.resourceData.id,
        timestamp: new Date().toISOString(),
        ingestedAt: new Date().toISOString(),
        content: JSON.stringify(notification),
      });
    }
  }
  return NextResponse.json({ status: 'processed' });
}
