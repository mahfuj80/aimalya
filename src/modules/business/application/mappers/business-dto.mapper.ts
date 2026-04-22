import type { BusinessEntity } from '../../domain/entities/business.entity';
import { BusinessResponseDto } from '../dto/business.response.dto';

export class BusinessDtoMapper {
  static toResponse(entity: BusinessEntity): BusinessResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      slug: entity.slug,
      industry: entity.industry,
      description: entity.description,
      timezone: entity.timezone,
      currency: entity.currency,
      isActive: entity.isActive,
      ownerUserId: entity.ownerUserId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
