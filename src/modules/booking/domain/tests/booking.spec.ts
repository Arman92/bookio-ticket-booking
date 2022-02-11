import 'mocha';
import { expect } from 'chai';

import { Booking } from '../booking';
import { UniqueEntityID } from '@bookio/core/domain';

describe('Booking', () => {
  it('Should be able to be created Booking', () => {
    const bookingOrError = Booking.create({
      tripId: new UniqueEntityID(),
      userId: new UniqueEntityID(),
      seats: 2,
      fare: 5.99,
      totalFare: 10,
      destinationStation: new UniqueEntityID(),
    });

    expect(bookingOrError.isSuccess).to.eq(true);
    expect(bookingOrError.getValue().seats).to.eq(2);
    expect(bookingOrError.getValue().fare).to.eq(5.99);
    expect(bookingOrError.getValue().totalFare).to.eq(10);
  });

  it('Should not create with invalid tripId', () => {
    const bookingOrError = Booking.create({
      tripId: null,
      userId: new UniqueEntityID(),
      seats: 2,
      fare: 5.99,
      totalFare: 10,
      destinationStation: new UniqueEntityID(),
    });

    expect(bookingOrError.isFailure).to.eq(true);
    expect(bookingOrError.error).to.be.a('string');
  });

  it('Should not create with invalid userId', () => {
    const bookingOrError = Booking.create({
      tripId: new UniqueEntityID(),
      userId: null,
      seats: 2,
      fare: 5.99,
      totalFare: 10,
      destinationStation: new UniqueEntityID(),
    });

    expect(bookingOrError.isFailure).to.eq(true);
    expect(bookingOrError.error).to.be.a('string');
  });

  it('Should not create with invalid seats', () => {
    const bookingOrError = Booking.create({
      tripId: new UniqueEntityID(),
      userId: new UniqueEntityID(),
      seats: 0,
      fare: 5.99,
      totalFare: 10,
      destinationStation: new UniqueEntityID(),
    });

    expect(bookingOrError.isFailure).to.eq(true);
    expect(bookingOrError.error).to.be.a('string');
  });
});
