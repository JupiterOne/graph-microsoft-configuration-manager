import { fetchAccountSteps } from './account';
import { fetchApplicationsSteps } from './applications';
import { fetchCollectionsSteps } from './collections';
import { fetchDevicesSteps } from './devices';
import { fetchLocalUserSteps } from './localUsers';

const integrationSteps = [
  ...fetchAccountSteps,
  ...fetchApplicationsSteps,
  ...fetchCollectionsSteps,
  ...fetchDevicesSteps,
  ...fetchLocalUserSteps,
];

export { integrationSteps };
