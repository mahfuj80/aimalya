import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { UserRole } from '../../../../core/enums/role.enum';
import { AuthTokensResponseDto } from '../../application/dto/auth-tokens.response.dto';
import { ChangePasswordRequestDto } from '../../application/dto/change-password.request.dto';
import { ForgotPasswordRequestDto } from '../../application/dto/forgot-password-request.dto';
import { LoginRequestDto } from '../../application/dto/login.request.dto';
import { RefreshTokenRequestDto } from '../../application/dto/refresh-token.request.dto';
import { ResetForgottenPasswordRequestDto } from '../../application/dto/reset-forgotten-password.request.dto';
import { ChangePasswordUseCase } from '../../application/use-cases/change-password.use-case';
import { RegisterRequestDto } from '../../application/dto/register.request.dto';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { RequestForgotPasswordUseCase } from '../../application/use-cases/request-forgot-password.use-case';
import { RefreshTokenUseCase } from '../../application/use-cases/refresh-token.use-case';
import { ResetForgottenPasswordUseCase } from '../../application/use-cases/reset-forgotten-password.use-case';
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
    private readonly changePasswordUseCase: ChangePasswordUseCase,
    private readonly requestForgotPasswordUseCase: RequestForgotPasswordUseCase,
    private readonly resetForgottenPasswordUseCase: ResetForgottenPasswordUseCase,
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

  @Post('password/forgot/request')
  requestForgotPassword(
    @Body() dto: ForgotPasswordRequestDto,
  ): Promise<{ success: boolean }> {
    return this.requestForgotPasswordUseCase.execute({ email: dto.email });
  }

  @Post('password/forgot/reset')
  resetForgottenPassword(
    @Body() dto: ResetForgottenPasswordRequestDto,
  ): Promise<{ success: boolean }> {
    return this.resetForgottenPasswordUseCase.execute({
      email: dto.email,
      otpCode: dto.otpCode,
      newPassword: dto.newPassword,
    });
  }

  @Post('password/change')
  @UseGuards(JwtAuthGuard)
  changePassword(
    @Req() request: AuthenticatedRequest,
    @Body() dto: ChangePasswordRequestDto,
  ): Promise<{ success: boolean }> {
    return this.changePasswordUseCase.execute({
      userId: request.user.id,
      currentPassword: dto.currentPassword,
      newPassword: dto.newPassword,
    });
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
