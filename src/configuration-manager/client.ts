import * as sql from 'mssql';
import {
  buildApplicationDeviceTargetingList,
  buildApplicationListQuery,
  buildCollectionSubscriptionQuery,
  buildDeviceCollectionQuery,
  buildDeviceListQuery,
  buildLegacyApplicationList,
  buildLocalUserList,
} from './queries';
import pMap from 'p-map';

type ResourceIteratee<T> = (each: T) => Promise<void> | void;

type CreateMicrosoftConfigurationManagerClientParams = {
  connection: sql.ConnectionPool;
  dbName: string;
  onRequestFailed: (err: Error) => void;
};

class MicrosoftConfigurationManagerClient {
  private readonly connection: sql.ConnectionPool;
  private readonly dbName: string;
  private readonly onRequestFailed: (err: Error) => void;

  constructor({
    connection,
    dbName,
    onRequestFailed,
  }: CreateMicrosoftConfigurationManagerClientParams) {
    this.connection = connection;
    this.dbName = dbName;
    this.onRequestFailed = onRequestFailed;
  }

  async listDevices<T>(iteratee: ResourceIteratee<T>, pageSize: number = 1000) {
    let offset = 0;
    let hasMoreRecords = true;

    while (hasMoreRecords) {
      const query = buildDeviceListQuery(this.dbName, offset, pageSize);
      const result = await this.wrapWithRequestFailedHandler(() =>
        this.connection.query(query),
      );

      const records = result.recordset;
      if (records.length > 0) {
        await pMap(
          records,
          async (record) => {
            await iteratee(record);
          },
          {
            concurrency: 2,
          },
        );

        offset += pageSize;
      } else {
        hasMoreRecords = false;
      }
    }
  }

  async listApplications<T>(
    iteratee: ResourceIteratee<T>,
    pageSize: number = 1000,
  ) {
    let offset = 0;
    let hasMoreRecords = true;

    while (hasMoreRecords) {
      const query = buildApplicationListQuery(this.dbName, offset, pageSize);
      const result = await this.wrapWithRequestFailedHandler(() =>
        this.connection.query(query),
      );

      const records = result.recordset;
      if (records.length > 0) {
        await pMap(
          records,
          async (record) => {
            await iteratee(record);
          },
          {
            concurrency: 2,
          },
        );
        offset += pageSize;
      } else {
        hasMoreRecords = false;
      }
    }
  }

  async listApplicationDeviceTargets<T>(
    iteratee: ResourceIteratee<T>,
    pageSize: number = 600,
  ) {
    let offset = 0;
    let hasMoreRecords = true;

    while (hasMoreRecords) {
      const query = buildApplicationDeviceTargetingList(
        this.dbName,
        offset,
        pageSize,
      );
      const result = await this.wrapWithRequestFailedHandler(() =>
        this.connection.query(query),
      );

      const records = result.recordset;
      if (records.length > 0) {
        await pMap(
          records,
          async (record) => {
            await iteratee(record);
          },
          {
            concurrency: 2,
          },
        );
        offset += pageSize;
      } else {
        hasMoreRecords = false;
      }
    }
  }

  async listCollections<T>(
    iteratee: ResourceIteratee<T>,
    pageSize: number = 1000,
  ) {
    let offset = 0;
    let hasMoreRecords = true;

    while (hasMoreRecords) {
      const query = buildDeviceCollectionQuery(this.dbName, offset, pageSize);
      const result = await this.wrapWithRequestFailedHandler(() =>
        this.connection.query(query),
      );

      const records = result.recordset;
      if (records.length > 0) {
        await pMap(
          records,
          async (record) => {
            await iteratee(record);
          },
          {
            concurrency: 2,
          },
        );
        offset += pageSize;
      } else {
        hasMoreRecords = false;
      }
    }
  }

  async listCollectionSubscriptions<T>(
    tableName: string,
    iteratee: ResourceIteratee<T>,
    pageSize: number = 200,
  ) {
    let offset = 0;
    let hasMoreRecords = true;

    while (hasMoreRecords) {
      const query = buildCollectionSubscriptionQuery(
        this.dbName,
        tableName,
        offset,
        pageSize,
      );
      const result = await this.wrapWithRequestFailedHandler(() =>
        this.connection.query(query),
      );

      const records = result.recordset;
      if (records.length > 0) {
        await pMap(
          records,
          async (record) => {
            await iteratee(record);
          },
          {
            concurrency: 2,
          },
        );
        offset += pageSize;
      } else {
        hasMoreRecords = false;
      }
    }
  }

  async listLegacyApplications<T>(
    iteratee: ResourceIteratee<T>,
    pageSize: number = 1000,
  ) {
    let offset = 0;
    let hasMoreRecords = true;

    while (hasMoreRecords) {
      const query = buildLegacyApplicationList(this.dbName, offset, pageSize);
      const result = await this.wrapWithRequestFailedHandler(() =>
        this.connection.query(query),
      );

      const records = result.recordset;
      if (records.length > 0) {
        await pMap(
          records,
          async (record) => {
            await iteratee(record);
          },
          {
            concurrency: 2,
          },
        );
        offset += pageSize;
      } else {
        hasMoreRecords = false;
      }
    }
  }

  async listLocalUsers<T>(
    iteratee: ResourceIteratee<T>,
    pageSize: number = 1000,
  ) {
    let offset = 0;
    let hasMoreRecords = true;

    while (hasMoreRecords) {
      const query = buildLocalUserList(this.dbName, offset, pageSize);
      const result = await this.wrapWithRequestFailedHandler(() =>
        this.connection.query(query),
      );

      const records = result.recordset;
      if (records.length > 0) {
        await pMap(
          records,
          async (record) => {
            await iteratee(record);
          },
          {
            concurrency: 2,
          },
        );
        offset += pageSize;
      } else {
        hasMoreRecords = false;
      }
    }
  }

  async close() {
    if (this.connection.connected) {
      await this.connection.close();
    }
  }

  private async wrapWithRequestFailedHandler<TResponse>(
    fn: () => Promise<TResponse>,
  ) {
    try {
      return await fn();
    } catch (err) {
      throw this.onRequestFailed(err);
    }
  }
}

type CreateClientParams = {
  dbHost: string;
  dbName: string;
  dbUsername: string;
  dbPassword: string;
  onRequestFailed: (err: Error) => void;
};

async function createClient({
  dbHost,
  dbName,
  dbUsername,
  dbPassword,
  onRequestFailed,
}: CreateClientParams): Promise<MicrosoftConfigurationManagerClient> {
  if (!dbHost.startsWith('sql://')) {
    dbHost = `sql://${dbHost}`;
  }
  const url = new URL(dbHost);
  const server = url.hostname;
  const port = url.port !== '' ? Number.parseInt(url.port, 10) : undefined;
  const pool = await sql.connect({
    server,
    port,
    user: dbUsername,
    password: dbPassword,
    database: dbName,
    options: {
      // TODO: Configure these appropriately based on the customer's set-up.
      trustedConnection: true,
      encrypt: false, // for azure
      trustServerCertificate: true, // change to true for local dev / self-signed certs
      requestTimeout: 60000,
    },
  });

  return new MicrosoftConfigurationManagerClient({
    connection: pool,
    dbName,
    onRequestFailed,
  });
}

export { MicrosoftConfigurationManagerClient, createClient };
