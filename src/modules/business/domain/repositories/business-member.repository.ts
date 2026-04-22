import { BusinessMembershipRole } from '../../../../core/enums/business-membership-role.enum';
import type { BusinessMemberEntity } from '../entities/business-member.entity';

export const BUSINESS_MEMBER_REPOSITORY = Symbol('BUSINESS_MEMBER_REPOSITORY');

export interface IBusinessMemberRepository {
  addMember(input: {
    businessId: string;
    userId: string;
    role: BusinessMembershipRole;
    isPrimary?: boolean;
  }): Promise<BusinessMemberEntity>;
  findMembership(
    businessId: string,
    userId: string,
  ): Promise<BusinessMemberEntity | null>;
  findByBusinessId(businessId: string): Promise<BusinessMemberEntity[]>;
}
