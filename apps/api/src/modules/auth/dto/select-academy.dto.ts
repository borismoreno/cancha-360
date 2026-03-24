import { IsInt } from 'class-validator';
import { VM } from '../../../common/validation-messages';

export class SelectAcademyDto {
  @IsInt({ message: VM.INT('academyId') })
  academyId: number;
}
