import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { BusinessEntity } from '../../domain/entities/business.entity';
import { BUSINESS_REPOSITORY } from '../../domain/repositories/business.repository';
import type { IBusinessRepository } from '../../domain/repositories/business.repository';

@Injectable()
export class GetBusinessByIdUseCase {
  constructor(
    @Inject(BUSINESS_REPOSITORY)
    private readonly businessRepository: IBusinessRepository,
  ) {}

  async execute(id: string): Promise<BusinessEntity> {
    const business = await this.businessRepository.findById(id);

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    return business;
  }
}
