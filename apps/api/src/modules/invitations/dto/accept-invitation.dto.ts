import { IsString, MinLength } from 'class-validator';
import { VM } from '../../../common/validation-messages';

export class AcceptInvitationDto {
  @IsString({ message: VM.STRING('token') })
  token: string;

  @IsString({ message: VM.STRING('nombre') })
  name: string;

  @IsString({ message: VM.STRING('contraseña') })
  @MinLength(8, { message: VM.MIN_LENGTH('contraseña', 8) })
  password: string;
}
