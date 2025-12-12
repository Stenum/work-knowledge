import { GraphClient } from "@/lib/clients/graph";
import { ZepClient } from "@/lib/clients/zep";

const graphClient = new GraphClient();
const zepClient = new ZepClient();

export async function processIngestionJob(data: unknown) {
  const notes = await zepClient.fetchNotes();
  const graphResult = await graphClient.receiveWebhook({ source: "ingestion", data });

  return {
    ingestedNotes: notes.length,
    graphResult,
  };
}

export async function processDeltaSyncJob(changedAt: string) {
  return {
    deltaStartedAt: changedAt,
    changesForwarded: true,
  };
}
