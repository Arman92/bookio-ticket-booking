import { IUserModel } from '@shypple/infra/mongoose/types/user-type';
import { User } from '../domain/user';

export class UserAdapter {
  public static toDomain(raw: IUserModel) {
    const userOrError = User.create(
      {
        name: raw.name,
        email: raw.email,
        username: raw.username,
        password: raw.password,
      },
      raw.id || raw._id
    );

    if (userOrError.isFailure) throw new Error(userOrError.error as string);

    return userOrError.getValue();
  }
}
