import { Injectable } from '@nestjs/common';
import type { UserRole } from '@prisma/client';
import { UserRole as DomainUserRole } from '../../../../core/enums/role.enum';
import { PrismaService } from '../../../../database/prisma/prisma.service';
import { AuthUserEntity } from '../../domain/entities/auth-user.entity';
import { IAuthUserRepository } from '../../domain/repositories/auth-user.repository';

const toDomainRoles = (roles: UserRole[]): DomainUserRole[] =>
  roles as unknown as DomainUserRole[];

@Injectable()
export class PrismaAuthUserRepository implements IAuthUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<AuthUserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      return null;
    }

    return new AuthUserEntity(
      user.id,
      user.email,
      user.passwordHash,
      toDomainRoles(user.roles),
      user.isActive,
      user.refreshTokenHash,
      user.passwordResetCodeHash,
      user.passwordResetCodeExpiresAt,
    );
  }

  async findById(id: string): Promise<AuthUserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      return null;
    }

    return new AuthUserEntity(
      user.id,
      user.email,
      user.passwordHash,
      toDomainRoles(user.roles),
      user.isActive,
      user.refreshTokenHash,
      user.passwordResetCodeHash,
      user.passwordResetCodeExpiresAt,
    );
  }

  async create(input: {
    fullName?: string;
    email: string;
    passwordHash: string;
    roles: string[];
  }): Promise<AuthUserEntity> {
    const created = await this.prisma.user.create({
      data: {
        fullName: input.fullName,
        email: input.email,
        passwordHash: input.passwordHash,
        roles: input.roles as UserRole[],
      },
    });

    return new AuthUserEntity(
      created.id,
      created.email,
      created.passwordHash,
      toDomainRoles(created.roles),
      created.isActive,
      created.refreshTokenHash,
      created.passwordResetCodeHash,
      created.passwordResetCodeExpiresAt,
    );
  }

  async updateRefreshTokenHash(
    userId: string,
    refreshTokenHash: string | null,
  ): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash },
    });
  }

  async updatePasswordHash(
    userId: string,
    passwordHash: string,
  ): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash,
      },
    });
  }

  async setPasswordResetCode(
    userId: string,
    codeHash: string,
    expiresAt: Date,
  ): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        passwordResetCodeHash: codeHash,
        passwordResetCodeExpiresAt: expiresAt,
      },
    });
  }

  async clearPasswordResetCode(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        passwordResetCodeHash: null,
        passwordResetCodeExpiresAt: null,
      },
    });
  }
}
