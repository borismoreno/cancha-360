import { Module } from '@nestjs/common';
import { TeamCoachesController } from './team-coaches.controller';
import { TeamCoachesService } from './team-coaches.service';
@Module({
  controllers: [TeamCoachesController],
  providers: [TeamCoachesService],
  exports: [TeamCoachesService],
})
export class TeamCoachesModule {}
