import {
  createDirectRelationship,
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
  Relationship,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';

export function createDeviceKey(id: string) {
  return `${Entities.DEVICE._type}:${id}`;
}

export function createDeviceEntity(device: any): Entity {
  const lastSeenOn = parseTimePropertyValue(device.Last_Logon_Timestamp0);
  const id = device.ResourceID?.toString();

  return createIntegrationEntity({
    entityData: {
      source: device,
      assign: {
        _key: createDeviceKey(id),
        _type: Entities.DEVICE._type,
        _class: Entities.DEVICE._class,
        id: id,
        deviceId: id,
        name: device.Name0,
        displayName: device.Name0,
        osName: device.Operating_System_Name_and0,
        category: null,
        make: null,
        model: null,
        serial: device.SerialNumber || null,
        serialNumber: device.SerialNumber || null,
        aadDeviceId: device.AADDeviceId,
        adSiteName: device.Active0,
        active: device.Active0 == true, // This appears to be 0/1 or true/false depending on the table used.  Deliberately picking double equals to make sure both work.
        clientVersion: device.Client_Version0,
        cpuType: device.CPUType0,
        domainName: device.Full_Domain_Name0,
        hardwareId: device.Hardware_ID0,
        sid: device.SID0,
        lastSeenOn: lastSeenOn,
        createdOn: parseTimePropertyValue(device.Creation_Date0),
      },
    },
  });
}

export function createAccountDeviceRelationship(
  account: Entity,
  device: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: account,
    to: device,
  });
}
