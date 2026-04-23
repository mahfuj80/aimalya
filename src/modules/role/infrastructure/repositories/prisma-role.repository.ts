import { Injectable } from '@nestjs/common';
import { UserRole as PrismaUserRole } from '@prisma/client';
import { UserRole } from '../../../../core/enums/role.enum';
import { PrismaService } from '../../../../database/prisma/prisma.service';
import { RoleEntity } from '../../domain/entities/role.entity';
import { IRoleRepository } from '../../domain/repositories/role.repository';

const toDomainRoles = (roles: PrismaUserRole[]): UserRole[] =>
  roles as unknown as UserRole[];

@Injectable()
export class PrismaRoleRepository implements IRoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getByUserId(userId: string): Promise<RoleEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return null;
    }

    return new RoleEntity(user.id, toDomainRoles(user.roles));
  }

  async updateRoles(userId: string, roles: UserRole[]): Promise<RoleEntity> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        roles: roles,
      },
    });

    return new RoleEntity(user.id, toDomainRoles(user.roles));
  }
}
