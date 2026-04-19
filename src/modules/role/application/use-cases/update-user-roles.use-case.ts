import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserRole } from '../../../../core/enums/role.enum';
import { ROLE_REPOSITORY } from '../../domain/repositories/role.repository';
import type { IRoleRepository } from '../../domain/repositories/role.repository';
import type { RoleEntity } from '../../domain/entities/role.entity';

@Injectable()
export class UpdateUserRolesUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(userId: string, roles: UserRole[]): Promise<RoleEntity> {
    const existing = await this.roleRepository.getByUserId(userId);

    if (!existing) {
      throw new NotFoundException('User not found');
    }

    return await this.roleRepository.updateRoles(userId, roles);
  }
}
