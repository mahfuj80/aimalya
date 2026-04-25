import { BadRequestException, ConflictException } from '@nestjs/common';
import { UserRole } from '../../../../core/enums/role.enum';
import { AuthUserEntity } from '../../domain/entities/auth-user.entity';
import type { IAuthUserRepository } from '../../domain/repositories/auth-user.repository';
import type { IBusinessRepository } from '../../../business/domain/repositories/business.repository';
import { PasswordHasherService } from '../../infrastructure/services/password-hasher.service';
import { TokenService } from '../../infrastructure/services/token.service';
import { RegisterUseCase } from './register.use-case';

describe('RegisterUseCase', () => {
  const createAuthRepo = (): jest.Mocked<IAuthUserRepository> => ({
    findByEmail: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    updateRefreshTokenHash: jest.fn(),
    updatePasswordHash: jest.fn(),
    setPasswordResetCode: jest.fn(),
    clearPasswordResetCode: jest.fn(),
  });

  const createBusinessRepo = (): jest.Mocked<IBusinessRepository> => ({
    create: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    findBySlug: jest.fn(),
    findByOwnerUserId: jest.fn(),
    update: jest.fn(),
  });

  it('creates user and initial business on register', async () => {
    const authRepo = createAuthRepo();
    const businessRepo = createBusinessRepo();
    const hasher = new PasswordHasherService();

    authRepo.findByEmail.mockResolvedValue(null);
    authRepo.create.mockResolvedValue(
      new AuthUserEntity(
        'u1',
        'owner@techplex.com',
        hasher.hash('StrongPass123!'),
        [UserRole.USER],
        true,
        null,
        null,
        null,
      ),
    );

    businessRepo.findBySlug.mockResolvedValue(null);
    businessRepo.create.mockResolvedValue({
      id: 'b1',
      name: 'Tech Plex Cafe',
      slug: 'tech-plex-cafe',
      industry: null,
      description: null,
      timezone: 'UTC',
      currency: 'USD',
      isActive: true,
      ownerUserId: 'u1',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const tokenService: Pick<
      TokenService,
      'generateAccessToken' | 'generateRefreshToken'
    > = {
      generateAccessToken: jest.fn().mockResolvedValue('access-token'),
      generateRefreshToken: jest.fn().mockResolvedValue('refresh-token'),
    };

    const useCase = new RegisterUseCase(
      authRepo,
      businessRepo,
      hasher,
      tokenService as TokenService,
    );

    const result = await useCase.execute({
      fullName: 'John Doe',
      businessEmail: 'owner@techplex.com',
      businessName: 'Tech Plex Cafe',
      password: 'StrongPass123!',
      confirmPassword: 'StrongPass123!',
      acceptTerms: true,
    });

    expect(result).toEqual({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });

    expect(authRepo.create.mock.calls).toEqual(
      expect.arrayContaining([
        [
          expect.objectContaining({
            email: 'owner@techplex.com',
          }),
        ],
      ]),
    );

    expect(businessRepo.create.mock.calls).toEqual(
      expect.arrayContaining([
        [
          expect.objectContaining({
            ownerUserId: 'u1',
            name: 'Tech Plex Cafe',
          }),
        ],
      ]),
    );
  });

  it('throws when passwords do not match', async () => {
    const authRepo = createAuthRepo();
    const businessRepo = createBusinessRepo();
    const hasher = new PasswordHasherService();

    const tokenService: Pick<
      TokenService,
      'generateAccessToken' | 'generateRefreshToken'
    > = {
      generateAccessToken: jest.fn(),
      generateRefreshToken: jest.fn(),
    };

    const useCase = new RegisterUseCase(
      authRepo,
      businessRepo,
      hasher,
      tokenService as TokenService,
    );

    await expect(
      useCase.execute({
        fullName: 'John Doe',
        businessEmail: 'owner@techplex.com',
        businessName: 'Tech Plex Cafe',
        password: 'StrongPass123!',
        confirmPassword: 'Mismatch123!',
        acceptTerms: true,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('throws when account already exists', async () => {
    const authRepo = createAuthRepo();
    const businessRepo = createBusinessRepo();
    const hasher = new PasswordHasherService();

    authRepo.findByEmail.mockResolvedValue(
      new AuthUserEntity(
        'u1',
        'owner@techplex.com',
        hasher.hash('StrongPass123!'),
        [UserRole.USER],
        true,
        null,
        null,
        null,
      ),
    );

    const tokenService: Pick<
      TokenService,
      'generateAccessToken' | 'generateRefreshToken'
    > = {
      generateAccessToken: jest.fn(),
      generateRefreshToken: jest.fn(),
    };

    const useCase = new RegisterUseCase(
      authRepo,
      businessRepo,
      hasher,
      tokenService as TokenService,
    );

    await expect(
      useCase.execute({
        fullName: 'John Doe',
        businessEmail: 'owner@techplex.com',
        businessName: 'Tech Plex Cafe',
        password: 'StrongPass123!',
        confirmPassword: 'StrongPass123!',
        acceptTerms: true,
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
