import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { VM } from '../../../common/validation-messages';

export class CreateAcademyDto {
  @IsString({ message: VM.STRING('nombre') })
  @IsNotEmpty({ message: VM.REQUIRED('nombre') })
  name: string;

  @IsString({ message: VM.STRING('país') })
  @IsNotEmpty({ message: VM.REQUIRED('país') })
  country: string;

  @IsString({ message: VM.STRING('ciudad') })
  @IsNotEmpty({ message: VM.REQUIRED('ciudad') })
  city: string;

  @IsString({ message: VM.STRING('nombre del director') })
  @IsNotEmpty({ message: VM.REQUIRED('nombre del director') })
  directorName: string;

  @IsEmail({}, { message: VM.EMAIL })
  @IsNotEmpty({ message: VM.REQUIRED('correo del director') })
  directorEmail: string;
}
