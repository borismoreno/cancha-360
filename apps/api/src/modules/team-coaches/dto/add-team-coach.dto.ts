import { IsEnum, IsInt, IsPositive } from 'class-validator';
import { TeamCoachRole } from '@prisma/client';
import { VM } from '../../../common/validation-messages';

export class AddTeamCoachDto {
  @IsInt({ message: VM.INT('userId') })
  @IsPositive({ message: VM.MIN('userId', 1) })
  userId: number;

  @IsEnum(TeamCoachRole, { message: 'role debe ser HEAD o ASSISTANT' })
  role: TeamCoachRole;
}
