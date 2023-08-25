import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { Steps } from '../constants';
import sql from 'mssql';
import { applicationRecords } from '../../../test/mockData';

test('fetch-devices', async () => {
  jest.mock('mssql');
  sql.connect = jest.fn().mockResolvedValue({
    query: jest.fn().mockResolvedValue({
      recordset: applicationRecords,
      recordsets: [0, 0],
    }),
    close: jest.fn(),
  });

  const stepConfig = buildStepTestConfigForStep(Steps.FETCH_APPLICATIONS);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});
