import { Client } from '@microsoft/microsoft-graph-client';
import 'isomorphic-fetch';
import { ingestionConfig } from '@/lib/config';
import { IngestedDocument } from '@/types/memory';

interface GraphRecipient {
  emailAddress?: { address: string };
}
interface GraphMessage {
  id: string;
  receivedDateTime: string;
  toRecipients?: GraphRecipient[];
  subject?: string;
  webLink?: string;
  body?: { content?: string };
  lastModifiedDateTime?: string;
}
interface GraphEvent {
  id: string;
  start?: { dateTime?: string };
  attendees?: GraphRecipient[];
  subject?: string;
  webLink?: string;
  body?: { content?: string };
  location?: { displayName?: string };
  lastModifiedDateTime?: string;
}
interface GraphChatMessage {
  id: string;
  createdDateTime: string;
  from?: { user?: { email?: string } };
  subject?: string;
  webUrl?: string;
  body?: { content?: string };
  lastModifiedDateTime?: string;
}

function createClient(token: string) {
  return Client.init({
    authProvider: (done) => {
      done(null, token);
    },
  });
}

export async function fetchEmail(token: string, id: string): Promise<IngestedDocument> {
  if (!ingestionConfig.enableEmail) throw new Error('Email ingestion disabled');
  const client = createClient(token);
  const message = (await client.api(`/me/messages/${id}`).get()) as GraphMessage;
  return mapMessageToDoc(message);
}

export async function fetchEvent(token: string, id: string): Promise<IngestedDocument> {
  if (!ingestionConfig.enableCalendar) throw new Error('Calendar ingestion disabled');
  const client = createClient(token);
  const event = (await client.api(`/me/events/${id}`).get()) as GraphEvent;
  return mapEventToDoc(event);
}

export async function fetchTeamsMessage(token: string, chatId: string, messageId: string): Promise<IngestedDocument> {
  if (!ingestionConfig.enableTeams) throw new Error('Teams ingestion disabled');
  const client = createClient(token);
  const message = (await client.api(`/chats/${chatId}/messages/${messageId}`).get()) as GraphChatMessage;
  return mapTeamsToDoc(message);
}

function mapMessageToDoc(message: GraphMessage): IngestedDocument {
  return {
    source: 'email',
    sourceId: message.id,
    timestamp: message.receivedDateTime,
    ingestedAt: new Date().toISOString(),
    participants: message.toRecipients?.map((r) => r.emailAddress?.address || '') || [],
    subject: message.subject,
    url: message.webLink,
    content: message.body?.content || '',
    version: message.lastModifiedDateTime,
  };
}

function mapEventToDoc(event: GraphEvent): IngestedDocument {
  return {
    source: 'calendar',
    sourceId: event.id,
    timestamp: event.start?.dateTime || new Date().toISOString(),
    ingestedAt: new Date().toISOString(),
    participants: event.attendees?.map((a) => a.emailAddress?.address || '') || [],
    subject: event.subject,
    url: event.webLink,
    content: `${event.body?.content || ''}\nLocation: ${event.location?.displayName || ''}`,
    version: event.lastModifiedDateTime,
  };
}

function mapTeamsToDoc(message: GraphChatMessage): IngestedDocument {
  return {
    source: 'teams',
    sourceId: message.id,
    timestamp: message.createdDateTime,
    ingestedAt: new Date().toISOString(),
    participants: message.from?.user?.email ? [message.from.user.email] : [],
    subject: message.subject || 'Teams message',
    url: message.webUrl,
    content: message.body?.content || '',
    version: message.lastModifiedDateTime,
  };
}
