/* eslint-disable @typescript-eslint/no-require-imports */
process.env.TS_NODE_COMPILER_OPTIONS = JSON.stringify({ module: "commonjs", moduleResolution: "node" });
require("ts-node/register/transpile-only");
require("tsconfig-paths/register");
const assert = require("node:assert/strict");
const { processIngestionJob } = require("../src/lib/services/ingestion-service");
const { ZepClient } = require("../src/lib/clients/zep");

class StubGraphClient {
  constructor(items) {
    this.items = items;
  }

  async fetchEntities() {
    return this.items;
  }
}

class FlakyGraphClient {
  constructor(items) {
    this.items = items;
    this.failureCount = 0;
  }

  async fetchEntities() {
    this.failureCount += 1;
    if (this.failureCount === 1) {
      throw new Error("Transient Graph outage");
    }
    return this.items;
  }
}

const now = new Date().toISOString();
const demoItems = [
  {
    id: "teams-fixture",
    type: "teams",
    subject: "Teams sample",
    content: "Stub teams payload",
    tenantId: "demo-tenant",
    createdAt: now,
    updatedAt: now,
    sourceUrl: "https://graph.local/teams/teams-fixture",
    metadata: {},
  },
  {
    id: "outlook-fixture",
    type: "outlook",
    subject: "Outlook sample",
    content: "Stub outlook payload",
    tenantId: "demo-tenant",
    createdAt: now,
    updatedAt: now,
    sourceUrl: "https://graph.local/outlook/outlook-fixture",
    metadata: {},
  },
];

(async () => {
  const zepClient = new ZepClient();
  const graphClient = new StubGraphClient(demoItems);

  const firstRun = await processIngestionJob({}, { graphClient, zepClient });
  assert.equal(firstRun.envelopesUpserted, demoItems.length, "first run should upsert all envelopes");
  assert.equal(firstRun.duplicatesIgnored, 0, "first run should not count duplicates");

  const secondRun = await processIngestionJob({}, { graphClient, zepClient });
  assert.equal(secondRun.envelopesUpserted, 0, "second run should skip inserts");
  assert.equal(secondRun.duplicatesIgnored, demoItems.length, "second run should report duplicates");

  const beliefs = await zepClient.listBeliefs();
  assert.equal(beliefs.length, demoItems.length, "belief store should hold deduped envelopes");

  const flakyClient = new FlakyGraphClient(demoItems);
  const flakyZep = new ZepClient();
  let errored = false;
  try {
    await processIngestionJob({}, { graphClient: flakyClient, zepClient: flakyZep });
  } catch {
    errored = true;
  }
  assert.equal(errored, true, "first flaky attempt should fail");

  const retryResult = await processIngestionJob({}, { graphClient: flakyClient, zepClient: flakyZep });
  assert.equal(retryResult.envelopesUpserted, demoItems.length, "retry should succeed after transient failure");

  console.log("Ingestion tests completed successfully.");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
