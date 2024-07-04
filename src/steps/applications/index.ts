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
  createLegacyApplicationEntity,
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
    id: Steps.FETCH_LEGACY_APPLICATIONS,
    name: 'Fetch-Legacy-Applications',
    entities: [Entities.APPLICATION],
    relationships: [Relationships.DEVICE_INSTALLED_APPLICATION],
    dependsOn: [Steps.FETCH_DEVICES],
    executionHandler: fetchLegacyApplications,
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

export async function fetchLegacyApplications({
  instance: { config },
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const client = await createMicrosoftConfigurationManagerClient(
    config,
    logger,
  );

  await client.listLegacyApplications(async (application: any) => {
    const legacyApplicationEntity = createLegacyApplicationEntity(application);

    if (!jobState.hasKey(legacyApplicationEntity._key)) {
      const applicationEntity = await jobState.addEntity(
        legacyApplicationEntity,
      );
      const deviceKey = createDeviceKey(application.ResourceID?.toString());

      if (applicationEntity._key && deviceKey) {
        await jobState.addRelationship(
          createDeviceApplicationRelationship(
            deviceKey,
            applicationEntity._key,
          ),
        );
      }
    }
  });
}

export async function fetchApplications({
  instance: { config },
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const client = await createMicrosoftConfigurationManagerClient(
    config,
    logger,
  );

  await client.listApplications(async (application) => {
    await jobState.addEntity(createApplicationEntity(application));
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

  await client.listApplicationDeviceTargets(
    async (application: any) => {
      const applicationKey = createApplicationKey(
        application.CIGUID?.toString(),
      );
      const deviceKey = createDeviceKey(application.ResourceID?.toString());

      if (applicationKey && deviceKey) {
        const deviceApplicationRelationship =
          createDeviceApplicationRelationship(deviceKey, applicationKey);

        if (!jobState.hasKey(deviceApplicationRelationship._key)) {
          await jobState.addRelationship(deviceApplicationRelationship);
        }
      }
    },
    300,
    logger,
  );
}
