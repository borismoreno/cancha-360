import { IsEmail, IsString, MinLength } from 'class-validator';
import { VM } from '../../../common/validation-messages';

export class LoginDto {
  @IsEmail({}, { message: VM.EMAIL })
  email: string;

  @IsString({ message: VM.STRING('contraseña') })
  @MinLength(1, { message: VM.MIN_LENGTH('contraseña', 1) })
  password: string;
}
