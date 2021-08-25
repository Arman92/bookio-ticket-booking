import { StationModel } from '@shypple/infra/mongoose/models/station-model';
import { StationRepo } from './station-repo';

const stationRepo = new StationRepo(StationModel);

export { stationRepo };
