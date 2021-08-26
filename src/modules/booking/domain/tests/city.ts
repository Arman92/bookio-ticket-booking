import 'mocha';
import { expect } from 'chai';

import { City } from '../city';

describe('City', () => {
  it('Should be able to be created City', () => {
    const cityOrError = City.create({
      name: 'City 1',
    });

    expect(cityOrError.isSuccess).to.eq(true);
    expect(cityOrError.getValue().name).to.eq('City 1');
  });

  it('Should not create with invalid name', () => {
    const cityOrError = City.create({
      name: null,
    });

    expect(cityOrError.isFailure).to.eq(true);
    expect(cityOrError.error).to.be.a('string');
  });
});
