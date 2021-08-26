import 'mocha';
import { expect } from 'chai';

import { UniqueEntityID } from '@shypple/core/domain';
import { Trip } from '../trip';

describe('Trip', () => {
  it('Should be able to be created Trip', () => {
    const transportVehicleOrError = Trip.create({
      fromStationId: new UniqueEntityID(),
      toStationId: new UniqueEntityID(),
      busId: new UniqueEntityID(),
      durationMins: 60,
      fare: 5,
    });

    expect(transportVehicleOrError.isSuccess).to.eq(true);
    expect(transportVehicleOrError.getValue().durationMins).to.eq(60);
    expect(transportVehicleOrError.getValue().fare).to.eq(5);
    expect(transportVehicleOrError.getValue().stops)
      .to.be.an('array')
      .that.has.lengthOf(0);
  });

  it('Should be able to be created Trip with stops', () => {
    const transportVehicleOrError = Trip.create({
      fromStationId: new UniqueEntityID(),
      toStationId: new UniqueEntityID(),
      busId: new UniqueEntityID(),
      durationMins: 60,
      fare: 5,
      stops: [new UniqueEntityID(), new UniqueEntityID(), new UniqueEntityID()],
    });

    expect(transportVehicleOrError.isSuccess).to.eq(true);
    expect(transportVehicleOrError.getValue().durationMins).to.eq(60);
    expect(transportVehicleOrError.getValue().fare).to.eq(5);
    expect(transportVehicleOrError.getValue().stops)
      .to.be.an('array')
      .that.has.lengthOf(3);
  });

  it('Should not create with invalid trip', () => {
    const transportVehicleOrError = Trip.create({
      fromStationId: null,
      toStationId: null,
      busId: new UniqueEntityID(),
      durationMins: 60,
      fare: 5,
    });

    expect(transportVehicleOrError.isFailure).to.eq(true);
    expect(transportVehicleOrError.error).to.be.a('string');
  });

  it('Should not create with invalid duration', () => {
    const transportVehicleOrError = Trip.create({
      fromStationId: null,
      toStationId: null,
      busId: new UniqueEntityID(),
      durationMins: 0,
      fare: 5,
    });

    expect(transportVehicleOrError.isFailure).to.eq(true);
    expect(transportVehicleOrError.error).to.be.a('string');
  });

  it('Should not create with invalid fare', () => {
    const transportVehicleOrError = Trip.create({
      fromStationId: null,
      toStationId: null,
      busId: new UniqueEntityID(),
      durationMins: 0,
      fare: -10,
    });

    expect(transportVehicleOrError.isFailure).to.eq(true);
    expect(transportVehicleOrError.error).to.be.a('string');
  });
});
