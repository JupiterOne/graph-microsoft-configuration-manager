import { createClient, MicrosoftConfigurationManagerClient } from './client';
import { IntegrationConfig } from '../config';
import { IntegrationLogger } from '@jupiterone/integration-sdk-core';

// Cached client to avoid needing to generate an access token each time a new
// instance of the client is created.
let client: MicrosoftConfigurationManagerClient | undefined;

async function close(logger: IntegrationLogger) {
  if (!client) return;

  try {
    await client.close();
  } finally {
    client = undefined;
  }
}

async function createMicrosoftConfigurationManagerClient(
  config: IntegrationConfig,
  logger: IntegrationLogger,
) {
  if (client) return client;

  client = await createClient({
    dbHost: config.host,
    dbName: config.database,
    dbUsername: config.username,
    dbPassword: config.password,
    onRequestFailed(err) {
      logger.error({ err }, 'Error running request');
      throw err;
    },
  });

  return client;
}

export { createMicrosoftConfigurationManagerClient, close };
