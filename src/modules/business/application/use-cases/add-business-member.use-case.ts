import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BusinessMembershipRole } from '../../../../core/enums/business-membership-role.enum';
import { USER_REPOSITORY } from '../../../user/domain/repositories/user.repository';
import type { IUserRepository } from '../../../user/domain/repositories/user.repository';
import type { BusinessMemberEntity } from '../../domain/entities/business-member.entity';
import { BUSINESS_MEMBER_REPOSITORY } from '../../domain/repositories/business-member.repository';
import type { IBusinessMemberRepository } from '../../domain/repositories/business-member.repository';
import { BUSINESS_REPOSITORY } from '../../domain/repositories/business.repository';
import type { IBusinessRepository } from '../../domain/repositories/business.repository';

type AddBusinessMemberInput = {
  businessId: string;
  userId: string;
  role: BusinessMembershipRole;
  isPrimary?: boolean;
};

@Injectable()
export class AddBusinessMemberUseCase {
  constructor(
    @Inject(BUSINESS_MEMBER_REPOSITORY)
    private readonly businessMemberRepository: IBusinessMemberRepository,
    @Inject(BUSINESS_REPOSITORY)
    private readonly businessRepository: IBusinessRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(input: AddBusinessMemberInput): Promise<BusinessMemberEntity> {
    const business = await this.businessRepository.findById(input.businessId);

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    const user = await this.userRepository.findById(input.userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingMembership =
      await this.businessMemberRepository.findMembership(
        input.businessId,
        input.userId,
      );

    if (existingMembership) {
      throw new ConflictException('User is already a member of this business');
    }

    return this.businessMemberRepository.addMember({
      businessId: input.businessId,
      userId: input.userId,
      role: input.role,
      isPrimary: input.isPrimary,
    });
  }
}
