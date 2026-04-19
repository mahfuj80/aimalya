import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ListUsersUseCase } from '../../application/use-cases/list-users.use-case';
import { GetUserByIdUseCase } from '../../application/use-cases/get-user-by-id.use-case';
import { UserDtoMapper } from '../../application/mappers/user-dto.mapper';
import { UserResponseDto } from '../../application/dto/user.response.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all users' })
  @ApiOkResponse({ type: UserResponseDto, isArray: true })
  async list(): Promise<UserResponseDto[]> {
    const users = await this.listUsersUseCase.execute();
    return users.map(UserDtoMapper.toResponse);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({ name: 'id', example: '3b1f8c22-930f-4b6d-8ac4-d54c5988e6d3' })
  @ApiOkResponse({ type: UserResponseDto })
  async findById(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.getUserByIdUseCase.execute(id);
    return UserDtoMapper.toResponse(user);
  }
}
