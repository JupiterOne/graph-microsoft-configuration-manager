import {
  createDirectRelationship,
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
  Relationship,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';

export function createLocalUserKey(id: string) {
  return `${Entities.LOCAL_USER._type}:${id}`;
}

export function createLocalUserEntity(user: any): Entity {
  const id = user.SID0?.toString();
  return createIntegrationEntity({
    entityData: {
      source: user,
      assign: {
        _key: createLocalUserKey(id),
        _type: Entities.LOCAL_USER._type,
        _class: Entities.LOCAL_USER._class,
        id: id,
        name: id,
        displayName: id,
        localPath: user.LocalPath0,
        createdOn: parseTimePropertyValue(user.TimeStamp),
      },
    },
  });
}

export function createDeviceLocalUserRelationship(
  device: Entity,
  user: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: device,
    to: user,
  });
}
