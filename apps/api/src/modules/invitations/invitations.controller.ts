import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('academies')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Post('invitations')
  @Roles('DIRECTOR')
  create(
    @Body() dto: CreateInvitationDto,
    @CurrentUser() user: { id: number; role: string; academyId?: number },
  ) {
    return this.invitationsService.createInvitation(
      user.academyId!,
      user.id,
      dto,
      user.role,
    );
  }
}
