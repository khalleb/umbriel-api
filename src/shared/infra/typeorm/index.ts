import { createConnections } from 'typeorm';

import { AppLogger } from '@shared/logger';

async function createDbConnection() {
  const connection = await createConnections();
  if (connection && connection?.length > 0) {
    const namesDataBase = connection?.map(e => e?.options?.type)?.join(',');
    AppLogger.warn({
      message: `${
        connection.length > 1 ? `Databases connected: ${namesDataBase}` : `Database connected: ${namesDataBase}`
      }`,
    });
  }
  return connection;
}

export { createDbConnection };
