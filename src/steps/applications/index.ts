import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { Steps, Entities, Relationships } from '../constants';
import { createMicrosoftConfigurationManagerClient } from '../../configuration-manager';
import {
  createApplicationEntity,
  createApplicationKey,
  createDeviceApplicationRelationship,
} from './converters';
import { createDeviceKey } from '../devices/converters';

export const fetchApplicationsSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.FETCH_APPLICATIONS,
    name: 'Fetch-Applications',
    entities: [Entities.APPLICATION],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchApplications,
  },
  {
    id: Steps.BUILD_APPLICATION_RELATIONSHIPS,
    name: 'Build-Application-Relationships',
    entities: [],
    relationships: [Relationships.DEVICE_INSTALLED_APPLICATION],
    dependsOn: [Steps.FETCH_APPLICATIONS, Steps.FETCH_DEVICES],
    executionHandler: buildApplicationRelationships,
  },
];

export async function fetchApplications({
  instance: { config },
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const client = await createMicrosoftConfigurationManagerClient(
    config,
    logger,
  );

  await client.listApplications(async (device) => {
    await jobState.addEntity(createApplicationEntity(device));
  });
}

export async function buildApplicationRelationships({
  instance: { config },
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const client = await createMicrosoftConfigurationManagerClient(
    config,
    logger,
  );

  await client.listApplicationDeviceTargets(async (application: any) => {
    const appID = createApplicationKey(application.CIGUID?.toString());
    const deviceID = createDeviceKey(application.ResourceID?.toString());
    const applicationEntity = await jobState.findEntity(appID);
    const deviceEntity = await jobState.findEntity(deviceID);
    if (applicationEntity && deviceEntity) {
      await jobState.addRelationship(
        createDeviceApplicationRelationship(deviceEntity, applicationEntity),
      );
    } else {
      logger.info(
        { appID, deviceID },
        `Unable to create relationship between application and device.`,
      );
    }
  });
}
