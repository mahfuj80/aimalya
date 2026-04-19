import { Module } from '@nestjs/common';
import { USER_REPOSITORY } from './domain/repositories/user.repository';
import { PrismaUserRepository } from './infrastructure/repositories/prisma-user.repository';
import { UserController } from './presentation/controllers/user.controller';
import { GetUserByIdUseCase } from './application/use-cases/get-user-by-id.use-case';
import { ListUsersUseCase } from './application/use-cases/list-users.use-case';

@Module({
	controllers: [UserController],
	providers: [
		GetUserByIdUseCase,
		ListUsersUseCase,
		{
			provide: USER_REPOSITORY,
			useClass: PrismaUserRepository,
		},
	],
})
export class UserModule {}
