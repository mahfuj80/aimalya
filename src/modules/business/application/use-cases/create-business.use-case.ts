import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { USER_REPOSITORY } from '../../../user/domain/repositories/user.repository';
import type { IUserRepository } from '../../../user/domain/repositories/user.repository';
import type { BusinessEntity } from '../../domain/entities/business.entity';
import { BUSINESS_REPOSITORY } from '../../domain/repositories/business.repository';
import type { IBusinessRepository } from '../../domain/repositories/business.repository';

type CreateBusinessInput = {
  ownerUserId: string;
  name: string;
  slug?: string;
  industry?: string;
  description?: string;
  timezone?: string;
  currency?: string;
};

@Injectable()
export class CreateBusinessUseCase {
  constructor(
    @Inject(BUSINESS_REPOSITORY)
    private readonly businessRepository: IBusinessRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
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

  async execute(input: CreateBusinessInput): Promise<BusinessEntity> {
    const owner = await this.userRepository.findById(input.ownerUserId);

    if (!owner) {
      throw new NotFoundException('Owner user not found');
    }

    const baseSlug = this.normalizeSlug(input.slug ?? input.name);
    let finalSlug = baseSlug;
    let sequence = 2;

    while (await this.businessRepository.findBySlug(finalSlug)) {
      finalSlug = `${baseSlug}-${sequence}`;
      sequence += 1;
    }

    return this.businessRepository.create({
      ownerUserId: input.ownerUserId,
      name: input.name,
      slug: finalSlug,
      industry: input.industry,
      description: input.description,
      timezone: input.timezone,
      currency: input.currency,
    });
  }
}
