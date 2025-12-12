import crypto from "crypto";
import { Job, Worker } from "bullmq";
import IORedis from "ioredis";
import { deltaSyncQueue, deadLetterQueue, ingestionQueue } from "./queues";
import {
  processDeltaSyncJob,
  processIngestionJob,
} from "@/lib/services/ingestion-service";

const connection = new IORedis(process.env.REDIS_URL ?? "redis://localhost:6379");

async function sendToDeadLetter(queueName: string, job: Job | undefined, error: unknown) {
  await deadLetterQueue.add(
    `${queueName}-failed`,
    {
      failedJob: job?.asJSON ? job.asJSON() : job,
      error: error instanceof Error ? error.message : String(error),
    },
    { removeOnComplete: true }
  );
}

function wireWorker(queueName: string, handler: (job: Job) => Promise<unknown>) {
  const worker = new Worker(queueName, handler, { connection, concurrency: 5 });

  worker.on("failed", async (job, error) => {
    const attempts = job?.opts?.attempts ?? 1;
    const made = job?.attemptsMade ?? 0;
    console.error(
      JSON.stringify({
        event: "job_failed",
        queue: queueName,
        jobId: job?.id,
        attemptsMade: made,
        attemptsAllowed: attempts,
        error: error?.message,
      })
    );

    if (job && made >= attempts) {
      await sendToDeadLetter(queueName, job, error);
    }
  });

  return worker;
}

export const ingestionWorker = wireWorker(ingestionQueue.name, async (job) =>
  processIngestionJob(job.data)
);

export const deltaSyncWorker = wireWorker(deltaSyncQueue.name, async (job) =>
  processDeltaSyncJob(job.data.changedAt)
);

export async function enqueueIngestion(payload: unknown) {
  return ingestionQueue.add(
    "ingestion",
    payload,
    {
      jobId: (payload as { id?: string })?.id ?? crypto.randomUUID(),
    }
  );
}

export async function enqueueDeltaSync(changedAt: string) {
  return deltaSyncQueue.add(
    "delta-sync",
    { changedAt },
    {
      jobId: `delta-${changedAt}`,
    }
  );
}
