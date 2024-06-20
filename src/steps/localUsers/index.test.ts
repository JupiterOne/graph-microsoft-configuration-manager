import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { Steps } from '../constants';
import sql from 'mssql';
import { deviceRecords, localUserRecords } from '../../../test/mockData';

test('fetch-local-users', async () => {
  jest.mock('mssql');
  let callCount = 0;
  sql.connect = jest.fn().mockImplementation(() => {
    callCount++;
    return Promise.resolve({
      query: jest.fn((query) => {
        const match = query.match(/BETWEEN (\d+) AND (\d+)/);
        if (!match) throw new Error('Invalid query');

        const start = parseInt(match[1]);
        const end = parseInt(match[2]);

        let recordset;
        if (callCount === 1) {
          recordset = deviceRecords.slice(start - 1, end);
        } else if (callCount === 2) {
          recordset = localUserRecords.slice(start - 1, end);
        }
        return Promise.resolve({ recordset, recordsets: [0, 0] });
      }),
      close: jest.fn(),
    });
  });

  const stepConfig = buildStepTestConfigForStep(Steps.FETCH_LOCAL_USERS);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});
