import { StationModel, CityModel } from '@shypple/infra/mongoose/models';
import { CityRepo } from './city-repo';
import { StationRepo } from './station-repo';

const stationRepo = new StationRepo(StationModel);
const cityRepo = new CityRepo(CityModel);

export { stationRepo, cityRepo };
