import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository';
import type { IUserRepository } from '../../domain/repositories/user.repository';
import type { UserEntity } from '../../domain/entities/user.entity';

@Injectable()
export class UpdateUserProfileUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string, email: string): Promise<UserEntity> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const sameEmail = user.email.toLowerCase() === email.toLowerCase();
    if (sameEmail) {
      return user;
    }

    try {
      const updated = await this.userRepository.updateProfile(userId, email);

      if (!updated) {
        throw new NotFoundException('User not found');
      }

      return updated;
    } catch (error) {
      const message = error instanceof Error ? error.message.toLowerCase() : '';

      if (message.includes('unique') || message.includes('duplicate')) {
        throw new ConflictException('Email is already in use');
      }

      throw error;
    }
  }
}
