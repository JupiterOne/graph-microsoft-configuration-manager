import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { Steps } from '../constants';
import sql from 'mssql';
import { deviceRecords, localUserRecords } from '../../../test/mockData';

test('fetch-local-users', async () => {
  jest.mock('mssql');
  sql.connect = jest
    .fn()
    .mockResolvedValueOnce({
      query: jest.fn().mockResolvedValue({
        recordset: deviceRecords,
        recordsets: [0, 0],
      }),
      close: jest.fn(),
    })
    .mockReturnValueOnce({
      query: jest.fn().mockResolvedValue({
        recordset: localUserRecords,
        recordsets: [0, 0],
      }),
      close: jest.fn(),
    });

  const stepConfig = buildStepTestConfigForStep(Steps.FETCH_LOCAL_USERS);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});
