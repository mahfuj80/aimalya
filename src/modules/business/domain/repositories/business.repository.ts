import type { BusinessEntity } from '../entities/business.entity';

export const BUSINESS_REPOSITORY = Symbol('BUSINESS_REPOSITORY');

export interface IBusinessRepository {
  create(input: {
    name: string;
    slug: string;
    industry?: string;
    description?: string;
    timezone?: string;
    currency?: string;
    ownerUserId: string;
  }): Promise<BusinessEntity>;
  findById(id: string): Promise<BusinessEntity | null>;
  findAll(): Promise<BusinessEntity[]>;
  findBySlug(slug: string): Promise<BusinessEntity | null>;
  findByOwnerUserId(ownerUserId: string): Promise<BusinessEntity[]>;
  update(
    id: string,
    input: {
      name: string;
      slug: string;
      industry: string | null;
      description: string | null;
      timezone: string;
      currency: string;
      isActive: boolean;
    },
  ): Promise<BusinessEntity | null>;
}
