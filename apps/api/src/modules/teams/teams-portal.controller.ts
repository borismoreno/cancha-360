import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('teams')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TeamsPortalController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  @Roles('SUPER_ADMIN', 'DIRECTOR', 'COACH')
  listAll(
    @CurrentUser() currentUser: { id: number; role: string; academyId: number },
  ) {
    return this.teamsService.listTeamsForUser(currentUser);
  }

  @Get(':teamId')
  @Roles('SUPER_ADMIN', 'DIRECTOR', 'COACH', 'PARENT')
  getOne(
    @Param('teamId', ParseIntPipe) teamId: number,
    @CurrentUser() currentUser: { id: number; role: string; academyId: number },
  ) {
    return this.teamsService.getTeam(teamId, currentUser);
  }
}
