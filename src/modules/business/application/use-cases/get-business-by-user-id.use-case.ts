import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { BusinessEntity } from '../../domain/entities/business.entity';
import { BUSINESS_REPOSITORY } from '../../domain/repositories/business.repository';
import type { IBusinessRepository } from '../../domain/repositories/business.repository';

@Injectable()
export class GetBusinessByUserIdUseCase {
  constructor(
    @Inject(BUSINESS_REPOSITORY)
    private readonly businessRepository: IBusinessRepository,
  ) {}

  async execute(userId: string): Promise<BusinessEntity> {
    const businesses = await this.businessRepository.findByOwnerUserId(userId);
    const business = businesses[0];

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    return business;
  }
}
