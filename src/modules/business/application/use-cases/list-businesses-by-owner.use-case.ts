import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { USER_REPOSITORY } from '../../../user/domain/repositories/user.repository';
import type { IUserRepository } from '../../../user/domain/repositories/user.repository';
import type { BusinessEntity } from '../../domain/entities/business.entity';
import { BUSINESS_REPOSITORY } from '../../domain/repositories/business.repository';
import type { IBusinessRepository } from '../../domain/repositories/business.repository';

@Injectable()
export class ListBusinessesByOwnerUseCase {
  constructor(
    @Inject(BUSINESS_REPOSITORY)
    private readonly businessRepository: IBusinessRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(ownerUserId: string): Promise<BusinessEntity[]> {
    const owner = await this.userRepository.findById(ownerUserId);

    if (!owner) {
      throw new NotFoundException('Owner user not found');
    }

    return this.businessRepository.findByOwnerUserId(ownerUserId);
  }
}
