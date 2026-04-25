import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository';
import type { IUserRepository } from '../../domain/repositories/user.repository';

@Injectable()
export class DeleteOwnAccountUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string): Promise<{ success: boolean }> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.deactivateById(userId);

    return { success: true };
  }
}
