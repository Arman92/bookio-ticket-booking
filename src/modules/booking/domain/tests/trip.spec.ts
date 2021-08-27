import 'mocha';
import { expect } from 'chai';

import { UniqueEntityID } from '@shypple/core/domain';
import { Trip } from '../trip';

describe('Trip', () => {
  it('Should be able to be created Trip', () => {
    const tripOrError = Trip.create({
      fromStationId: new UniqueEntityID(),
      toStationId: new UniqueEntityID(),
      transportVehicleId: new UniqueEntityID(),
      durationMins: 60,
      fare: 5,
    });

    expect(tripOrError.isSuccess).to.eq(true);
    expect(tripOrError.getValue().durationMins).to.eq(60);
    expect(tripOrError.getValue().fare).to.eq(5);
    expect(tripOrError.getValue().stops).to.be.an('array').that.has.lengthOf(0);
  });

  it('Should be able to be created Trip with stops', () => {
    const tripOrError = Trip.create({
      fromStationId: new UniqueEntityID(),
      toStationId: new UniqueEntityID(),
      transportVehicleId: new UniqueEntityID(),
      durationMins: 60,
      fare: 5,
      stops: [new UniqueEntityID(), new UniqueEntityID(), new UniqueEntityID()],
    });

    expect(tripOrError.isSuccess).to.eq(true);
    expect(tripOrError.getValue().durationMins).to.eq(60);
    expect(tripOrError.getValue().fare).to.eq(5);
    expect(tripOrError.getValue().stops).to.be.an('array').that.has.lengthOf(3);
  });

  it('Should not create with invalid trip', () => {
    const tripOrError = Trip.create({
      fromStationId: null,
      toStationId: null,
      transportVehicleId: new UniqueEntityID(),
      durationMins: 60,
      fare: 5,
    });

    expect(tripOrError.isFailure).to.eq(true);
    expect(tripOrError.error).to.be.a('string');
  });

  it('Should not create with invalid duration', () => {
    const tripOrError = Trip.create({
      fromStationId: null,
      toStationId: null,
      transportVehicleId: new UniqueEntityID(),
      durationMins: 0,
      fare: 5,
    });

    expect(tripOrError.isFailure).to.eq(true);
    expect(tripOrError.error).to.be.a('string');
  });

  it('Should not create with invalid fare', () => {
    const tripOrError = Trip.create({
      fromStationId: null,
      toStationId: null,
      transportVehicleId: new UniqueEntityID(),
      durationMins: 0,
      fare: -10,
    });

    expect(tripOrError.isFailure).to.eq(true);
    expect(tripOrError.error).to.be.a('string');
  });
});
