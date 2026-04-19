import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateUserRolesRequestDto } from '../../application/dto/update-user-roles.request.dto';
import { UserRolesResponseDto } from '../../application/dto/user-roles.response.dto';
import { RoleDtoMapper } from '../../application/mappers/role-dto.mapper';
import { GetUserRolesUseCase } from '../../application/use-cases/get-user-roles.use-case';
import { UpdateUserRolesUseCase } from '../../application/use-cases/update-user-roles.use-case';

@ApiTags('Roles')
@Controller('roles')
export class RoleController {
  constructor(
    private readonly getUserRolesUseCase: GetUserRolesUseCase,
    private readonly updateUserRolesUseCase: UpdateUserRolesUseCase,
  ) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Get roles assigned to a user' })
  @ApiParam({
    name: 'userId',
    example: '3b1f8c22-930f-4b6d-8ac4-d54c5988e6d3',
  })
  @ApiOkResponse({ type: UserRolesResponseDto })
  async getUserRoles(
    @Param('userId') userId: string,
  ): Promise<UserRolesResponseDto> {
    const roleEntity = await this.getUserRolesUseCase.execute(userId);
    return RoleDtoMapper.toResponse(roleEntity);
  }

  @Put(':userId')
  @ApiOperation({ summary: 'Replace roles assigned to a user' })
  @ApiParam({
    name: 'userId',
    example: '3b1f8c22-930f-4b6d-8ac4-d54c5988e6d3',
  })
  @ApiOkResponse({ type: UserRolesResponseDto })
  async updateUserRoles(
    @Param('userId') userId: string,
    @Body() dto: UpdateUserRolesRequestDto,
  ): Promise<UserRolesResponseDto> {
    const roleEntity = await this.updateUserRolesUseCase.execute(
      userId,
      dto.roles,
    );
    return RoleDtoMapper.toResponse(roleEntity);
  }
}
