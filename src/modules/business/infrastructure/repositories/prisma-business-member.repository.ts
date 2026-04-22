import { BusinessMembershipRole as PrismaBusinessMembershipRole } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { BusinessMembershipRole } from '../../../../core/enums/business-membership-role.enum';
import { PrismaService } from '../../../../database/prisma/prisma.service';
import { BusinessMemberEntity } from '../../domain/entities/business-member.entity';
import { IBusinessMemberRepository } from '../../domain/repositories/business-member.repository';

const toDomainRole = (
  role: PrismaBusinessMembershipRole,
): BusinessMembershipRole => role as unknown as BusinessMembershipRole;

@Injectable()
export class PrismaBusinessMemberRepository implements IBusinessMemberRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toEntity(model: {
    id: string;
    businessId: string;
    userId: string;
    role: PrismaBusinessMembershipRole;
    isPrimary: boolean;
    joinedAt: Date;
  }): BusinessMemberEntity {
    return new BusinessMemberEntity(
      model.id,
      model.businessId,
      model.userId,
      toDomainRole(model.role),
      model.isPrimary,
      model.joinedAt,
    );
  }

  async addMember(input: {
    businessId: string;
    userId: string;
    role: BusinessMembershipRole;
    isPrimary?: boolean;
  }): Promise<BusinessMemberEntity> {
    const created = await this.prisma.businessMember.create({
      data: {
        businessId: input.businessId,
        userId: input.userId,
        role: input.role as PrismaBusinessMembershipRole,
        isPrimary: input.isPrimary ?? false,
      },
    });

    return this.toEntity(created);
  }

  async findMembership(
    businessId: string,
    userId: string,
  ): Promise<BusinessMemberEntity | null> {
    const model = await this.prisma.businessMember.findFirst({
      where: {
        businessId,
        userId,
      },
    });

    return model ? this.toEntity(model) : null;
  }

  async findByBusinessId(businessId: string): Promise<BusinessMemberEntity[]> {
    const models = await this.prisma.businessMember.findMany({
      where: { businessId },
      orderBy: { joinedAt: 'asc' },
    });

    return models.map((model) => this.toEntity(model));
  }
}
