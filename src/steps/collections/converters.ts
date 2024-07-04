import {
  createDirectRelationship,
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
  Relationship,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';

export function createDeviceCollectionKey(id: string) {
  return `${Entities.COLLECTION._type}:${id}`;
}

export function createDeviceCollectionEntity(collection: any): Entity {
  const id = collection.CollectionID?.toString();
  return createIntegrationEntity({
    entityData: {
      source: collection,
      assign: {
        _key: createDeviceCollectionKey(id),
        _type: Entities.COLLECTION._type,
        _class: Entities.COLLECTION._class,
        id: id,
        name: collection.CollectionName,
        displayName: collection.CollectionName,
        comment: collection.CollectionComment,
        lastSeenOn: parseTimePropertyValue(collection.LastRefreshRequest),
        createdOn: parseTimePropertyValue(collection.BeginDate),
      },
    },
  });
}

export function createCollectorDeviceRelationship(
  collector: Entity,
  deviceKey: string,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    fromKey: collector._key,
    fromType: collector._type,
    toKey: deviceKey,
    toType: Entities.DEVICE._type,
  });
}
