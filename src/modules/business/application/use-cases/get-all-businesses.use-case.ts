import { Inject, Injectable } from '@nestjs/common';
import type { BusinessEntity } from '../../domain/entities/business.entity';
import { BUSINESS_REPOSITORY } from '../../domain/repositories/business.repository';
import type { IBusinessRepository } from '../../domain/repositories/business.repository';

@Injectable()
export class GetAllBusinessesUseCase {
  constructor(
    @Inject(BUSINESS_REPOSITORY)
    private readonly businessRepository: IBusinessRepository,
  ) {}

  async execute(): Promise<BusinessEntity[]> {
    return this.businessRepository.findAll();
  }
}
