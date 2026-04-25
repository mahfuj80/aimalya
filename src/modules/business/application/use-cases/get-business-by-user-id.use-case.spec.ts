import { NotFoundException } from '@nestjs/common';
import { BusinessEntity } from '../../domain/entities/business.entity';
import { IBusinessRepository } from '../../domain/repositories/business.repository';
import { GetBusinessByUserIdUseCase } from './get-business-by-user-id.use-case';

describe('GetBusinessByUserIdUseCase', () => {
  it('returns the first business for a user', async () => {
    const repo: IBusinessRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findBySlug: jest.fn(),
      findByOwnerUserId: jest
        .fn()
        .mockResolvedValue([
          new BusinessEntity(
            'b1',
            'Tech Plex',
            'tech-plex',
            null,
            null,
            'UTC',
            'USD',
            true,
            'u1',
            new Date('2026-01-01'),
            new Date('2026-01-01'),
          ),
        ]),
      update: jest.fn(),
    };

    const useCase = new GetBusinessByUserIdUseCase(repo);
    const result = await useCase.execute('u1');

    expect(result.id).toBe('b1');
  });

  it('throws when user has no business', async () => {
    const repo: IBusinessRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findBySlug: jest.fn(),
      findByOwnerUserId: jest.fn().mockResolvedValue([]),
      update: jest.fn(),
    };

    const useCase = new GetBusinessByUserIdUseCase(repo);

    await expect(useCase.execute('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
