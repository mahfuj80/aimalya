import { Module } from '@nestjs/common';
import { USER_REPOSITORY } from '../user/domain/repositories/user.repository';
import { PrismaUserRepository } from '../user/infrastructure/repositories/prisma-user.repository';
import { CreateBusinessUseCase } from './application/use-cases/create-business.use-case';
import { GetAllBusinessesUseCase } from './application/use-cases/get-all-businesses.use-case';
import { GetBusinessByUserIdUseCase } from './application/use-cases/get-business-by-user-id.use-case';
import { BUSINESS_REPOSITORY } from './domain/repositories/business.repository';
import { UpdateBusinessUseCase } from './application/use-cases/update-business.use-case';
import { PrismaBusinessRepository } from './infrastructure/repositories/prisma-business.repository';
import { BusinessController } from './presentation/controllers/business.controller';

@Module({
  controllers: [BusinessController],
  providers: [
    CreateBusinessUseCase,
    GetAllBusinessesUseCase,
    GetBusinessByUserIdUseCase,
    UpdateBusinessUseCase,
    {
      provide: BUSINESS_REPOSITORY,
      useClass: PrismaBusinessRepository,
    },
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
  ],
})
export class BusinessModule {}
