import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AcceptInvitationDto } from '../invitations/dto/accept-invitation.dto';
import { LoginDto } from './dto/login.dto';
import { SelectAcademyDto } from './dto/select-academy.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('select-academy')
  @UseGuards(JwtAuthGuard)
  selectAcademy(
    @CurrentUser() currentUser: { id: number; type: string },
    @Body() dto: SelectAcademyDto,
  ) {
    return this.authService.selectAcademy(currentUser.id, dto);
  }

  @Post('accept-invitation')
  acceptInvitation(@Body() dto: AcceptInvitationDto) {
    return this.authService.acceptInvitation(dto);
  }
}
