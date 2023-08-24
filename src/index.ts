import { IntegrationInvocationConfig } from '@jupiterone/integration-sdk-core';
import { integrationSteps } from './steps';
import {
  validateInvocation,
  IntegrationConfig,
  instanceConfigFields,
} from './config';
import { close } from './configuration-manager';

export const invocationConfig: IntegrationInvocationConfig<IntegrationConfig> =
  {
    instanceConfigFields,
    validateInvocation,
    integrationSteps,
    async afterExecution(context) {
      try {
        await close(context.logger);
      } catch (err) {
        context.logger.error({ err }, 'Failed to close MSSQL client');
      }
    },
  };
