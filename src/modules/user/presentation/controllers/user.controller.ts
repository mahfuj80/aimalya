import { Controller, Get, Param } from '@nestjs/common';
import { ListUsersUseCase } from '../../application/use-cases/list-users.use-case';
import { GetUserByIdUseCase } from '../../application/use-cases/get-user-by-id.use-case';
import { UserDtoMapper } from '../../application/mappers/user-dto.mapper';
import { UserResponseDto } from '../../application/dto/user.response.dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
  ) {}

  @Get()
  async list(): Promise<UserResponseDto[]> {
    const users = await this.listUsersUseCase.execute();
    return users.map(UserDtoMapper.toResponse);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.getUserByIdUseCase.execute(id);
    return UserDtoMapper.toResponse(user);
  }
}
