import {
  createDirectRelationship,
  createIntegrationEntity,
  Entity,
  Relationship,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';

export function createApplicationKey(id: string) {
  return `${Entities.APPLICATION._type}:${id}`;
}

export function createApplicationEntity(application: any): Entity {
  const id = application.CIGUID?.toString();

  return createIntegrationEntity({
    entityData: {
      source: application,
      assign: {
        _key: createApplicationKey(id),
        _type: Entities.APPLICATION._type,
        _class: Entities.APPLICATION._class,
        id: id,
        name: application.DisplayName,
        displayName: application.DisplayName,
        softwareVersion: application.SoftwareVersion,
        manufacturer: application.Manufacturer,
        comments: application.AdminComments,
      },
    },
  });
}

export function createLegacyApplicationEntity(application: any): Entity {
  const id = application.ProdID0?.toString();

  return createIntegrationEntity({
    entityData: {
      source: application,
      assign: {
        _key: createApplicationKey(id),
        _type: Entities.APPLICATION._type,
        _class: Entities.APPLICATION._class,
        id: id,
        name: application.DisplayName0,
        displayName: application.DisplayName0,
        softwareVersion: application.Version0,
        manufacturer: application.Publisher0,
      },
    },
  });
}

export function createDeviceApplicationRelationship(
  deviceKey: string,
  applicationKey: string,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.INSTALLED,
    fromKey: deviceKey,
    fromType: Entities.DEVICE._type,
    toKey: applicationKey,
    toType: Entities.APPLICATION._type,
  });
}
