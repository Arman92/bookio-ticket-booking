import { Types } from 'mongoose';

import { Identifier } from './identifer';

export class UniqueEntityID extends Identifier<string | number> {
  constructor(id?: string | number) {
    super(id ? id : new Types.ObjectId().toString());
  }
}
