import {
  IntegrationExecutionContext,
  IntegrationValidationError,
  IntegrationInstanceConfigFieldMap,
  IntegrationInstanceConfig,
} from '@jupiterone/integration-sdk-core';
import { createMicrosoftConfigurationManagerClient } from './configuration-manager';
import { validateDbName } from './configuration-manager/queries';

export const instanceConfigFields: IntegrationInstanceConfigFieldMap = {
  host: {
    type: 'string',
    mask: false,
  },
  database: {
    type: 'string',
    mask: false,
  },
  username: {
    type: 'string',
    mask: false,
  },
  password: {
    type: 'string',
    mask: true,
  },
};

export interface IntegrationConfig extends IntegrationInstanceConfig {
  host: string;
  database: string;
  username: string;
  password: string;
}

export async function validateInvocation({
  instance: { config },
  logger,
}: IntegrationExecutionContext<IntegrationConfig>) {
  if (
    !config.host ||
    !config.database ||
    !config.username ||
    !config.password
  ) {
    throw new IntegrationValidationError(
      'Config requires all of host, database, username, password',
    );
  }

  try {
    validateDbName(config.database);
  } catch (err) {
    throw new IntegrationValidationError(
      'Invalid "dbName" configuration option supplied',
    );
  }

  await createMicrosoftConfigurationManagerClient(config, logger);
}
