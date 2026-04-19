import type { UserEntity } from '../entities/user.entity';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface IUserRepository {
  findById(id: string): Promise<UserEntity | null>;
  findAll(): Promise<UserEntity[]>;
}
