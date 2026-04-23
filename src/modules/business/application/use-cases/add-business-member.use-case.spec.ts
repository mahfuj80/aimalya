import { ConflictException, NotFoundException } from '@nestjs/common';
import { BusinessMembershipRole } from '../../../../core/enums/business-membership-role.enum';
import { UserRole } from '../../../../core/enums/role.enum';
import { UserEntity } from '../../../user/domain/entities/user.entity';
import { IUserRepository } from '../../../user/domain/repositories/user.repository';
import { BusinessMemberEntity } from '../../domain/entities/business-member.entity';
import { BusinessEntity } from '../../domain/entities/business.entity';
import { IBusinessMemberRepository } from '../../domain/repositories/business-member.repository';
import { IBusinessRepository } from '../../domain/repositories/business.repository';
import { AddBusinessMemberUseCase } from './add-business-member.use-case';

describe('AddBusinessMemberUseCase', () => {
  it('adds a member when business and user exist', async () => {
    const businessRepo: IBusinessRepository = {
      create: jest.fn(),
      findById: jest
        .fn()
        .mockResolvedValue(
          new BusinessEntity(
            'b1',
            'Tech Plex',
            'tech-plex',
            null,
            null,
            'UTC',
            'USD',
            true,
            'u-owner',
            new Date('2026-01-01'),
            new Date('2026-01-01'),
          ),
        ),
      findBySlug: jest.fn(),
      findByOwnerUserId: jest.fn(),
    };

    const businessMemberRepo: IBusinessMemberRepository = {
      addMember: jest
        .fn()
        .mockResolvedValue(
          new BusinessMemberEntity(
            'bm1',
            'b1',
            'u2',
            BusinessMembershipRole.MANAGER,
            false,
            new Date('2026-01-01'),
          ),
        ),
      findMembership: jest.fn().mockResolvedValue(null),
      findByBusinessId: jest.fn(),
    };

    const userRepo: IUserRepository = {
      findById: jest
        .fn()
        .mockResolvedValue(
          new UserEntity('u2', 'member@mail.com', [UserRole.USER], true),
        ),
      findAll: jest.fn(),
      updateProfile: jest.fn(),
    };

    const useCase = new AddBusinessMemberUseCase(
      businessMemberRepo,
      businessRepo,
      userRepo,
    );

    const result = await useCase.execute({
      businessId: 'b1',
      userId: 'u2',
      role: BusinessMembershipRole.MANAGER,
    });

    expect(result.userId).toBe('u2');
  });

  it('throws when member already exists', async () => {
    const businessRepo: IBusinessRepository = {
      create: jest.fn(),
      findById: jest
        .fn()
        .mockResolvedValue(
          new BusinessEntity(
            'b1',
            'Tech Plex',
            'tech-plex',
            null,
            null,
            'UTC',
            'USD',
            true,
            'u-owner',
            new Date('2026-01-01'),
            new Date('2026-01-01'),
          ),
        ),
      findBySlug: jest.fn(),
      findByOwnerUserId: jest.fn(),
    };

    const businessMemberRepo: IBusinessMemberRepository = {
      addMember: jest.fn(),
      findMembership: jest
        .fn()
        .mockResolvedValue(
          new BusinessMemberEntity(
            'bm1',
            'b1',
            'u2',
            BusinessMembershipRole.MANAGER,
            false,
            new Date('2026-01-01'),
          ),
        ),
      findByBusinessId: jest.fn(),
    };

    const userRepo: IUserRepository = {
      findById: jest
        .fn()
        .mockResolvedValue(
          new UserEntity('u2', 'member@mail.com', [UserRole.USER], true),
        ),
      findAll: jest.fn(),
      updateProfile: jest.fn(),
    };

    const useCase = new AddBusinessMemberUseCase(
      businessMemberRepo,
      businessRepo,
      userRepo,
    );

    await expect(
      useCase.execute({
        businessId: 'b1',
        userId: 'u2',
        role: BusinessMembershipRole.MANAGER,
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('throws when business does not exist', async () => {
    const businessRepo: IBusinessRepository = {
      create: jest.fn(),
      findById: jest.fn().mockResolvedValue(null),
      findBySlug: jest.fn(),
      findByOwnerUserId: jest.fn(),
    };

    const businessMemberRepo: IBusinessMemberRepository = {
      addMember: jest.fn(),
      findMembership: jest.fn(),
      findByBusinessId: jest.fn(),
    };

    const userRepo: IUserRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      updateProfile: jest.fn(),
    };

    const useCase = new AddBusinessMemberUseCase(
      businessMemberRepo,
      businessRepo,
      userRepo,
    );

    await expect(
      useCase.execute({
        businessId: 'missing',
        userId: 'u2',
        role: BusinessMembershipRole.MANAGER,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
