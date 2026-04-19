import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { UpdateUserRolesRequestDto } from '../../application/dto/update-user-roles.request.dto';
import { UserRolesResponseDto } from '../../application/dto/user-roles.response.dto';
import { RoleDtoMapper } from '../../application/mappers/role-dto.mapper';
import { GetUserRolesUseCase } from '../../application/use-cases/get-user-roles.use-case';
import { UpdateUserRolesUseCase } from '../../application/use-cases/update-user-roles.use-case';

@Controller('roles')
export class RoleController {
  constructor(
    private readonly getUserRolesUseCase: GetUserRolesUseCase,
    private readonly updateUserRolesUseCase: UpdateUserRolesUseCase,
  ) {}

  @Get(':userId')
  async getUserRoles(
    @Param('userId') userId: string,
  ): Promise<UserRolesResponseDto> {
    const roleEntity = await this.getUserRolesUseCase.execute(userId);
    return RoleDtoMapper.toResponse(roleEntity);
  }

  @Put(':userId')
  async updateUserRoles(
    @Param('userId') userId: string,
    @Body() dto: UpdateUserRolesRequestDto,
  ): Promise<UserRolesResponseDto> {
    const roleEntity = await this.updateUserRolesUseCase.execute(userId, dto.roles);
    return RoleDtoMapper.toResponse(roleEntity);
  }
}
