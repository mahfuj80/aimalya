import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AddBusinessMemberRequestDto } from '../../application/dto/add-business-member.request.dto';
import { BusinessMemberResponseDto } from '../../application/dto/business-member.response.dto';
import { BusinessResponseDto } from '../../application/dto/business.response.dto';
import { CreateBusinessRequestDto } from '../../application/dto/create-business.request.dto';
import { BusinessMemberDtoMapper } from '../../application/mappers/business-member-dto.mapper';
import { BusinessDtoMapper } from '../../application/mappers/business-dto.mapper';
import { AddBusinessMemberUseCase } from '../../application/use-cases/add-business-member.use-case';
import { CreateBusinessUseCase } from '../../application/use-cases/create-business.use-case';
import { GetBusinessByIdUseCase } from '../../application/use-cases/get-business-by-id.use-case';
import { ListBusinessMembersUseCase } from '../../application/use-cases/list-business-members.use-case';
import { ListBusinessesByOwnerUseCase } from '../../application/use-cases/list-businesses-by-owner.use-case';

@ApiTags('Businesses')
@Controller('businesses')
export class BusinessController {
  constructor(
    private readonly createBusinessUseCase: CreateBusinessUseCase,
    private readonly getBusinessByIdUseCase: GetBusinessByIdUseCase,
    private readonly listBusinessesByOwnerUseCase: ListBusinessesByOwnerUseCase,
    private readonly addBusinessMemberUseCase: AddBusinessMemberUseCase,
    private readonly listBusinessMembersUseCase: ListBusinessMembersUseCase,
  ) {}

  @Post('owner/:ownerUserId')
  @ApiOperation({ summary: 'Create a business for an owner user' })
  @ApiParam({ name: 'ownerUserId', example: '3b1f8c22-930f-4b6d-8ac4-d54c5988e6d3' })
  @ApiCreatedResponse({ type: BusinessResponseDto })
  async createBusiness(
    @Param('ownerUserId') ownerUserId: string,
    @Body() dto: CreateBusinessRequestDto,
  ): Promise<BusinessResponseDto> {
    const business = await this.createBusinessUseCase.execute({
      ownerUserId,
      name: dto.name,
      slug: dto.slug,
      industry: dto.industry,
      description: dto.description,
      timezone: dto.timezone,
      currency: dto.currency,
    });

    return BusinessDtoMapper.toResponse(business);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get business details by business id' })
  @ApiParam({ name: 'id', example: 'd32f30f8-0051-4c6f-9f85-d94acaa3fd50' })
  @ApiOkResponse({ type: BusinessResponseDto })
  async getBusinessById(@Param('id') id: string): Promise<BusinessResponseDto> {
    const business = await this.getBusinessByIdUseCase.execute(id);
    return BusinessDtoMapper.toResponse(business);
  }

  @Get('owner/:ownerUserId')
  @ApiOperation({ summary: 'List businesses by owner user id' })
  @ApiParam({ name: 'ownerUserId', example: '3b1f8c22-930f-4b6d-8ac4-d54c5988e6d3' })
  @ApiOkResponse({ type: BusinessResponseDto, isArray: true })
  async listBusinessesByOwner(
    @Param('ownerUserId') ownerUserId: string,
  ): Promise<BusinessResponseDto[]> {
    const businesses =
      await this.listBusinessesByOwnerUseCase.execute(ownerUserId);
    return businesses.map((item) => BusinessDtoMapper.toResponse(item));
  }

  @Post(':businessId/members')
  @ApiOperation({ summary: 'Add a member to a business' })
  @ApiParam({ name: 'businessId', example: 'd32f30f8-0051-4c6f-9f85-d94acaa3fd50' })
  @ApiCreatedResponse({ type: BusinessMemberResponseDto })
  async addBusinessMember(
    @Param('businessId') businessId: string,
    @Body() dto: AddBusinessMemberRequestDto,
  ): Promise<BusinessMemberResponseDto> {
    const member = await this.addBusinessMemberUseCase.execute({
      businessId,
      userId: dto.userId,
      role: dto.role,
      isPrimary: dto.isPrimary,
    });

    return BusinessMemberDtoMapper.toResponse(member);
  }

  @Get(':businessId/members')
  @ApiOperation({ summary: 'List members assigned to a business' })
  @ApiParam({ name: 'businessId', example: 'd32f30f8-0051-4c6f-9f85-d94acaa3fd50' })
  @ApiOkResponse({ type: BusinessMemberResponseDto, isArray: true })
  async listBusinessMembers(
    @Param('businessId') businessId: string,
  ): Promise<BusinessMemberResponseDto[]> {
    const members = await this.listBusinessMembersUseCase.execute(businessId);
    return members.map((member) => BusinessMemberDtoMapper.toResponse(member));
  }
}
