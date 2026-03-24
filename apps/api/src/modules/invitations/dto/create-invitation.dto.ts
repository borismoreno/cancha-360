import { IsEmail, IsEnum } from 'class-validator';
import { Role } from '@prisma/client';
import { VM } from '../../../common/validation-messages';

export class CreateInvitationDto {
  @IsEmail({}, { message: VM.EMAIL })
  email: string;

  @IsEnum(Role, { message: VM.ENUM('rol') })
  role: Role;
}
