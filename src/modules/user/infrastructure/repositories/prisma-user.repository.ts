import { Injectable } from '@nestjs/common';
import { UserRole as PrismaUserRole } from '@prisma/client';
import { UserRole } from '../../../../core/enums/role.enum';
import { PrismaService } from '../../../../database/prisma/prisma.service';
import { UserEntity } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository';

const toDomainRoles = (roles: PrismaUserRole[]): UserRole[] =>
  roles as unknown as UserRole[];

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      return null;
    }

    return new UserEntity(
      user.id,
      user.email,
      toDomainRoles(user.roles),
      user.isActive,
    );
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return users.map(
      (user) =>
        new UserEntity(
          user.id,
          user.email,
          toDomainRoles(user.roles),
          user.isActive,
        ),
    );
  }

  async updateProfile(id: string, email: string): Promise<UserEntity | null> {
    const existing = await this.prisma.user.findUnique({ where: { id } });

    if (!existing) {
      return null;
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        email,
      },
    });

    return new UserEntity(
      updated.id,
      updated.email,
      toDomainRoles(updated.roles),
      updated.isActive,
    );
  }

  async deactivateById(id: string): Promise<boolean> {
    const existing = await this.prisma.user.findUnique({ where: { id } });

    if (!existing) {
      return false;
    }

    await this.prisma.user.update({
      where: { id },
      data: {
        isActive: false,
        refreshTokenHash: null,
        passwordResetCodeHash: null,
        passwordResetCodeExpiresAt: null,
      },
    });

    return true;
  }
}
