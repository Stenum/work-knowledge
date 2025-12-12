import fs from 'fs';
import path from 'path';
import { Belief, IngestedDocument, SubscriptionState } from '@/types/memory';

const dataDir = path.join(process.cwd(), '.data');
const docPath = path.join(dataDir, 'memory.json');
const beliefPath = path.join(dataDir, 'beliefs.json');
const queuePath = path.join(dataDir, 'queue.json');
const subscriptionPath = path.join(dataDir, 'subscriptions.json');

function ensureFiles() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(docPath)) fs.writeFileSync(docPath, '[]', 'utf-8');
  if (!fs.existsSync(beliefPath)) fs.writeFileSync(beliefPath, '[]', 'utf-8');
  if (!fs.existsSync(queuePath)) fs.writeFileSync(queuePath, '[]', 'utf-8');
  if (!fs.existsSync(subscriptionPath)) fs.writeFileSync(subscriptionPath, '[]', 'utf-8');
}

export function loadDocuments(): IngestedDocument[] {
  ensureFiles();
  return JSON.parse(fs.readFileSync(docPath, 'utf-8')) as IngestedDocument[];
}

export function saveDocuments(docs: IngestedDocument[]) {
  ensureFiles();
  fs.writeFileSync(docPath, JSON.stringify(docs, null, 2));
}

export function loadBeliefs(): Belief[] {
  ensureFiles();
  return JSON.parse(fs.readFileSync(beliefPath, 'utf-8')) as Belief[];
}

export function saveBeliefs(items: Belief[]) {
  ensureFiles();
  fs.writeFileSync(beliefPath, JSON.stringify(items, null, 2));
}

export function loadQueue<T>(): T[] {
  ensureFiles();
  return JSON.parse(fs.readFileSync(queuePath, 'utf-8')) as T[];
}

export function saveQueue<T>(items: T[]) {
  ensureFiles();
  fs.writeFileSync(queuePath, JSON.stringify(items, null, 2));
}

export function loadSubscriptions(): SubscriptionState[] {
  ensureFiles();
  return JSON.parse(fs.readFileSync(subscriptionPath, 'utf-8')) as SubscriptionState[];
}

export function saveSubscriptions(subscriptions: SubscriptionState[]) {
  ensureFiles();
  fs.writeFileSync(subscriptionPath, JSON.stringify(subscriptions, null, 2));
}
