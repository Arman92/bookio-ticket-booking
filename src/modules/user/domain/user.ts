import { Entity, UniqueEntityID } from '@shypple/core/domain';
import { Result, Guard } from '@shypple/core/logic';

interface UserProps {
  name: string;
  email: string;
  username: string;
  password: string;
}

export class User extends Entity<UserProps> {
  private constructor(props: UserProps, id?: UniqueEntityID) {
    super(props, id);
  }

  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get username() {
    return this.props.username;
  }

  get password() {
    return this.props.username;
  }

  public static create(props: UserProps, id?: UniqueEntityID): Result<User> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.name, argumentName: 'name' },
      { argument: props.email, argumentName: 'email' },
      { argument: props.username, argumentName: 'username' },
      { argument: props.password, argumentName: 'password' },
    ]);

    if (!guardResult.succeeded) {
      return Result.fail<User>(guardResult.message);
    } else {
      return Result.ok<User>(new User({ ...props }, id));
    }
  }
}
