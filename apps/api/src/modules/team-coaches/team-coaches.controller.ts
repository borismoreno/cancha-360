import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TeamCoachesService } from './team-coaches.service';
import { AddTeamCoachDto } from './dto/add-team-coach.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('teams/:teamId/coaches')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TeamCoachesController {
  constructor(private readonly teamCoachesService: TeamCoachesService) {}

  @Post()
  @Roles('DIRECTOR')
  addCoach(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Body() dto: AddTeamCoachDto,
    @CurrentUser() currentUser: { id: number; role: string; academyId: number },
  ) {
    return this.teamCoachesService.addCoach(teamId, dto, currentUser);
  }

  @Get()
  @Roles('DIRECTOR', 'COACH')
  getCoaches(
    @Param('teamId', ParseIntPipe) teamId: number,
    @CurrentUser() currentUser: { id: number; role: string; academyId: number },
  ) {
    return this.teamCoachesService.getCoaches(teamId, currentUser);
  }

  @Delete(':userId')
  @Roles('DIRECTOR')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeCoach(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Param('userId', ParseIntPipe) userId: number,
    @CurrentUser() currentUser: { id: number; role: string; academyId: number },
  ) {
    return this.teamCoachesService.removeCoach(teamId, userId, currentUser);
  }
}
