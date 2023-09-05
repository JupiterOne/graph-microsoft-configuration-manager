import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const Steps: Record<
  | 'FETCH_ACCOUNT'
  | 'FETCH_APPLICATIONS'
  | 'FETCH_COLLECTIONS'
  | 'FETCH_DEVICES'
  | 'BUILD_APPLICATION_RELATIONSHIPS'
  | 'BUILD_COLLECTION_RELATIONSHIPS',
  string
> = {
  FETCH_ACCOUNT: 'fetch-account',
  FETCH_APPLICATIONS: 'fetch-applications',
  FETCH_COLLECTIONS: 'fetch-collections',
  FETCH_DEVICES: 'fetch-devices',
  BUILD_APPLICATION_RELATIONSHIPS: 'build-application-relationships',
  BUILD_COLLECTION_RELATIONSHIPS: 'build-collection-relationships',
};

export const Entities: Record<
  'ACCOUNT' | 'APPLICATION' | 'COLLECTION' | 'DEVICE',
  StepEntityMetadata
> = {
  ACCOUNT: {
    resourceName: 'Account',
    _type: 'microsoft_configuration_manager_account',
    _class: ['Account'],
  },
  APPLICATION: {
    resourceName: 'Application',
    _type: 'microsoft_configuration_manager_application',
    _class: ['Application'],
  },
  COLLECTION: {
    resourceName: 'Device Collection',
    _type: 'microsoft_configuration_manager_device_collection',
    _class: ['Group'],
  },
  DEVICE: {
    resourceName: 'Device',
    _type: 'microsoft_configuration_manager_device',
    _class: ['Device'],
  },
};

export const Relationships: Record<
  | 'ACCOUNT_HAS_DEVICE'
  | 'COLLECTION_HAS_DEVICE'
  | 'DEVICE_INSTALLED_APPLICATION',
  StepRelationshipMetadata
> = {
  ACCOUNT_HAS_DEVICE: {
    _type: 'microsoft_configuration_manager_account_has_device',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.DEVICE._type,
  },
  COLLECTION_HAS_DEVICE: {
    _type: 'microsoft_configuration_manager_device_collection_has_device',
    sourceType: Entities.COLLECTION._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.DEVICE._type,
  },
  DEVICE_INSTALLED_APPLICATION: {
    _type: 'microsoft_configuration_manager_device_installed_application',
    sourceType: Entities.DEVICE._type,
    _class: RelationshipClass.INSTALLED,
    targetType: Entities.APPLICATION._type,
  },
};
