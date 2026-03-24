import { IsOptional, IsString } from 'class-validator';
import { VM } from '../../../common/validation-messages';

export class CancelSessionDto {
  @IsOptional()
  @IsString({ message: VM.STRING('motivo') })
  reason?: string;
}
