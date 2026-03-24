import {
  Controller,
  Post,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('teams/:teamId/players')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  @Roles('DIRECTOR', 'COACH')
  create(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Body() dto: CreatePlayerDto,
    @CurrentUser() currentUser: { id: number; role: string; academyId: number },
  ) {
    return this.playersService.createPlayer(teamId, dto, currentUser);
  }
}
