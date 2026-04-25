import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ListUsersUseCase } from '../../application/use-cases/list-users.use-case';
import { GetUserByIdUseCase } from '../../application/use-cases/get-user-by-id.use-case';
import { UserDtoMapper } from '../../application/mappers/user-dto.mapper';
import { UserResponseDto } from '../../application/dto/user.response.dto';
import { JwtAuthGuard } from '../../../auth/infrastructure/services/jwt-auth.guard';
import { UpdateProfileRequestDto } from '../../application/dto/update-profile.request.dto';
import { UpdateUserProfileUseCase } from '../../application/use-cases/update-user-profile.use-case';
import { UserRole } from '../../../../core/enums/role.enum';
import { DeleteOwnAccountUseCase } from '../../application/use-cases/delete-own-account.use-case';

type AuthenticatedRequest = {
  user: {
    id: string;
    email: string;
    roles: UserRole[];
  };
};

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly updateUserProfileUseCase: UpdateUserProfileUseCase,
    private readonly deleteOwnAccountUseCase: DeleteOwnAccountUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all users' })
  @ApiOkResponse({ type: UserResponseDto, isArray: true })
  async list(): Promise<UserResponseDto[]> {
    const users = await this.listUsersUseCase.execute();
    return users.map((user) => UserDtoMapper.toResponse(user));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({ name: 'id', example: '3b1f8c22-930f-4b6d-8ac4-d54c5988e6d3' })
  @ApiOkResponse({ type: UserResponseDto })
  async findById(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.getUserByIdUseCase.execute(id);
    return UserDtoMapper.toResponse(user);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update authenticated user profile' })
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserResponseDto })
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Req() request: AuthenticatedRequest,
    @Body() dto: UpdateProfileRequestDto,
  ): Promise<UserResponseDto> {
    const user = await this.updateUserProfileUseCase.execute(
      request.user.id,
      dto.email,
    );

    return UserDtoMapper.toResponse(user);
  }

  @Delete('me')
  @ApiOperation({ summary: 'Delete authenticated user account' })
  @ApiBearerAuth()
  @ApiOkResponse({
    schema: {
      example: { success: true },
    },
  })
  @UseGuards(JwtAuthGuard)
  async deleteOwnAccount(
    @Req() request: AuthenticatedRequest,
  ): Promise<{ success: boolean }> {
    return this.deleteOwnAccountUseCase.execute(request.user.id);
  }
}
