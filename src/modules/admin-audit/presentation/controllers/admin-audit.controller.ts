import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { UserRole } from '../../../../core/enums/role.enum';
import { JwtAuthGuard } from '../../../auth/infrastructure/services/jwt-auth.guard';
import { AdminAuditLogResponseDto } from '../../application/dto/admin-audit-log.response.dto';
import { CreateAdminAuditLogRequestDto } from '../../application/dto/create-admin-audit-log.request.dto';
import { ListAdminAuditLogsUseCase } from '../../application/use-cases/list-admin-audit-logs.use-case';
import { WriteAdminAuditLogUseCase } from '../../application/use-cases/write-admin-audit-log.use-case';

type AuthenticatedRequest = {
  user: {
    id: string;
  };
  ip?: string;
  headers: {
    'user-agent'?: string;
  };
};

@ApiTags('Admin Audit')
@Controller('admin-audit')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class AdminAuditController {
  constructor(
    private readonly writeAdminAuditLogUseCase: WriteAdminAuditLogUseCase,
    private readonly listAdminAuditLogsUseCase: ListAdminAuditLogsUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create an admin audit log entry' })
  @ApiCreatedResponse({ type: AdminAuditLogResponseDto })
  async create(
    @Req() request: AuthenticatedRequest,
    @Body() dto: CreateAdminAuditLogRequestDto,
  ): Promise<AdminAuditLogResponseDto> {
    return this.writeAdminAuditLogUseCase.execute({
      actorUserId: request.user.id,
      businessId: dto.businessId,
      action: dto.action,
      targetType: dto.targetType,
      targetId: dto.targetId,
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'],
      metadata: dto.metadata,
    });
  }

  @Get('actor/:actorUserId')
  @ApiOperation({ summary: 'List admin audit logs by actor user id' })
  @ApiParam({
    name: 'actorUserId',
    example: '3b1f8c22-930f-4b6d-8ac4-d54c5988e6d3',
  })
  @ApiOkResponse({ type: AdminAuditLogResponseDto, isArray: true })
  listByActor(
    @Param('actorUserId') actorUserId: string,
  ): Promise<AdminAuditLogResponseDto[]> {
    return this.listAdminAuditLogsUseCase.executeByActor(actorUserId);
  }

  @Get('business/:businessId')
  @ApiOperation({ summary: 'List admin audit logs by business id' })
  @ApiParam({
    name: 'businessId',
    example: 'd32f30f8-0051-4c6f-9f85-d94acaa3fd50',
  })
  @ApiOkResponse({ type: AdminAuditLogResponseDto, isArray: true })
  listByBusiness(
    @Param('businessId') businessId: string,
  ): Promise<AdminAuditLogResponseDto[]> {
    return this.listAdminAuditLogsUseCase.executeByBusiness(businessId);
  }
}
