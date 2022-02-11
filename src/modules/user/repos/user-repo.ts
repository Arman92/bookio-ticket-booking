import mongoose from 'mongoose';

import { Repo } from '@bookio/core/infra/Repo';
import { UniqueEntityID } from '@bookio/core/domain';
import { User } from '../domain/user';
import { IUserModel } from '@bookio/infra/mongoose/types/user-type';
import { UserAdapter } from '../adapters/user-adapter';

export interface IUserRepo extends Repo<User> {
  findById(id: string): Promise<User>;
  removeById(id: string): Promise<boolean>;
}

export class UserRepo implements IUserRepo {
  private userModel: mongoose.Model<IUserModel>;

  constructor(userModel: mongoose.Model<IUserModel>) {
    this.userModel = userModel;
  }

  public async exists(id: UniqueEntityID | string) {
    return this.userModel.exists({ _id: id });
  }

  public async save(user: User) {
    const updated = await this.userModel.findOneAndUpdate(
      { _id: user.id },
      {
        name: user.name,
        email: user.email,
        username: user.username,
        password: user.password,
      },
      { upsert: true, useFindAndModify: false }
    );

    return UserAdapter.toDomain(updated);
  }

  public async findById(id: string) {
    const db-user = await this.userModel.findById(id);

    return UserAdapter.toDomain(db-user);
  }

  public async removeById(id: string) {
    try {
      const res = await this.userModel.remove({ id });

      return res.deletedCount === 1;
    } catch {
      return false;
    }
  }
}
