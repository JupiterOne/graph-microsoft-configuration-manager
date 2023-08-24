import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const Steps: Record<'FETCH_ACCOUNT' | 'FETCH_DEVICES', string> = {
  FETCH_ACCOUNT: 'fetch-account',
  FETCH_DEVICES: 'fetch-devices',
};

export const Entities: Record<
  'ACCOUNT' | 'APPLICATION' | 'DEVICE',
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
  DEVICE: {
    resourceName: 'Device',
    _type: 'microsoft_configuration_manager_device',
    _class: ['Device'],
  },
};

export const Relationships: Record<
  'ACCOUNT_HAS_DEVICE' | 'DEVICE_INSTALLED_APPLICATION',
  StepRelationshipMetadata
> = {
  ACCOUNT_HAS_DEVICE: {
    _type: 'microsoft_configuration_manager_account_has_device',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.DEVICE._type,
  },
  DEVICE_INSTALLED_APPLICATION: {
    _type: 'microsoft_configuration_manager_device_installed_device',
    sourceType: Entities.DEVICE._type,
    _class: RelationshipClass.INSTALLED,
    targetType: Entities.APPLICATION._type,
  },
};
