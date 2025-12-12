import { correctBelief, listBeliefsForTopic, updateBeliefStatus } from './zepClient';

export async function fetchBeliefs(topic: string) {
  return listBeliefsForTopic(topic);
}

export async function acceptBelief(id: string) {
  return updateBeliefStatus(id, 'accepted');
}

export async function rejectBelief(id: string) {
  return updateBeliefStatus(id, 'rejected');
}

export async function applyCorrection(id: string, text: string) {
  return correctBelief(id, text);
}
