import 'mocha';
import { expect } from 'chai';

import { Station } from '../station';
import { UniqueEntityID } from '@shypple/core/domain';

describe('Station', () => {
  it('Should be able to be created Station', () => {
    const stationOrError = Station.create({
      cityId: new UniqueEntityID(),
      name: 'Station 1',
      latitude: 32.112,
      longitude: 52.48,
    });

    expect(stationOrError.isSuccess).to.eq(true);
    expect(stationOrError.getValue().cityId).to.not.eq(null);
    expect(stationOrError.getValue().name).to.eq('Station 1');
    expect(stationOrError.getValue().latitude).to.eq(32.112);
    expect(stationOrError.getValue().longitude).to.eq(52.48);
  });

  it('Should not create with invalid cityId', () => {
    const stationOrError = Station.create({
      cityId: null,
      name: 'Station 1',
      latitude: 32.112,
      longitude: 52.48,
    });

    expect(stationOrError.isFailure).to.eq(true);
    expect(stationOrError.error).to.be.a('string');
  });

  it('Should not create with invalid name', () => {
    const stationOrError = Station.create({
      cityId: new UniqueEntityID(),
      name: null,
      latitude: 32.112,
      longitude: 52.48,
    });

    expect(stationOrError.isFailure).to.eq(true);
    expect(stationOrError.error).to.be.a('string');
  });

  it('Should not create with invalid coordinations', () => {
    const stationOrError = Station.create({
      cityId: new UniqueEntityID(),
      name: 'Station 1',
      latitude: null,
      longitude: 52.48,
    });

    expect(stationOrError.isFailure).to.eq(true);
    expect(stationOrError.error).to.be.a('string');
  });
});
