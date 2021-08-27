import 'mocha';
import { expect } from 'chai';
import { addHours } from 'date-fns';

import { UniqueEntityID } from '@shypple/core/domain';
import { Trip } from '../trip';

describe('Trip', () => {
  const now = new Date();
  const then = addHours(now, 5);

  it('Should be able to be created Trip', () => {
    const tripOrError = Trip.create({
      fromStationId: new UniqueEntityID(),
      toStationId: new UniqueEntityID(),
      transportVehicleId: new UniqueEntityID(),
      departureDate: now,
      arrivalDate: addHours(now, 5),
      fare: 5,
      capacity: 50,
    });

    expect(tripOrError.isSuccess).to.eq(true);
    expect(tripOrError.getValue().departureDate.getTime()).to.eq(now.getTime());
    expect(tripOrError.getValue().arrivalDate.getTime()).to.eq(then.getTime());
    expect(tripOrError.getValue().fare).to.eq(5);
    expect(tripOrError.getValue().stops).to.be.an('array').that.has.lengthOf(0);
  });

  it('Should be able to be created Trip with stops', () => {
    const tripOrError = Trip.create({
      fromStationId: new UniqueEntityID(),
      toStationId: new UniqueEntityID(),
      transportVehicleId: new UniqueEntityID(),
      departureDate: now,
      arrivalDate: then,
      fare: 5,
      capacity: 50,
      stops: [new UniqueEntityID(), new UniqueEntityID(), new UniqueEntityID()],
    });

    expect(tripOrError.isSuccess).to.eq(true);
    expect(tripOrError.getValue().departureDate.getTime()).to.eq(now.getTime());
    expect(tripOrError.getValue().arrivalDate.getTime()).to.eq(then.getTime());
    expect(tripOrError.getValue().fare).to.eq(5);
    expect(tripOrError.getValue().stops).to.be.an('array').that.has.lengthOf(3);
  });

  it('Should not create with invalid trip', () => {
    const tripOrError = Trip.create({
      fromStationId: null,
      toStationId: null,
      transportVehicleId: new UniqueEntityID(),
      departureDate: now,
      arrivalDate: then,
      fare: 5,
      capacity: 50,
    });

    expect(tripOrError.isFailure).to.eq(true);
    expect(tripOrError.error).to.be.a('string');
  });

  it('Should not create with invalid departure/arrival', () => {
    const tripOrError = Trip.create({
      fromStationId: null,
      toStationId: null,
      transportVehicleId: new UniqueEntityID(),
      departureDate: then,
      arrivalDate: now,
      fare: 5,
      capacity: 50,
    });

    expect(tripOrError.isFailure).to.eq(true);
    expect(tripOrError.error).to.be.a('string');
  });

  it('Should not create with invalid fare', () => {
    const tripOrError = Trip.create({
      fromStationId: null,
      toStationId: null,
      transportVehicleId: new UniqueEntityID(),
      departureDate: now,
      arrivalDate: then,
      fare: -10,
      capacity: 50,
    });

    expect(tripOrError.isFailure).to.eq(true);
    expect(tripOrError.error).to.be.a('string');
  });

  it('Should not create with invalid capacity', () => {
    const tripOrError = Trip.create({
      fromStationId: null,
      toStationId: null,
      transportVehicleId: new UniqueEntityID(),
      departureDate: now,
      arrivalDate: then,
      fare: -10,
      capacity: 0,
    });

    expect(tripOrError.isFailure).to.eq(true);
    expect(tripOrError.error).to.be.a('string');
  });
});
