import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { Steps, Entities, Relationships } from '../constants';
import { createMicrosoftConfigurationManagerClient } from '../../configuration-manager';
import {
  createDeviceLocalUserRelationship,
  createLocalUserEntity,
} from './converters';
import { createDeviceKey } from '../devices/converters';

export const fetchLocalUserSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.FETCH_LOCAL_USERS,
    name: 'Fetch-Local-Users',
    entities: [Entities.LOCAL_USER],
    relationships: [Relationships.DEVICE_HAS_LOCAL_USER],
    dependsOn: [Steps.FETCH_DEVICES],
    executionHandler: fetchLocalUsers,
  },
];

export async function fetchLocalUsers({
  instance: { config },
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const client = await createMicrosoftConfigurationManagerClient(
    config,
    logger,
  );

  await client.listLocalUsers(async (user: any) => {
    const userEntity = createLocalUserEntity(user);

    if (!jobState.hasKey(userEntity._key)) {
      await jobState.addEntity(userEntity);

      const deviceEntity = await jobState.findEntity(
        createDeviceKey(user.ResourceID),
      );

      if (deviceEntity) {
        await jobState.addRelationship(
          createDeviceLocalUserRelationship(deviceEntity, userEntity),
        );
      }
    }
  });
}
