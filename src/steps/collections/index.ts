import {
  IntegrationStep,
  IntegrationStepExecutionContext,
  getRawData,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { Steps, Entities, Relationships } from '../constants';
import { createMicrosoftConfigurationManagerClient } from '../../configuration-manager';
import {
  createCollectorDeviceRelationship,
  createDeviceCollectionEntity,
} from './converters';
import { createDeviceKey } from '../devices/converters';

export const fetchCollectionsSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.FETCH_COLLECTIONS,
    name: 'Fetch-Collections',
    entities: [Entities.COLLECTION],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchCollections,
  },
  {
    id: Steps.BUILD_COLLECTION_RELATIONSHIPS,
    name: 'Build Collection Relationships',
    entities: [],
    relationships: [Relationships.COLLECTION_HAS_DEVICE],
    dependsOn: [
      Steps.FETCH_COLLECTIONS,
      Steps.FETCH_DEVICES,
      // INT-11156: this kind of hacky, but we need to await until this steps finishes to avoid overloading the server
      Steps.BUILD_APPLICATION_RELATIONSHIPS,
    ],
    executionHandler: buildCollectionsRelationships,
  },
];

export async function fetchCollections({
  instance: { config },
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const client = await createMicrosoftConfigurationManagerClient(
    config,
    logger,
  );

  await client.listCollections(async (collection) => {
    await jobState.addEntity(createDeviceCollectionEntity(collection));
  });
}

export async function buildCollectionsRelationships({
  instance: { config },
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const client = await createMicrosoftConfigurationManagerClient(
    config,
    logger,
  );

  await jobState.iterateEntities(
    {
      _type: Entities.COLLECTION._type,
    },
    async (collectionEntity) => {
      const collectionRawData: any = getRawData(collectionEntity);

      if (collectionRawData.ResultTableName) {
        // We need the ResultTableName value to determine what table to query for each collection.
        await client.listCollectionSubscriptions(
          collectionRawData.ResultTableName,
          async (subscription: any) => {
            const deviceKey = createDeviceKey(subscription.MachineID);

            if (deviceKey && subscription.MachineID) {
              await jobState.addRelationship(
                createCollectorDeviceRelationship(
                  collectionEntity,
                  createDeviceKey(subscription.MachineID),
                ),
              );
            }
          },
          logger,
        );
      }
    },
  );
}
