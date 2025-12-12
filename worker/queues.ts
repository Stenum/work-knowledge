import { Queue, QueueEvents, QueueScheduler } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_URL ?? "redis://localhost:6379");

const defaultJobOptions = {
  attempts: 5,
  backoff: {
    type: "exponential" as const,
    delay: 1000,
  },
  removeOnComplete: true,
};

export const ingestionQueue = new Queue("ingestion", { connection, defaultJobOptions });
export const deltaSyncQueue = new Queue("delta-sync", { connection, defaultJobOptions });
export const deadLetterQueue = new Queue("dead-letter", { connection, defaultJobOptions: { removeOnComplete: true } });

export const ingestionEvents = new QueueEvents("ingestion", { connection });
export const deltaSyncEvents = new QueueEvents("delta-sync", { connection });

export const ingestionScheduler = new QueueScheduler("ingestion", { connection });
export const deltaSyncScheduler = new QueueScheduler("delta-sync", { connection });
