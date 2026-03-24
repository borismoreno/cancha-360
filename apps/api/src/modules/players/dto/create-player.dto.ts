import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsEmail,
} from 'class-validator';
import { VM } from '../../../common/validation-messages';

export class CreatePlayerDto {
  @IsString({ message: VM.STRING('nombre') })
  @IsNotEmpty({ message: VM.REQUIRED('nombre') })
  name: string;

  @IsDateString({}, { message: VM.DATE('fecha de nacimiento') })
  @IsNotEmpty({ message: VM.REQUIRED('fecha de nacimiento') })
  birthdate: string;

  @IsString({ message: VM.STRING('posición') })
  @IsOptional()
  position?: string;

  @IsString({ message: VM.STRING('nombre del padre/madre') })
  @IsOptional()
  parentName?: string;

  @IsEmail({}, { message: VM.EMAIL })
  @IsOptional()
  parentEmail?: string;
}
