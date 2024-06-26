import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { Entities, Steps } from '../constants';
import { createAccountEntity } from './converter';

export const ACCOUNT_ENTITY_KEY = 'entity:account';

export async function fetchAccount({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const accountEntity = await jobState.addEntity(createAccountEntity());

  await jobState.setData(ACCOUNT_ENTITY_KEY, accountEntity);
}

export const fetchAccountSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.FETCH_ACCOUNT,
    name: 'Fetch Account',
    entities: [Entities.ACCOUNT],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchAccount,
  },
];
