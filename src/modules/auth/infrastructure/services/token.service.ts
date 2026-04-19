import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { StringValue } from 'ms';
import { UserRole } from '../../../../core/enums/role.enum';

type TokenInput = {
  userId: string;
  email: string;
  roles: UserRole[];
};

type TokenPayload = {
  sub: string;
  email: string;
  roles: UserRole[];
};

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async generateAccessToken(input: TokenInput): Promise<string> {
    const payload: TokenPayload = {
      sub: input.userId,
      email: input.email,
      roles: input.roles,
    };
    const secret = process.env.JWT_ACCESS_SECRET ?? '';
    const expiresIn = (process.env.JWT_ACCESS_EXPIRES_IN ??
      '15m') as StringValue;
    const options: JwtSignOptions = {
      secret,
      expiresIn,
    };

    return await this.jwtService.signAsync(payload, options);
  }

  async generateRefreshToken(input: TokenInput): Promise<string> {
    const payload: TokenPayload = {
      sub: input.userId,
      email: input.email,
      roles: input.roles,
    };
    const secret = process.env.JWT_REFRESH_SECRET ?? '';
    const expiresIn = (process.env.JWT_REFRESH_EXPIRES_IN ??
      '7d') as StringValue;
    const options: JwtSignOptions = {
      secret,
      expiresIn,
    };

    return await this.jwtService.signAsync(payload, options);
  }

  async verifyRefreshToken(token: string): Promise<TokenInput> {
    const secret = process.env.JWT_REFRESH_SECRET ?? '';
    const payload = await this.jwtService.verifyAsync<TokenPayload>(token, {
      secret,
    });

    return {
      userId: payload.sub,
      email: payload.email,
      roles: payload.roles,
    };
  }
}
