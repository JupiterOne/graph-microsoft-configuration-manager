import {
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const Steps: Record<'FETCH_DEVICES', string> = {
  FETCH_DEVICES: 'fetch-devices',
};

export const Entities: Record<'DEVICE', StepEntityMetadata> = {
  DEVICE: {
    resourceName: 'Device',
    _type: 'microsoft_configuration_manager_device',
    _class: ['Device'],
  },
};

export const Relationships: Record<string, StepRelationshipMetadata> = {};
