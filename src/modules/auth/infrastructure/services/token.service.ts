import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '../../../../core/enums/role.enum';

type TokenInput = {
  userId: string;
  email: string;
  roles: UserRole[];
};

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async generateAccessToken(input: TokenInput): Promise<string> {
    const payload = {
      sub: input.userId,
      email: input.email,
      roles: input.roles,
    };
    const secret = process.env.JWT_ACCESS_SECRET as string;
    const expiresIn = process.env.JWT_ACCESS_EXPIRES_IN ?? '15m';

    return await this.jwtService.signAsync(
      payload as any,
      {
        secret,
        expiresIn,
      } as any,
    );
  }

  async generateRefreshToken(input: TokenInput): Promise<string> {
    const payload = {
      sub: input.userId,
      email: input.email,
      roles: input.roles,
    };
    const secret = process.env.JWT_REFRESH_SECRET as string;
    const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN ?? '7d';

    return await this.jwtService.signAsync(
      payload as any,
      {
        secret,
        expiresIn,
      } as any,
    );
  }

  async verifyRefreshToken(token: string): Promise<TokenInput> {
    const secret = process.env.JWT_REFRESH_SECRET as string;
    const payload = await this.jwtService.verifyAsync<any>(token, {
      secret,
    });

    return {
      userId: payload.sub,
      email: payload.email,
      roles: payload.roles,
    };
  }
}
