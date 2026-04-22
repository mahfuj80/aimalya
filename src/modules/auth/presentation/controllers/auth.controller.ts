import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
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
import { WriteAdminAuditLogUseCase } from '../../../admin-audit/application/use-cases/write-admin-audit-log.use-case';

type AuthenticatedRequest = {
  user: {
    id: string;
    email: string;
    roles: UserRole[];
  };
  ip?: string;
  headers?: Record<string, string | string[] | undefined>;
};

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
    private readonly requestForgotPasswordUseCase: RequestForgotPasswordUseCase,
    private readonly resetForgottenPasswordUseCase: ResetForgottenPasswordUseCase,
    private readonly writeAdminAuditLogUseCase: WriteAdminAuditLogUseCase,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({ type: AuthTokensResponseDto })
  register(@Body() dto: RegisterRequestDto): Promise<AuthTokensResponseDto> {
    return this.registerUseCase.execute(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user with email and password' })
  @ApiOkResponse({ type: AuthTokensResponseDto })
  login(@Body() dto: LoginRequestDto): Promise<AuthTokensResponseDto> {
    return this.loginUseCase.execute(dto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiOkResponse({ type: AuthTokensResponseDto })
  refresh(@Body() dto: RefreshTokenRequestDto): Promise<AuthTokensResponseDto> {
    return this.refreshTokenUseCase.execute(dto.refreshToken);
  }

  @Post('password/forgot/request')
  @ApiOperation({ summary: 'Request forgot-password OTP over email' })
  @ApiOkResponse({
    schema: {
      example: { success: true },
    },
  })
  requestForgotPassword(
    @Body() dto: ForgotPasswordRequestDto,
  ): Promise<{ success: boolean }> {
    return this.requestForgotPasswordUseCase.execute({ email: dto.email });
  }

  @Post('password/forgot/reset')
  @ApiOperation({ summary: 'Reset forgotten password using 6-digit OTP' })
  @ApiOkResponse({
    schema: {
      example: { success: true },
    },
  })
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
  @ApiOperation({ summary: 'Change password for authenticated user' })
  @ApiBearerAuth()
  @ApiOkResponse({
    schema: {
      example: { success: true },
    },
  })
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
  @ApiOperation({ summary: 'Get authenticated user profile' })
  @ApiBearerAuth()
  @ApiOkResponse({
    schema: {
      example: {
        id: '3b1f8c22-930f-4b6d-8ac4-d54c5988e6d3',
        email: 'user@example.com',
        roles: ['USER'],
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  profile(@Req() request: AuthenticatedRequest): {
    id: string;
    email: string;
    roles: UserRole[];
  } {
    return request.user;
  }

  @Get('admin-only')
  @ApiOperation({ summary: 'Admin-only authorization check endpoint' })
  @ApiBearerAuth()
  @ApiOkResponse({
    schema: {
      example: { allowed: true, scope: 'admin' },
    },
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async adminOnly(
    @Req() request: AuthenticatedRequest,
  ): Promise<{ allowed: boolean; scope: string }> {
    // Write audit log
    const userAgent = request.headers?.['user-agent'];
    await this.writeAdminAuditLogUseCase.execute({
      actorUserId: request.user.id,
      action: 'AUTH_ADMIN_ONLY_CHECK',
      ipAddress: request.ip,
      userAgent: typeof userAgent === 'string' ? userAgent : undefined,
      metadata: { endpoint: 'admin-only' },
    });
    return { allowed: true, scope: 'admin' };
  }

  @Get('admin-or-manager')
  @ApiOperation({ summary: 'Admin or manager authorization check endpoint' })
  @ApiBearerAuth()
  @ApiOkResponse({
    schema: {
      example: { allowed: true, scope: 'admin-or-manager' },
    },
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async elevatedAccess(
    @Req() request: AuthenticatedRequest,
  ): Promise<{ allowed: boolean; scope: string }> {
    const userAgent = request.headers?.['user-agent'];
    await this.writeAdminAuditLogUseCase.execute({
      actorUserId: request.user.id,
      action: 'AUTH_ADMIN_OR_MANAGER_CHECK',
      ipAddress: request.ip,
      userAgent: typeof userAgent === 'string' ? userAgent : undefined,
      metadata: { endpoint: 'admin-or-manager' },
    });
    return { allowed: true, scope: 'admin-or-manager' };
  }

  @Get('support-or-user')
  @ApiOperation({ summary: 'Support or user authorization check endpoint' })
  @ApiBearerAuth()
  @ApiOkResponse({
    schema: {
      example: { allowed: true, scope: 'support-or-user' },
    },
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPPORT, UserRole.USER)
  async standardAccess(
    @Req() request: AuthenticatedRequest,
  ): Promise<{ allowed: boolean; scope: string }> {
    const userAgent = request.headers?.['user-agent'];
    await this.writeAdminAuditLogUseCase.execute({
      actorUserId: request.user.id,
      action: 'AUTH_SUPPORT_OR_USER_CHECK',
      ipAddress: request.ip,
      userAgent: typeof userAgent === 'string' ? userAgent : undefined,
      metadata: { endpoint: 'support-or-user' },
    });
    return { allowed: true, scope: 'support-or-user' };
  }
}
