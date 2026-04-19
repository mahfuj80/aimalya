import { Module } from '@nestjs/common';
import { GetUserRolesUseCase } from './application/use-cases/get-user-roles.use-case';
import { UpdateUserRolesUseCase } from './application/use-cases/update-user-roles.use-case';
import { ROLE_REPOSITORY } from './domain/repositories/role.repository';
import { PrismaRoleRepository } from './infrastructure/repositories/prisma-role.repository';
import { RoleController } from './presentation/controllers/role.controller';

@Module({
	controllers: [RoleController],
	providers: [
		GetUserRolesUseCase,
		UpdateUserRolesUseCase,
		{
			provide: ROLE_REPOSITORY,
			useClass: PrismaRoleRepository,
		},
	],
})
export class RoleModule {}
