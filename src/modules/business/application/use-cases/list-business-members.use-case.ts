import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { BusinessMemberEntity } from '../../domain/entities/business-member.entity';
import { BUSINESS_MEMBER_REPOSITORY } from '../../domain/repositories/business-member.repository';
import type { IBusinessMemberRepository } from '../../domain/repositories/business-member.repository';
import { BUSINESS_REPOSITORY } from '../../domain/repositories/business.repository';
import type { IBusinessRepository } from '../../domain/repositories/business.repository';

@Injectable()
export class ListBusinessMembersUseCase {
  constructor(
    @Inject(BUSINESS_MEMBER_REPOSITORY)
    private readonly businessMemberRepository: IBusinessMemberRepository,
    @Inject(BUSINESS_REPOSITORY)
    private readonly businessRepository: IBusinessRepository,
  ) {}

  async execute(businessId: string): Promise<BusinessMemberEntity[]> {
    const business = await this.businessRepository.findById(businessId);

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    return this.businessMemberRepository.findByBusinessId(businessId);
  }
}
