import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma/prisma.service';
import { BusinessEntity } from '../../domain/entities/business.entity';
import { IBusinessRepository } from '../../domain/repositories/business.repository';

@Injectable()
export class PrismaBusinessRepository implements IBusinessRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toEntity(model: {
    id: string;
    name: string;
    slug: string;
    industry: string | null;
    description: string | null;
    timezone: string;
    currency: string;
    isActive: boolean;
    ownerUserId: string;
    createdAt: Date;
    updatedAt: Date;
  }): BusinessEntity {
    return new BusinessEntity(
      model.id,
      model.name,
      model.slug,
      model.industry,
      model.description,
      model.timezone,
      model.currency,
      model.isActive,
      model.ownerUserId,
      model.createdAt,
      model.updatedAt,
    );
  }

  async create(input: {
    name: string;
    slug: string;
    industry?: string;
    description?: string;
    timezone?: string;
    currency?: string;
    ownerUserId: string;
  }): Promise<BusinessEntity> {
    const created = await this.prisma.business.create({
      data: {
        name: input.name,
        slug: input.slug,
        industry: input.industry,
        description: input.description,
        timezone: input.timezone,
        currency: input.currency,
        ownerUserId: input.ownerUserId,
      },
    });

    return this.toEntity(created);
  }

  async findById(id: string): Promise<BusinessEntity | null> {
    const model = await this.prisma.business.findUnique({ where: { id } });
    return model ? this.toEntity(model) : null;
  }

  async findBySlug(slug: string): Promise<BusinessEntity | null> {
    const model = await this.prisma.business.findUnique({ where: { slug } });
    return model ? this.toEntity(model) : null;
  }

  async findByOwnerUserId(ownerUserId: string): Promise<BusinessEntity[]> {
    const models = await this.prisma.business.findMany({
      where: { ownerUserId },
      orderBy: { createdAt: 'desc' },
    });

    return models.map((model) => this.toEntity(model));
  }
}
