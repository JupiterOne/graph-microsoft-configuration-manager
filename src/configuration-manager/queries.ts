function buildDeviceListQuery(dbName: string) {
  validateDbName(dbName);

  return `SELECT [ResourceID]
      ,[AADDeviceID]
      ,[AADTenantID]
      ,[Active0]
      ,[AD_Site_Name0]
      ,[AlwaysInternet0]
      ,[AMTFullVersion0]
      ,[AMTStatus0]
      ,[Build01]
      ,[BuildExt]
      ,[Client0]A
      ,[AgentEdition0]
      ,[Client_Type0]
      ,[Client_Version0]
      ,[CloudPCInfo]
      ,[CPUType0]
      ,[Creation_Date0]
      ,[Decommissioned0]
      ,[DeviceOwner0]
      ,[DisableWindowsUpdateAccess]
      ,[Distinguished_Name0]
      ,[DNSForestGuid]
      ,[DoNotConnectToWULocations]
      ,[DotNetRelease]
      ,[EAS_DeviceID]
      ,[ESUValue]
      ,[Full_Domain_Name0]
      ,[Hardware_ID0]
      ,[InternetEnabled0]
      ,[Is_AOAC_Capable0]
      ,[Is_MachineChanges_Persisted0]
      ,[IsClientAMT30Compatible0]
      ,[Is_Assigned_To_User0]
      ,[Is_Portable_Operating_System0]
      ,[Is_Virtual_Machine0]
      ,[Is_Write_Filter_Capable0]
      ,[Last_Logon_Timestamp0]
      ,[User_Domain0]
      ,[User_Name0]
      ,[ManagementAuthority]
      ,[MDMStatus]
      ,[MDMDeviceCategoryID0]
      ,[Name0]
      ,[Netbios_Name0]
      ,[Object_GUID0]
      ,[Obsolete0]
      ,[Operating_System_Name_and0]
      ,[OSBranch01]
      ,[Previous_SMS_UUID0]
      ,[Primary_Group_ID0]
      ,[PublisherDeviceID]
      ,[Resource_Domain_OR_Workgr0]
      ,[SenseID]
      ,[SerialNumber]
      ,[SID0]
      ,[SMBIOS_GUID0]
      ,[SMS_Unique_Identifier0]
      ,[SMS_UUID_Change_Date0]
      ,[Community_Name0]
      ,[SuppressAutoProvision0]
      ,[Unknown0]
      ,[User_Account_Control0]
      ,[Virtual_Machine_Host_Name0]
      ,[Virtual_Machine_Type0]
      ,[WipeStatus0]
      ,[WTGUniqueKey]
  FROM [${dbName}].[dbo].[v_R_System]`;
}

function buildApplicationListQuery(dbName: string) {
  validateDbName(dbName);

  return `SELECT [ModelName]
    ,[CIVersion]
    ,[CIGUID]
    ,[DisplayName]
    ,[AdminComments]
    ,[Manufacturer]
    ,[SoftwareVersion]
    ,[Actions]
    ,[IsUserContext]
    ,[ModelId]
    ,[ObjectTypeID]
  FROM [${dbName}].[dbo].[v_Applications]`;
}

function buildApplicationDeviceTargetingList(dbName: string) {
  validateDbName(dbName);

  return `SELECT [ModelName]
  ,[CIGUID]
  ,[ResourceID]
  ,[Username]
  ,[CIVersion]
  ,[OfferTypeID]
  ,[Deadline]
  ,[Capabilities]
  ,[ObjectTypeID]
FROM [${dbName}].[dbo].[v_DeviceApplicationTargeting]`;
}

function validateDbName(dbName: string) {
  if (!/^[\w]+$/.test(dbName)) {
    throw new Error(`Invalid database name: ${dbName}`);
  }
}

export {
  buildDeviceListQuery,
  buildApplicationListQuery,
  buildApplicationDeviceTargetingList,
  validateDbName,
};
