import { BusinessEntity } from '../../domain/entities/business.entity';
import { IBusinessRepository } from '../../domain/repositories/business.repository';
import { GetAllBusinessesUseCase } from './get-all-businesses.use-case';

describe('GetAllBusinessesUseCase', () => {
  it('returns all businesses', async () => {
    const repo: IBusinessRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest
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
      findBySlug: jest.fn(),
      findByOwnerUserId: jest.fn(),
      update: jest.fn(),
    };

    const useCase = new GetAllBusinessesUseCase(repo);
    const result = await useCase.execute();

    expect(result).toHaveLength(1);
  });
});
