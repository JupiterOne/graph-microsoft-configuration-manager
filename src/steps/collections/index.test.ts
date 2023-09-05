import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { Steps } from '../constants';
import sql from 'mssql';
import { collectionRecords } from '../../../test/mockData';

test('fetch-collections', async () => {
  jest.mock('mssql');
  sql.connect = jest.fn().mockResolvedValue({
    query: jest.fn().mockResolvedValue({
      recordset: collectionRecords,
      recordsets: [0, 0],
    }),
    close: jest.fn(),
  });

  const stepConfig = buildStepTestConfigForStep(Steps.FETCH_COLLECTIONS);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});
