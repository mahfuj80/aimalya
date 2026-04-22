import type { BusinessMemberEntity } from '../../domain/entities/business-member.entity';
import { BusinessMemberResponseDto } from '../dto/business-member.response.dto';

export class BusinessMemberDtoMapper {
  static toResponse(entity: BusinessMemberEntity): BusinessMemberResponseDto {
    return {
      id: entity.id,
      businessId: entity.businessId,
      userId: entity.userId,
      role: entity.role,
      isPrimary: entity.isPrimary,
      joinedAt: entity.joinedAt,
    };
  }
}
