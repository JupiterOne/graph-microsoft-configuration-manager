import { fetchAccountSteps } from './account';
import { fetchDevicesSteps } from './devices';

const integrationSteps = [...fetchAccountSteps, ...fetchDevicesSteps];

export { integrationSteps };
