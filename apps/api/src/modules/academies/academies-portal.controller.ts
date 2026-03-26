import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AcademiesService } from './academies.service';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('academies')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AcademiesPortalController {
  constructor(private readonly academiesService: AcademiesService) {}

  @Get('current')
  @Roles('SUPER_ADMIN', 'DIRECTOR', 'COACH', 'PARENT')
  getCurrent(
    @CurrentUser() currentUser: { id: number; role: string; academyId: number },
  ) {
    return this.academiesService.getCurrent(currentUser);
  }

  @Get('members')
  @Roles('DIRECTOR', 'COACH')
  getMembers(
    @CurrentUser() currentUser: { id: number; role: string; academyId: number },
    @Query('role') role?: string,
  ) {
    return this.academiesService.getMembers(currentUser, role);
  }
}
