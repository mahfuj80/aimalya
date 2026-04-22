import { Module } from '@nestjs/common';
import { USER_REPOSITORY } from '../user/domain/repositories/user.repository';
import { PrismaUserRepository } from '../user/infrastructure/repositories/prisma-user.repository';
import { AddBusinessMemberUseCase } from './application/use-cases/add-business-member.use-case';
import { CreateBusinessUseCase } from './application/use-cases/create-business.use-case';
import { GetBusinessByIdUseCase } from './application/use-cases/get-business-by-id.use-case';
import { ListBusinessMembersUseCase } from './application/use-cases/list-business-members.use-case';
import { ListBusinessesByOwnerUseCase } from './application/use-cases/list-businesses-by-owner.use-case';
import { BUSINESS_MEMBER_REPOSITORY } from './domain/repositories/business-member.repository';
import { BUSINESS_REPOSITORY } from './domain/repositories/business.repository';
import { PrismaBusinessMemberRepository } from './infrastructure/repositories/prisma-business-member.repository';
import { PrismaBusinessRepository } from './infrastructure/repositories/prisma-business.repository';
import { BusinessController } from './presentation/controllers/business.controller';

@Module({
  controllers: [BusinessController],
  providers: [
    CreateBusinessUseCase,
    GetBusinessByIdUseCase,
    ListBusinessesByOwnerUseCase,
    AddBusinessMemberUseCase,
    ListBusinessMembersUseCase,
    {
      provide: BUSINESS_REPOSITORY,
      useClass: PrismaBusinessRepository,
    },
    {
      provide: BUSINESS_MEMBER_REPOSITORY,
      useClass: PrismaBusinessMemberRepository,
    },
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
  ],
})
export class BusinessModule {}
