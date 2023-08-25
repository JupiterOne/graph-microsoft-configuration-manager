import { fetchAccountSteps } from './account';
import { fetchApplicationsSteps } from './applications';
import { fetchDevicesSteps } from './devices';

const integrationSteps = [
  ...fetchAccountSteps,
  ...fetchApplicationsSteps,
  ...fetchDevicesSteps,
];

export { integrationSteps };
