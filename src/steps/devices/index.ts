import {
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { Steps, Entities, Relationships } from '../constants';
import { createMicrosoftConfigurationManagerClient } from '../../configuration-manager';
import {
  createAccountDeviceRelationship,
  createDeviceEntity,
} from './converters';
import { ACCOUNT_ENTITY_KEY } from '../account';

export const fetchDevicesSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.FETCH_DEVICES,
    name: 'Fetch-Devices',
    entities: [Entities.DEVICE],
    relationships: [Relationships.ACCOUNT_HAS_DEVICE],
    dependsOn: [Steps.FETCH_ACCOUNT],
    executionHandler: fetchDevices,
  },
];

export async function fetchDevices({
  instance: { config },
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const client = await createMicrosoftConfigurationManagerClient(
    config,
    logger,
  );

  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  await client.listDevices(async (device) => {
    const deviceEntity = await jobState.addEntity(createDeviceEntity(device));

    await jobState.addRelationship(
      createAccountDeviceRelationship(accountEntity, deviceEntity),
    );
  });
}
