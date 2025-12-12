export const ingestionConfig = {
  enableTeams: process.env.ENABLE_TEAMS_INGESTION !== 'false',
  enableEmail: process.env.ENABLE_EMAIL_INGESTION !== 'false',
  enableCalendar: process.env.ENABLE_CALENDAR_INGESTION !== 'false',
  enableManual: process.env.ENABLE_MANUAL_INGESTION !== 'false',
};

export const llmConfig = {
  model: process.env.LLM_MODEL || 'demo-model',
  recentDaysDefault: Number(process.env.RECENT_DAYS || 14),
};

export const zepConfig = {
  endpoint: process.env.ZEP_BASE_URL || 'https://example.zep',
};

export const graphConfig = {
  tenantId: process.env.AZURE_TENANT_ID || 'tenant',
  clientId: process.env.AZURE_CLIENT_ID || 'client',
  clientSecret: process.env.AZURE_CLIENT_SECRET || 'secret',
  webhookHost: process.env.WEBHOOK_HOST || 'https://example/webhook',
};
