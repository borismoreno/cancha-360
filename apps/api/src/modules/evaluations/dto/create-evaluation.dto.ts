import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { VM } from '../../../common/validation-messages';

export class CreateEvaluationDto {
  @IsInt({ message: VM.INT('puntaje técnico') })
  @Min(1, { message: VM.MIN('puntaje técnico', 1) })
  @Max(10, { message: VM.MAX('puntaje técnico', 10) })
  technicalScore: number;

  @IsInt({ message: VM.INT('puntaje táctico') })
  @Min(1, { message: VM.MIN('puntaje táctico', 1) })
  @Max(10, { message: VM.MAX('puntaje táctico', 10) })
  tacticalScore: number;

  @IsInt({ message: VM.INT('puntaje físico') })
  @Min(1, { message: VM.MIN('puntaje físico', 1) })
  @Max(10, { message: VM.MAX('puntaje físico', 10) })
  physicalScore: number;

  @IsInt({ message: VM.INT('puntaje de actitud') })
  @Min(1, { message: VM.MIN('puntaje de actitud', 1) })
  @Max(10, { message: VM.MAX('puntaje de actitud', 10) })
  attitudeScore: number;

  @IsOptional()
  @IsString({ message: VM.STRING('notas') })
  notes?: string;
}
