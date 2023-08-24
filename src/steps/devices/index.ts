import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { Steps, Entities } from '../constants';
import { createMicrosoftConfigurationManagerClient } from '../../configuration-manager';
import { createDeviceEntity } from './converters';

export const fetchDevicesSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.FETCH_DEVICES,
    name: 'Fetch-Devices',
    entities: [Entities.DEVICE],
    relationships: [],
    dependsOn: [],
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

  await client.listDevices(async (device) => {
    await jobState.addEntity(createDeviceEntity(device));
  });
}
