import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AcademiesModule } from './academies/academies.module';
import { MembershipsModule } from './memberships/memberships.module';
import { TeamsModule } from './teams/teams.module';
import { PlayersModule } from './players/players.module';
import { TrainingsModule } from './trainings/trainings.module';
import { EvaluationsModule } from './evaluations/evaluations.module';
import { InvitationsModule } from './invitations/invitations.module';
import { AdminModule } from './admin/admin.module';
import { TeamCoachesModule } from './team-coaches/team-coaches.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    AcademiesModule,
    MembershipsModule,
    TeamsModule,
    TeamCoachesModule,
    PlayersModule,
    TrainingsModule,
    EvaluationsModule,
    InvitationsModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
