import { Worker } from "bullmq";
import IORedis from "ioredis";
import { deltaSyncQueue, ingestionQueue } from "./queues";
import {
  processDeltaSyncJob,
  processIngestionJob,
} from "@/lib/services/ingestion-service";

const connection = new IORedis(process.env.REDIS_URL ?? "redis://localhost:6379");

export const ingestionWorker = new Worker(
  ingestionQueue.name,
  async (job) => processIngestionJob(job.data),
  { connection }
);

export const deltaSyncWorker = new Worker(
  deltaSyncQueue.name,
  async (job) => processDeltaSyncJob(job.data.changedAt),
  { connection }
);

export async function enqueueIngestion(payload: unknown) {
  return ingestionQueue.add("ingestion", payload);
}

export async function enqueueDeltaSync(changedAt: string) {
  return deltaSyncQueue.add("delta-sync", { changedAt });
}
