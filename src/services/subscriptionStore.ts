import { loadSubscriptions, saveSubscriptions } from '@/lib/storage';
import { v4 as uuid } from 'uuid';

export function listSubscriptions() {
  return loadSubscriptions();
}

export function saveSubscription(resource: string, expiresOn: string) {
  const subs = loadSubscriptions();
  subs.push({ id: uuid(), resource, expiresOn });
  saveSubscriptions(subs);
  return subs;
}

export function renewExpiring(thresholdMs = 60 * 60 * 1000) {
  const now = Date.now();
  const subs = loadSubscriptions();
  const expiring = subs.filter((s) => new Date(s.expiresOn).getTime() - now < thresholdMs);
  return expiring;
}
