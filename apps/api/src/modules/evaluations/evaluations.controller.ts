import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { EvaluationsService } from './evaluations.service';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('players/:playerId')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EvaluationsController {
  constructor(private readonly evaluationsService: EvaluationsService) {}

  @Post('evaluations')
  @Roles('COACH', 'DIRECTOR')
  createEvaluation(
    @Param('playerId', ParseIntPipe) playerId: number,
    @Body() dto: CreateEvaluationDto,
    @CurrentUser() currentUser: { id: number; role: string; academyId: number },
  ) {
    return this.evaluationsService.createEvaluation(playerId, dto, currentUser);
  }

  @Get('progress')
  @Roles('COACH', 'DIRECTOR', 'PARENT')
  getProgress(
    @Param('playerId', ParseIntPipe) playerId: number,
    @CurrentUser() currentUser: { id: number; role: string; academyId: number },
  ) {
    return this.evaluationsService.getPlayerProgress(playerId, currentUser);
  }
}
