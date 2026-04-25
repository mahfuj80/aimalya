import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
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
import { BusinessResponseDto } from '../../application/dto/business.response.dto';
import { CreateBusinessRequestDto } from '../../application/dto/create-business.request.dto';
import { UpdateBusinessRequestDto } from '../../application/dto/update-business.request.dto';
import { BusinessDtoMapper } from '../../application/mappers/business-dto.mapper';
import { CreateBusinessUseCase } from '../../application/use-cases/create-business.use-case';
import { GetAllBusinessesUseCase } from '../../application/use-cases/get-all-businesses.use-case';
import { GetBusinessByUserIdUseCase } from '../../application/use-cases/get-business-by-user-id.use-case';
import { UpdateBusinessUseCase } from '../../application/use-cases/update-business.use-case';
import { JwtAuthGuard } from '../../../auth/infrastructure/services/jwt-auth.guard';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { UserRole } from '../../../../core/enums/role.enum';

type AuthenticatedRequest = {
  user: {
    id: string;
    email: string;
    roles: UserRole[];
  };
};

@ApiTags('Businesses')
@Controller('businesses')
export class BusinessController {
  constructor(
    private readonly createBusinessUseCase: CreateBusinessUseCase,
    private readonly getAllBusinessesUseCase: GetAllBusinessesUseCase,
    private readonly getBusinessByUserIdUseCase: GetBusinessByUserIdUseCase,
    private readonly updateBusinessUseCase: UpdateBusinessUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a business for the authenticated user' })
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: BusinessResponseDto })
  @UseGuards(JwtAuthGuard)
  async createBusiness(
    @Req() request: AuthenticatedRequest,
    @Body() dto: CreateBusinessRequestDto,
  ): Promise<BusinessResponseDto> {
    const business = await this.createBusinessUseCase.execute({
      ownerUserId: request.user.id,
      name: dto.name,
      slug: dto.slug,
      industry: dto.industry,
      description: dto.description,
      timezone: dto.timezone,
      currency: dto.currency,
    });

    return BusinessDtoMapper.toResponse(business);
  }

  @Get()
  @ApiOperation({ summary: 'Get all businesses (admin only)' })
  @ApiBearerAuth()
  @ApiOkResponse({ type: BusinessResponseDto, isArray: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getAllBusinesses(): Promise<BusinessResponseDto[]> {
    const businesses = await this.getAllBusinessesUseCase.execute();
    return businesses.map((item) => BusinessDtoMapper.toResponse(item));
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get business details by user id' })
  @ApiParam({ name: 'userId', example: '3b1f8c22-930f-4b6d-8ac4-d54c5988e6d3' })
  @ApiOkResponse({ type: BusinessResponseDto })
  async getBusinessByUserId(
    @Param('userId') userId: string,
  ): Promise<BusinessResponseDto> {
    const business = await this.getBusinessByUserIdUseCase.execute(userId);
    return BusinessDtoMapper.toResponse(business);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update existing business information' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', example: 'd32f30f8-0051-4c6f-9f85-d94acaa3fd50' })
  @ApiOkResponse({ type: BusinessResponseDto })
  @UseGuards(JwtAuthGuard)
  async updateBusiness(
    @Req() request: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateBusinessRequestDto,
  ): Promise<BusinessResponseDto> {
    const business = await this.updateBusinessUseCase.execute({
      businessId: id,
      actorUserId: request.user.id,
      actorRoles: request.user.roles,
      name: dto.name,
      slug: dto.slug,
      industry: dto.industry,
      description: dto.description,
      timezone: dto.timezone,
      currency: dto.currency,
      isActive: dto.isActive,
    });

    return BusinessDtoMapper.toResponse(business);
  }
}
