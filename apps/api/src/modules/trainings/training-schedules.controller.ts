import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTrainingScheduleDto } from './dto/create-training-schedule.dto';
import { TrainingSchedulesService } from './training-schedules.service';

@Controller('teams/:teamId/training-schedules')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TrainingSchedulesController {
  constructor(
    private readonly trainingSchedulesService: TrainingSchedulesService,
  ) {}

  @Post()
  @Roles('COACH', 'DIRECTOR')
  create(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Body() dto: CreateTrainingScheduleDto,
    @CurrentUser() currentUser: { id: number; role: string; academyId: number },
  ) {
    return this.trainingSchedulesService.createSchedule(
      teamId,
      dto,
      currentUser,
    );
  }
}
