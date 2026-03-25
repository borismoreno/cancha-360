import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { TrainingSessionsService } from './training-sessions.service';

@Controller('teams/:teamId/sessions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TeamSessionsController {
  constructor(private readonly trainingSessionsService: TrainingSessionsService) {}

  @Get()
  @Roles('DIRECTOR', 'COACH')
  list(
    @Param('teamId', ParseIntPipe) teamId: number,
    @CurrentUser() currentUser: { id: number; role: string; academyId: number },
  ) {
    return this.trainingSessionsService.listSessions(teamId, currentUser);
  }
}
