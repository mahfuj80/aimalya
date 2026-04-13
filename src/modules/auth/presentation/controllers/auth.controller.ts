import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { UserRole } from '../../../../core/enums/role.enum';

@Controller('auth')
@UseGuards(RolesGuard)
export class AuthController {
  @Get('admin-only')
  @Roles(UserRole.ADMIN)
  adminOnly(): { allowed: boolean; scope: string } {
    return { allowed: true, scope: 'admin' };
  }

  @Get('admin-or-manager')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  elevatedAccess(): { allowed: boolean; scope: string } {
    return { allowed: true, scope: 'admin-or-manager' };
  }

  @Get('support-or-user')
  @Roles(UserRole.SUPPORT, UserRole.USER)
  standardAccess(): { allowed: boolean; scope: string } {
    return { allowed: true, scope: 'support-or-user' };
  }
}
