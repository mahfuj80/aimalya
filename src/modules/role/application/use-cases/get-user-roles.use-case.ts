import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ROLE_REPOSITORY } from '../../domain/repositories/role.repository';
import type { IRoleRepository } from '../../domain/repositories/role.repository';
import type { RoleEntity } from '../../domain/entities/role.entity';

@Injectable()
export class GetUserRolesUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(userId: string): Promise<RoleEntity> {
    const roleEntity = await this.roleRepository.getByUserId(userId);

    if (!roleEntity) {
      throw new NotFoundException('User not found');
    }

    return roleEntity;
  }
}
