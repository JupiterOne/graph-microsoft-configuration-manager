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

  async listDevices<T>(iteratee: ResourceIteratee<T>) {
    const result = await this.wrapWithRequestFailedHandler(() =>
      this.connection.query(buildDeviceListQuery(this.dbName)),
    );

    for (const record of result.recordset) {
      await iteratee(record);
    }
  }

  async listApplications<T>(iteratee: ResourceIteratee<T>) {
    const result = await this.wrapWithRequestFailedHandler(() =>
      this.connection.query(buildApplicationListQuery(this.dbName)),
    );

    for (const record of result.recordset) {
      await iteratee(record);
    }
  }

  async listApplicationDeviceTargets<T>(iteratee: ResourceIteratee<T>) {
    const result = await this.wrapWithRequestFailedHandler(() =>
      this.connection.query(buildApplicationDeviceTargetingList(this.dbName)),
    );

    for (const record of result.recordset) {
      await iteratee(record);
    }
  }

  async listCollections<T>(iteratee: ResourceIteratee<T>) {
    const result = await this.wrapWithRequestFailedHandler(() =>
      this.connection.query(buildDeviceCollectionQuery(this.dbName)),
    );

    for (const record of result.recordset) {
      await iteratee(record);
    }
  }

  async listCollectionSubscriptions<T>(
    tableName: string,
    iteratee: ResourceIteratee<T>,
  ) {
    const result = await this.wrapWithRequestFailedHandler(() =>
      this.connection.query(
        buildCollectionSubscriptionQuery(this.dbName, tableName),
      ),
    );

    for (const record of result.recordset) {
      await iteratee(record);
    }
  }

  async listLegacyApplications<T>(iteratee: ResourceIteratee<T>) {
    const result = await this.wrapWithRequestFailedHandler(() =>
      this.connection.query(buildLegacyApplicationList(this.dbName)),
    );

    for (const record of result.recordset) {
      await iteratee(record);
    }
  }

  async listLocalUsers<T>(iteratee: ResourceIteratee<T>) {
    const result = await this.wrapWithRequestFailedHandler(() =>
      this.connection.query(buildLocalUserList(this.dbName)),
    );

    for (const record of result.recordset) {
      await iteratee(record);
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
  const url = new URL(dbHost);
  const server = url.host;
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
    },
  });

  return new MicrosoftConfigurationManagerClient({
    connection: pool,
    dbName,
    onRequestFailed,
  });
}

export { MicrosoftConfigurationManagerClient, createClient };
