import { BusinessMembershipRole } from '../../../../core/enums/business-membership-role.enum';

export class BusinessMemberEntity {
  constructor(
    public readonly id: string,
    public readonly businessId: string,
    public readonly userId: string,
    public readonly role: BusinessMembershipRole,
    public readonly isPrimary: boolean,
    public readonly joinedAt: Date,
  ) {}
}
