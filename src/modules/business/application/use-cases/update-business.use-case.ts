import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRole } from '../../../../core/enums/role.enum';
import type { BusinessEntity } from '../../domain/entities/business.entity';
import { BUSINESS_REPOSITORY } from '../../domain/repositories/business.repository';
import type { IBusinessRepository } from '../../domain/repositories/business.repository';

type UpdateBusinessInput = {
  businessId: string;
  actorUserId: string;
  actorRoles: UserRole[];
  name?: string;
  slug?: string;
  industry?: string;
  description?: string;
  timezone?: string;
  currency?: string;
  isActive?: boolean;
};

@Injectable()
export class UpdateBusinessUseCase {
  constructor(
    @Inject(BUSINESS_REPOSITORY)
    private readonly businessRepository: IBusinessRepository,
  ) {}

  private normalizeSlug(value: string): string {
    return value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  async execute(input: UpdateBusinessInput): Promise<BusinessEntity> {
    const current = await this.businessRepository.findById(input.businessId);

    if (!current) {
      throw new NotFoundException('Business not found');
    }

    const isAdmin = input.actorRoles.includes(UserRole.ADMIN);
    const isOwner = current.ownerUserId === input.actorUserId;

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException('You cannot update this business');
    }

    const nextName = input.name ?? current.name;
    const nextSlug = input.slug ? this.normalizeSlug(input.slug) : current.slug;

    if (!nextName.trim()) {
      throw new BadRequestException('Business name is required');
    }

    if (input.slug && !nextSlug) {
      throw new BadRequestException('Business slug is required');
    }

    if (nextSlug !== current.slug) {
      const existing = await this.businessRepository.findBySlug(nextSlug);

      if (existing && existing.id !== current.id) {
        throw new ConflictException('Business slug already exists');
      }
    }

    const updated = await this.businessRepository.update(current.id, {
      name: nextName,
      slug: nextSlug,
      industry: input.industry ?? current.industry,
      description: input.description ?? current.description,
      timezone: input.timezone ?? current.timezone,
      currency: input.currency ?? current.currency,
      isActive: input.isActive ?? current.isActive,
    });

    if (!updated) {
      throw new NotFoundException('Business not found');
    }

    return updated;
  }
}
