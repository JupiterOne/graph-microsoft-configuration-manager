function buildDeviceListQuery(dbName: string, offset: number, limit: number) {
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
  FROM (
    SELECT ROW_NUMBER() OVER (ORDER BY [ResourceID]) AS RowNum, *
    FROM [${dbName}].[dbo].[v_R_System]
  ) AS Sub
  WHERE Sub.RowNum BETWEEN ${offset} AND ${offset + limit - 1}`;
}

function buildApplicationListQuery(
  dbName: string,
  offset: number,
  limit: number,
) {
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
  FROM (
    SELECT ROW_NUMBER() OVER (ORDER BY [ModelName]) AS RowNum, *
    FROM [${dbName}].[dbo].[v_Applications]
  ) AS Sub
  WHERE Sub.RowNum BETWEEN ${offset} AND ${offset + limit - 1}`;
}

function buildApplicationDeviceTargetingList(
  dbName: string,
  offset: number,
  limit: number,
) {
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
  FROM [${dbName}].[dbo].[v_DeviceApplicationTargeting]
  ORDER BY [ResourceID]
  OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`;
}

function buildDeviceCollectionQuery(
  dbName: string,
  offset: number,
  limit: number,
) {
  validateDbName(dbName);

  return `SELECT [CollectionID]
    ,[SiteID]
    ,[CollectionName]
    ,[Flags]
    ,[ResultTableName]
    ,[CollectionComment]
    ,[Schedule]
    ,[SourceLocaleID]
    ,[LastChangeTime]
    ,[LastRefreshRequest]
    ,[CollectionType]
    ,[LimitToCollectionID]
    ,[IsReferenceCollection]
    ,[BeginDate]
    ,[EvaluationStartTime]
    ,[LastRefreshTime]
    ,[LastIncrementalRefreshTime]
    ,[LastMemberChangeTime]
    ,[CurrentStatus]
    ,[CurrentStatusTime]
    ,[LimitToCollectionName]
    ,[ISVData]
    ,[ISVString]
    ,[CollectionVariablesCount]
    ,[ServiceWindowsCount]
    ,[CloudSyncCount]
    ,[PowerConfigsCount]
    ,[RefreshType]
    ,[MonitoringFlags]
    ,[IsBuiltIn]
    ,[IncludeExcludeCollectionsCount]
    ,[MemberCount]
    ,[LocalMemberCount]
    ,[ResultClassName]
    ,[HasProvisionedMember]
    ,[UseCluster]
    ,[ObjectPath]
    ,[ServicePartners]
    ,[FullEvaluationRunTime]
    ,[FullEvaluationMemberChanges]
    ,[FullEvaluationMemberChangeTime]
    ,[FullEvaluationLastRefreshTime]
    ,[FullEvaluationNextRefreshTime]
    ,[IncrementalEvaluationRunTime]
    ,[IncrementalEvaluationMemberChanges]
    ,[IncrementalEvaluationMemberChangeTime]
    ,[IncrementalEvaluationLastRefreshTime]
  FROM (
    SELECT ROW_NUMBER() OVER (ORDER BY [CollectionID]) AS RowNum, *
    FROM [${dbName}].[dbo].[v_Collections]
    WHERE CollectionType = 2
  ) AS Sub
  WHERE Sub.RowNum BETWEEN ${offset} AND ${offset + limit - 1}`;
}

function buildCollectionSubscriptionQuery(
  dbName: string,
  tableName: string,
  offset: number,
  limit: number,
) {
  validateDbName(dbName);

  return `SELECT [MachineID]
      ,[ArchitectureKey]
      ,[Name]
      ,[SMSID]
      ,[SiteCode]
      ,[Domain]
      ,[ClientEdition]
      ,[ClientType]
      ,[ClientVersion]
      ,[IsDirect]
      ,[IsAssigned]
      ,[IsClient]
      ,[IsVirtualMachine]
      ,[IsAOACCapable]
      ,[IsObsolete]
      ,[IsActive]
      ,[IsDecommissioned]
      ,[WipeStatus]
      ,[RetireStatus]
      ,[SyncNowStatus]
      ,[LastSyncNowRequest]
      ,[ManagementAuthority]
      ,[AMTStatus]
      ,[AMTFullVersion]
      ,[DeviceOwner]
      ,[DeviceCategory]
      ,[SuppressAutoProvision]
      ,[IsApproved]
      ,[IsBlocked]
      ,[IsAlwaysInternet]
      ,[IsInternetEnabled]
      ,[ClientCertType]
      ,[UserName]
      ,[LastClientCheckTime]
      ,[ClientCheckPass]
      ,[ADSiteName]
      ,[UserDomainName]
      ,[ADLastLogonTime]
      ,[ClientRemediationSuccess]
      ,[ClientActiveStatus]
      ,[LastStatusMessage]
      ,[LastPolicyRequest]
      ,[LastDDR]
      ,[LastHardwareScan]
      ,[LastSoftwareScan]
      ,[LastMPServerName]
      ,[LastActiveTime]
      ,[CP_Status]
      ,[CP_LatestProcessingAttempt]
      ,[CP_LastInstallationError]
      ,[EAS_DeviceID]
      ,[DeviceOS]
      ,[DeviceOSBuild]
      ,[DeviceType]
      ,[ExchangeServer]
      ,[ExchangeOrganization]
      ,[PolicyApplicationStatus]
      ,[LastSuccessSyncTimeUTC]
      ,[PhoneNumber]
      ,[DeviceAccessState]
      ,[DeviceThreatLevel]
      ,[CoManaged]
      ,[PasscodeResetState]
      ,[PasscodeResetStateTimeStamp]
      ,[RemoteLockState]
      ,[RemoteLockStateTimeStamp]
      ,[ActivationLockBypassState]
      ,[ActivationLockBypassStateTimeStamp]
      ,[ActivationLockState]
      ,[IsSupervised]
      ,[EP_DeploymentState]
      ,[EP_DeploymentErrorCode]
      ,[EP_DeploymentDescription]
      ,[EP_PolicyApplicationState]
      ,[EP_PolicyApplicationErrorCode]
      ,[EP_PolicyApplicationDescription]
      ,[EP_Enabled]
      ,[EP_ClientVersion]
      ,[EP_ProductStatus]
      ,[EP_EngineVersion]
      ,[EP_AntivirusEnabled]
      ,[EP_AntivirusSignatureVersion]
      ,[EP_AntivirusSignatureUpdateDateTime]
      ,[EP_AntispywareEnabled]
      ,[EP_AntispywareSignatureVersion]
      ,[EP_AntispywareSignatureUpdateDateTime]
      ,[EP_LastFullScanDateTimeStart]
      ,[EP_LastFullScanDateTimeEnd]
      ,[EP_LastQuickScanDateTimeStart]
      ,[EP_LastQuickScanDateTimeEnd]
      ,[EP_InfectionStatus]
      ,[EP_PendingFullScan]
      ,[EP_PendingReboot]
      ,[EP_PendingManualSteps]
      ,[EP_PendingOfflineScan]
      ,[EP_LastInfectionTime]
      ,[EP_LastThreatName]
      ,[CNIsOnline]
      ,[CNLastOnlineTime]
      ,[CNLastOfflineTime]
      ,[ClientState]
      ,[CNAccessMP]
      ,[CNIsOnInternet]
      ,[Unknown]
      ,[ATP_LastConnected]
      ,[ATP_SenseIsRunning]
      ,[ATP_OnboardingState]
      ,[ATP_OrgId]
      ,[CA_IsCompliant]
      ,[CA_ComplianceSetTime]
      ,[CA_ComplianceEvalTime]
      ,[CA_ErrorDetails]
      ,[CA_ErrorLocation]
      ,[AADTenantID]
      ,[AADDeviceID]
      ,[SerialNumber]
      ,[IMEI]
      ,[PrimaryUser]
      ,[CurrentlogonUser]
      ,[LastLogonUser]
      ,[MACAddress]
      ,[SMBIOSGUID]
      ,[IsMDMActive]
      ,[SenseID]
      ,[BoundaryGroups]
      ,[LastFUErrorDetail]
  FROM [${dbName}].[dbo].[${tableName}]
  ORDER BY [MachineID]
  OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`;
}

function buildLegacyApplicationList(
  dbName: string,
  offset: number,
  limit: number,
) {
  validateDbName(dbName);

  return `SELECT [ResourceID]
        ,[GroupID]
        ,[RevisionID]
        ,[AgentID]
        ,[TimeStamp]
        ,[DisplayName0]
        ,[InstallDate0]
        ,[ProdID0]
        ,[Publisher0]
        ,[Version0]
    FROM [${dbName}].[dbo].[v_GS_ADD_REMOVE_PROGRAMS]
    ORDER BY [ResourceID]
    OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`;
}

// TODO this gives us some information we need, but unsure how we
// will relate to the last user that used it.
function buildApplicationLastUsedList(dbName: string) {
  validateDbName(dbName);

  return `SELECT TOP (1000) [ResourceID]
    ,[GroupID]
    ,[RevisionID]
    ,[AgentID]
    ,[TimeStamp]
    ,[AdditionalProductCodes0]
    ,[CompanyName0]
    ,[ExplorerFileName0]
    ,[FileDescription0]
    ,[FilePropertiesHash0]
    ,[FileSize0]
    ,[FileVersion0]
    ,[FolderPath0]
    ,[LastUsedTime0]
    ,[LastUserName0]
    ,[LaunchCount0]
    ,[msiDisplayName0]
    ,[msiPublisher0]
    ,[msiVersion0]
    ,[OriginalFileName0]
    ,[ProductCode0]
    ,[ProductLanguage0]
    ,[ProductName0]
    ,[ProductVersion0]
    ,[SoftwarePropertiesHash0]
  FROM [${dbName}].[dbo].[v_GS_CCM_RECENTLY_USED_APPS]`;
}

function buildLocalUserList(dbName: string, offset: number, limit: number) {
  validateDbName(dbName);

  return `SELECT [ResourceID]
      ,[GroupID]
      ,[RevisionID]
      ,[AgentID]
      ,[TimeStamp]
      ,[HealthStatus0]
      ,[LastAttemptedProfileDownload0]
      ,[LastAttemptedProfileUploadTi0]
      ,[LastBackgroundRegistryUpload0]
      ,[LastDownloadTime0]
      ,[LastUploadTime0]
      ,[LastUseTime0]
      ,[Loaded0]
      ,[LocalPath0]
      ,[RefCount0]
      ,[RoamingConfigured0]
      ,[RoamingPath0]
      ,[RoamingPreference0]
      ,[SID0]
      ,[Special0]
      ,[Status0]
  FROM (
      SELECT ROW_NUMBER() OVER (ORDER BY [ResourceID]) AS RowNum, *
      FROM [${dbName}].[dbo].[v_GS_USER_PROFILE]
  ) AS Sub
  WHERE Sub.RowNum BETWEEN ${offset} AND ${offset + limit - 1}`;
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
  buildDeviceCollectionQuery,
  buildCollectionSubscriptionQuery,
  buildLegacyApplicationList,
  buildApplicationLastUsedList,
  buildLocalUserList,
  validateDbName,
};
