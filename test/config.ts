import { IntegrationInvocationConfig } from '@jupiterone/integration-sdk-core';
import { StepTestConfig } from '@jupiterone/integration-sdk-testing';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { invocationConfig } from '../src';
import { IntegrationConfig } from '../src/config';

if (process.env.LOAD_ENV) {
  dotenv.config({
    path: path.join(__dirname, '../.env'),
  });
}

const DEFAULT_HOST = 'test_host';
const DEFAULT_DATABASE = 'test_db';
const DEFAULT_USERNAME = 'test_username';
const DEFAULT_PASSWORD = 'fakepassword';

export const integrationConfig: IntegrationConfig = {
  host: process.env.HOST || DEFAULT_HOST,
  database: process.env.DATABASE || DEFAULT_DATABASE,
  dbUsername: process.env.DB_USERNAME || DEFAULT_USERNAME,
  password: process.env.PASSWORD || DEFAULT_PASSWORD,
};

export function buildStepTestConfigForStep(stepId: string): StepTestConfig {
  return {
    stepId,
    instanceConfig: integrationConfig,
    invocationConfig: invocationConfig as IntegrationInvocationConfig,
  };
}
