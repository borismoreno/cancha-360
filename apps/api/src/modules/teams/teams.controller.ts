import {
  Controller,
  Post,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('academies/:academyId/teams')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @Roles('DIRECTOR', 'COACH')
  create(
    @Param('academyId', ParseIntPipe) academyId: number,
    @Body() dto: CreateTeamDto,
    @CurrentUser() currentUser: { id: number; role: string; academyId: number },
  ) {
    return this.teamsService.createTeam(academyId, dto, currentUser);
  }
}
