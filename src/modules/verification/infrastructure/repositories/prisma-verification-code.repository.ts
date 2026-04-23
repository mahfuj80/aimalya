import { Injectable } from '@nestjs/common';
import {
  VerificationCode,
  VerificationPurpose,
  VerificationStatus,
} from '@prisma/client';
import { PrismaService } from '../../../../database/prisma/prisma.service';
import { VerificationCodeEntity } from '../../domain/entities/verification-code.entity';
import { IVerificationCodeRepository } from '../../domain/repositories/verification-code.repository';

@Injectable()
export class PrismaVerificationCodeRepository implements IVerificationCodeRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toEntity(model: VerificationCode): VerificationCodeEntity {
    return new VerificationCodeEntity(
      model.id,
      model.userId,
      model.email,
      model.phoneNumber,
      model.purpose,
      model.channel,
      model.codeHash,
      model.status,
      model.expiresAt,
      model.verifiedAt,
      model.consumedAt,
      model.attempts,
      model.maxAttempts,
      model.createdAt,
      model.updatedAt,
    );
  }

  async create(input: {
    userId?: string;
    email?: string;
    phoneNumber?: string;
    purpose: VerificationPurpose;
    channel: VerificationCode['channel'];
    codeHash: string;
    expiresAt: Date;
    maxAttempts: number;
  }): Promise<VerificationCodeEntity> {
    const created = await this.prisma.verificationCode.create({
      data: {
        userId: input.userId,
        email: input.email,
        phoneNumber: input.phoneNumber,
        purpose: input.purpose,
        channel: input.channel,
        codeHash: input.codeHash,
        expiresAt: input.expiresAt,
        maxAttempts: input.maxAttempts,
      },
    });

    return this.toEntity(created);
  }

  async findLatestPending(input: {
    email?: string;
    phoneNumber?: string;
    purpose: VerificationPurpose;
  }): Promise<VerificationCodeEntity | null> {
    const model = await this.prisma.verificationCode.findFirst({
      where: {
        purpose: input.purpose,
        status: VerificationStatus.PENDING,
        ...(input.email ? { email: input.email } : {}),
        ...(input.phoneNumber ? { phoneNumber: input.phoneNumber } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });

    return model ? this.toEntity(model) : null;
  }

  async updateStatus(id: string, status: VerificationStatus): Promise<void> {
    await this.prisma.verificationCode.update({
      where: { id },
      data: { status },
    });
  }

  async incrementAttempts(id: string): Promise<VerificationCodeEntity> {
    const updated = await this.prisma.verificationCode.update({
      where: { id },
      data: {
        attempts: { increment: 1 },
      },
    });

    return this.toEntity(updated);
  }

  async markVerifiedAndConsumed(id: string): Promise<void> {
    const now = new Date();

    await this.prisma.verificationCode.update({
      where: { id },
      data: {
        status: VerificationStatus.VERIFIED,
        verifiedAt: now,
        consumedAt: now,
      },
    });
  }

  async cancelPendingForTarget(input: {
    email?: string;
    phoneNumber?: string;
    purpose: VerificationPurpose;
  }): Promise<void> {
    await this.prisma.verificationCode.updateMany({
      where: {
        purpose: input.purpose,
        status: VerificationStatus.PENDING,
        ...(input.email ? { email: input.email } : {}),
        ...(input.phoneNumber ? { phoneNumber: input.phoneNumber } : {}),
      },
      data: {
        status: VerificationStatus.CANCELED,
      },
    });
  }
}
