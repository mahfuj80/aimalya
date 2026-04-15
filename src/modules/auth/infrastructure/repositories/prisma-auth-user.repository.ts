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
    );
  }

  async create(input: {
    email: string;
    passwordHash: string;
    roles: string[];
  }): Promise<AuthUserEntity> {
    const created = await this.prisma.user.create({
      data: {
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
}
