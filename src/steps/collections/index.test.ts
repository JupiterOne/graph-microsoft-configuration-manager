import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { Steps } from '../constants';
import sql from 'mssql';
import { collectionRecords } from '../../../test/mockData';

test('fetch-collections', async () => {
  jest.mock('mssql');
  sql.connect = jest.fn().mockResolvedValue({
    query: jest.fn((query) => {
      const match = query.match(/BETWEEN (\d+) AND (\d+)/);
      if (!match) throw new Error('Invalid query');

      const start = parseInt(match[1]);
      const end = parseInt(match[2]);

      const recordset = collectionRecords.slice(start - 1, end);
      return Promise.resolve({ recordset, recordsets: [0, 0] });
    }),
    close: jest.fn(),
  });

  const stepConfig = buildStepTestConfigForStep(Steps.FETCH_COLLECTIONS);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});
