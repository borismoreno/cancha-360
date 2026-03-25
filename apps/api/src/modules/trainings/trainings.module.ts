import { Module } from '@nestjs/common';
import { TrainingSchedulesController } from './training-schedules.controller';
import { TrainingSchedulesService } from './training-schedules.service';
import { TrainingSessionsController } from './training-sessions.controller';
import { TrainingSessionsService } from './training-sessions.service';
import { TeamSessionsController } from './team-sessions.controller';

@Module({
  controllers: [TrainingSchedulesController, TrainingSessionsController, TeamSessionsController],
  providers: [TrainingSchedulesService, TrainingSessionsService],
})
export class TrainingsModule {}
