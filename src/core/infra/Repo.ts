import { UniqueEntityID } from '../domain';

export interface Repo<T> {
  exists(id: UniqueEntityID): Promise<boolean>;
  save(t: T): Promise<T>;
}
