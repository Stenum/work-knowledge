import { loadQueue, saveQueue } from '@/lib/storage';
import { IngestedDocument } from '@/types/memory';
import { v4 as uuid } from 'uuid';

interface QueueItem {
  id: string;
  document: IngestedDocument;
  retries: number;
  nextAttempt: number;
}

const MAX_RETRIES = 5;

export function enqueueDocument(document: IngestedDocument) {
  const queue = loadQueue<QueueItem>();
  queue.push({ id: uuid(), document, retries: 0, nextAttempt: Date.now() });
  saveQueue(queue);
}

export function processQueue(handler: (doc: IngestedDocument) => Promise<void>) {
  const queue = loadQueue<QueueItem>();
  const now = Date.now();
  const remaining: QueueItem[] = [];
  queue.forEach((item) => {
    if (item.nextAttempt > now) {
      remaining.push(item);
      return;
    }
    handler(item.document)
      .then(() => {
        // success
      })
      .catch(() => {
        const retries = item.retries + 1;
        if (retries <= MAX_RETRIES) {
          remaining.push({
            ...item,
            retries,
            nextAttempt: now + Math.pow(2, retries) * 1000,
          });
        }
      });
  });
  saveQueue(remaining);
}
