import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AttendanceDto } from './dto/attendance.dto';
import { CancelSessionDto } from './dto/cancel-session.dto';
import { TrainingSessionsService } from './training-sessions.service';

@Controller('training-sessions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TrainingSessionsController {
  constructor(
    private readonly trainingSessionsService: TrainingSessionsService,
  ) {}

  @Patch(':sessionId/cancel')
  @Roles('COACH', 'DIRECTOR')
  cancel(
    @Param('sessionId', ParseIntPipe) sessionId: number,
    @Body() dto: CancelSessionDto,
    @CurrentUser() currentUser: { id: number; role: string; academyId: number },
  ) {
    return this.trainingSessionsService.cancelSession(
      sessionId,
      dto,
      currentUser,
    );
  }

  @Post(':sessionId/attendance')
  @Roles('COACH', 'DIRECTOR')
  recordAttendance(
    @Param('sessionId', ParseIntPipe) sessionId: number,
    @Body() dto: AttendanceDto,
    @CurrentUser() currentUser: { id: number; role: string; academyId: number },
  ) {
    return this.trainingSessionsService.recordAttendance(
      sessionId,
      dto,
      currentUser,
    );
  }
}
