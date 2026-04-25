import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { UserRole } from '../../../../core/enums/role.enum';
import { BusinessEntity } from '../../domain/entities/business.entity';
import { IBusinessRepository } from '../../domain/repositories/business.repository';
import { UpdateBusinessUseCase } from './update-business.use-case';

describe('UpdateBusinessUseCase', () => {
  it('updates a business for its owner', async () => {
    const update = jest
      .fn()
      .mockResolvedValue(
        new BusinessEntity(
          'b1',
          'Updated Name',
          'updated-name',
          'Restaurant',
          'Description',
          'UTC',
          'USD',
          true,
          'u1',
          new Date('2026-01-01'),
          new Date('2026-01-02'),
        ),
      );

    const repo: IBusinessRepository = {
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
            'u1',
            new Date('2026-01-01'),
            new Date('2026-01-01'),
          ),
        ),
      findAll: jest.fn(),
      findBySlug: jest.fn().mockResolvedValue(null),
      findByOwnerUserId: jest.fn(),
      update,
    };

    const useCase = new UpdateBusinessUseCase(repo);
    const result = await useCase.execute({
      businessId: 'b1',
      actorUserId: 'u1',
      actorRoles: [UserRole.USER],
      name: 'Updated Name',
      slug: 'updated-name',
      industry: 'Restaurant',
      description: 'Description',
    });

    expect(result.slug).toBe('updated-name');
    expect(update).toHaveBeenCalledWith(
      'b1',
      expect.objectContaining({
        name: 'Updated Name',
        slug: 'updated-name',
      }),
    );
  });

  it('throws when actor is neither owner nor admin', async () => {
    const repo: IBusinessRepository = {
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
            'u1',
            new Date('2026-01-01'),
            new Date('2026-01-01'),
          ),
        ),
      findAll: jest.fn(),
      findBySlug: jest.fn(),
      findByOwnerUserId: jest.fn(),
      update: jest.fn(),
    };

    const useCase = new UpdateBusinessUseCase(repo);

    await expect(
      useCase.execute({
        businessId: 'b1',
        actorUserId: 'u2',
        actorRoles: [UserRole.USER],
        name: 'New Name',
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('throws when slug already exists', async () => {
    const repo: IBusinessRepository = {
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
            'u1',
            new Date('2026-01-01'),
            new Date('2026-01-01'),
          ),
        ),
      findAll: jest.fn(),
      findBySlug: jest
        .fn()
        .mockResolvedValue(
          new BusinessEntity(
            'b2',
            'Other',
            'updated-name',
            null,
            null,
            'UTC',
            'USD',
            true,
            'u2',
            new Date('2026-01-01'),
            new Date('2026-01-01'),
          ),
        ),
      findByOwnerUserId: jest.fn(),
      update: jest.fn(),
    };

    const useCase = new UpdateBusinessUseCase(repo);

    await expect(
      useCase.execute({
        businessId: 'b1',
        actorUserId: 'u1',
        actorRoles: [UserRole.USER],
        slug: 'updated-name',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('throws when business does not exist', async () => {
    const repo: IBusinessRepository = {
      create: jest.fn(),
      findById: jest.fn().mockResolvedValue(null),
      findAll: jest.fn(),
      findBySlug: jest.fn(),
      findByOwnerUserId: jest.fn(),
      update: jest.fn(),
    };

    const useCase = new UpdateBusinessUseCase(repo);

    await expect(
      useCase.execute({
        businessId: 'missing',
        actorUserId: 'u1',
        actorRoles: [UserRole.ADMIN],
        name: 'New Name',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
