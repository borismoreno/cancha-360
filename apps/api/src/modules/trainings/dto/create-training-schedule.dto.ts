import {
  IsArray,
  IsDateString,
  IsIn,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { VM } from '../../../common/validation-messages';

const VALID_DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export class CreateTrainingScheduleDto {
  @IsArray({ message: VM.ARRAY('días de la semana') })
  @IsIn(VALID_DAYS, {
    each: true,
    message: VM.IN('días de la semana', VALID_DAYS),
  })
  daysOfWeek: string[];

  @IsString({ message: VM.STRING('hora') })
  @Matches(/^\d{2}:\d{2}$/, { message: VM.MATCHES('hora', 'HH:MM') })
  time: string;

  @IsDateString({}, { message: VM.DATE('fecha de inicio') })
  startDate: string;

  @IsDateString({}, { message: VM.DATE('fecha de fin') })
  endDate: string;

  @IsOptional()
  @IsString({ message: VM.STRING('ubicación') })
  location?: string;
}
