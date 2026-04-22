import { NotFoundException } from '@nestjs/common';
import { UserRole } from '../../../../core/enums/role.enum';
import { UserEntity } from '../../../user/domain/entities/user.entity';
import { IUserRepository } from '../../../user/domain/repositories/user.repository';
import { BusinessEntity } from '../../domain/entities/business.entity';
import { IBusinessRepository } from '../../domain/repositories/business.repository';
import { CreateBusinessUseCase } from './create-business.use-case';

describe('CreateBusinessUseCase', () => {
  it('creates a business and normalizes slug', async () => {
    const businessRepo: IBusinessRepository = {
      create: jest
        .fn()
        .mockImplementation(
          async (input) =>
            new BusinessEntity(
              'b1',
              input.name,
              input.slug,
              input.industry ?? null,
              input.description ?? null,
              input.timezone ?? 'UTC',
              input.currency ?? 'USD',
              true,
              input.ownerUserId,
              new Date('2026-01-01'),
              new Date('2026-01-01'),
            ),
        ),
      findById: jest.fn(),
      findBySlug: jest.fn().mockResolvedValue(null),
      findByOwnerUserId: jest.fn(),
    };

    const userRepo: IUserRepository = {
      findById: jest
        .fn()
        .mockResolvedValue(
          new UserEntity('u1', 'owner@mail.com', [UserRole.USER], true),
        ),
      findAll: jest.fn(),
      updateProfile: jest.fn(),
    };

    const useCase = new CreateBusinessUseCase(businessRepo, userRepo);

    const result = await useCase.execute({
      ownerUserId: 'u1',
      name: 'Tech Plex Cafe',
    });

    expect(result.slug).toBe('tech-plex-cafe');
  });

  it('throws when owner does not exist', async () => {
    const businessRepo: IBusinessRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findBySlug: jest.fn(),
      findByOwnerUserId: jest.fn(),
    };

    const userRepo: IUserRepository = {
      findById: jest.fn().mockResolvedValue(null),
      findAll: jest.fn(),
      updateProfile: jest.fn(),
    };

    const useCase = new CreateBusinessUseCase(businessRepo, userRepo);

    await expect(
      useCase.execute({ ownerUserId: 'missing', name: 'Tech Plex Cafe' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
