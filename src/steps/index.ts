import { fetchAccountSteps } from './account';
import { fetchApplicationsSteps } from './applications';
import { fetchCollectionsSteps } from './collections';
import { fetchDevicesSteps } from './devices';

const integrationSteps = [
  ...fetchAccountSteps,
  ...fetchApplicationsSteps,
  ...fetchCollectionsSteps,
  ...fetchDevicesSteps,
];

export { integrationSteps };
