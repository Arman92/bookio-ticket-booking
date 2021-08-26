import 'mocha';
import { expect } from 'chai';

import { TransportVehicle, TransportVehicleType } from '../transport-vehicle';

describe('TransportVehicle', () => {
  it('Should be able to be created TransportVehicle', () => {
    const transportVehicleOrError = TransportVehicle.create({
      name: 'Generic bus',
      type: TransportVehicleType.Bus,
      capacity: 36,
      amenities: ['WiFi'],
    });

    expect(transportVehicleOrError.isSuccess).to.eq(true);
    expect(transportVehicleOrError.getValue().capacity).to.eq(36);
    expect(transportVehicleOrError.getValue().name).to.eq('Generic bus');
    expect(transportVehicleOrError.getValue().type).to.eq(
      TransportVehicleType.Bus
    );
    expect(transportVehicleOrError.getValue().amenities)
      .to.be.an('array')
      .that.has.lengthOf(1)
      .that.includes('WiFi');
  });

  it('Should not create with invalid capacity', () => {
    const transportVehicleOrError = TransportVehicle.create({
      name: 'Generic bus',
      type: TransportVehicleType.Bus,
      capacity: 0,
    });

    expect(transportVehicleOrError.isFailure).to.eq(true);
    expect(transportVehicleOrError.error).to.be.a('string');
  });

  it('Should not create with invalid vehicle type', () => {
    const transportVehicleOrError = TransportVehicle.create({
      name: 'Generic bus',
      type: 'INVALID_TYPE',
      capacity: 36,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    expect(transportVehicleOrError.isFailure).to.eq(true);
    expect(transportVehicleOrError.error).to.be.a('string');
  });
});
