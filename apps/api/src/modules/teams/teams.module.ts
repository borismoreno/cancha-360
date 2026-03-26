import { Module } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { TeamsPortalController } from './teams-portal.controller';
import { TeamsService } from './teams.service';

@Module({
  controllers: [TeamsPortalController, TeamsController],
  providers: [TeamsService],
})
export class TeamsModule {}
