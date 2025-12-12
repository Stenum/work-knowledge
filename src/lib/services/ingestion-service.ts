import { GraphClient, GraphItem } from "../clients/graph";
import { ZepClient, sharedZepClient } from "../clients/zep";
import { DocumentEnvelope } from "../types/documents";

const defaultGraphClient = new GraphClient();
const defaultZepClient = sharedZepClient;

interface IngestionDependencies {
  graphClient: GraphClient;
  zepClient: ZepClient;
}

function mapItemToEnvelope(item: GraphItem): DocumentEnvelope {
  return {
    id: item.id,
    source: item.type,
    subject: item.subject,
    content: item.content,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    tenantId: item.tenantId,
    url: item.sourceUrl,
    metadata: item.metadata,
  };
}

export async function processIngestionJob(
  data: unknown,
  deps: IngestionDependencies = { graphClient: defaultGraphClient, zepClient: defaultZepClient }
) {
  const notifications = (data as { notifications?: unknown[] })?.notifications ?? [];
  const since = (data as { changedAt?: string })?.changedAt;

  const graphItems = await deps.graphClient.fetchEntities(since);
  const envelopes = graphItems.map(mapItemToEnvelope);
  const upsertResult = await deps.zepClient.upsertDocuments(envelopes);

  return {
    notificationsProcessed: notifications.length,
    envelopesUpserted: upsertResult.inserted,
    duplicatesIgnored: upsertResult.deduped,
    totalEnvelopes: envelopes.length,
  };
}

export async function processDeltaSyncJob(
  changedAt: string,
  deps: IngestionDependencies = { graphClient: defaultGraphClient, zepClient: defaultZepClient }
) {
  const items = await deps.graphClient.readDelta(changedAt);
  const envelopes = items.map(mapItemToEnvelope);
  const upsertResult = await deps.zepClient.upsertDocuments(envelopes);

  return {
    deltaStartedAt: changedAt,
    envelopesUpserted: upsertResult.inserted,
    duplicatesIgnored: upsertResult.deduped,
  };
}
