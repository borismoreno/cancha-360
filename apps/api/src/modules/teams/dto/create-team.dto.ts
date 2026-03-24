import { IsString, IsNotEmpty } from 'class-validator';
import { VM } from '../../../common/validation-messages';

export class CreateTeamDto {
  @IsString({ message: VM.STRING('nombre') })
  @IsNotEmpty({ message: VM.REQUIRED('nombre') })
  name: string;

  @IsString({ message: VM.STRING('categoría') })
  @IsNotEmpty({ message: VM.REQUIRED('categoría') })
  category: string;
}
