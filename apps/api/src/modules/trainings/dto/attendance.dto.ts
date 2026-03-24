import { IsIn, IsInt } from 'class-validator';
import { VM } from '../../../common/validation-messages';

export class AttendanceDto {
  @IsInt({ message: VM.INT('playerId') })
  playerId: number;

  @IsIn(['PRESENT', 'ABSENT'], {
    message: VM.IN('estado', ['PRESENT', 'ABSENT']),
  })
  status: 'PRESENT' | 'ABSENT';
}
