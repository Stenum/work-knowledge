import { Queue, QueueEvents, QueueScheduler } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_URL ?? "redis://localhost:6379");

export const ingestionQueue = new Queue("ingestion", { connection });
export const deltaSyncQueue = new Queue("delta-sync", { connection });

export const ingestionEvents = new QueueEvents("ingestion", { connection });
export const deltaSyncEvents = new QueueEvents("delta-sync", { connection });

export const ingestionScheduler = new QueueScheduler("ingestion", { connection });
export const deltaSyncScheduler = new QueueScheduler("delta-sync", { connection });
