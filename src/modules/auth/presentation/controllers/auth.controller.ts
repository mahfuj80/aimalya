import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { UserRole } from '../../../../core/enums/role.enum';
import { AuthTokensResponseDto } from '../../application/dto/auth-tokens.response.dto';
import { LoginRequestDto } from '../../application/dto/login.request.dto';
import { RefreshTokenRequestDto } from '../../application/dto/refresh-token.request.dto';
import { RegisterRequestDto } from '../../application/dto/register.request.dto';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { RefreshTokenUseCase } from '../../application/use-cases/refresh-token.use-case';
import { RegisterUseCase } from '../../application/use-cases/register.use-case';
import { JwtAuthGuard } from '../../infrastructure/services/jwt-auth.guard';

type AuthenticatedRequest = {
  user: {
    id: string;
    email: string;
    roles: UserRole[];
  };
};

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
  ) {}

  @Post('register')
  register(@Body() dto: RegisterRequestDto): Promise<AuthTokensResponseDto> {
    return this.registerUseCase.execute(dto);
  }

  @Post('login')
  login(@Body() dto: LoginRequestDto): Promise<AuthTokensResponseDto> {
    return this.loginUseCase.execute(dto);
  }

  @Post('refresh')
  refresh(@Body() dto: RefreshTokenRequestDto): Promise<AuthTokensResponseDto> {
    return this.refreshTokenUseCase.execute(dto.refreshToken);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  profile(@Req() request: AuthenticatedRequest): {
    id: string;
    email: string;
    roles: UserRole[];
  } {
    return request.user;
  }

  @Get('admin-only')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  adminOnly(): { allowed: boolean; scope: string } {
    return { allowed: true, scope: 'admin' };
  }

  @Get('admin-or-manager')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  elevatedAccess(): { allowed: boolean; scope: string } {
    return { allowed: true, scope: 'admin-or-manager' };
  }

  @Get('support-or-user')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPPORT, UserRole.USER)
  standardAccess(): { allowed: boolean; scope: string } {
    return { allowed: true, scope: 'support-or-user' };
  }
}
