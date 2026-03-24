import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { prisma } from '@cancha360/database';
import { CreateTrainingScheduleDto } from './dto/create-training-schedule.dto';
import { MESSAGES } from '../../common/messages';

const DAY_INDEX: Record<string, number> = {
  SUN: 0,
  MON: 1,
  TUE: 2,
  WED: 3,
  THU: 4,
  FRI: 5,
  SAT: 6,
};

@Injectable()
export class TrainingSchedulesService {

  async createSchedule(
    teamId: number,
    dto: CreateTrainingScheduleDto,
    currentUser: { id: number; role: string; academyId?: number },
  ) {
    const isSuperAdmin = currentUser.role === 'SUPER_ADMIN';

    const team = await prisma.team.findFirst({
      where: isSuperAdmin
        ? { id: teamId }
        : { id: teamId, academyId: currentUser.academyId },
    });

    if (!team) {
      throw new NotFoundException(MESSAGES.TRAINING.TEAM_NOT_FOUND(teamId));
    }

    if (!isSuperAdmin && currentUser.role === 'COACH') {
      const isCoach = await prisma.teamCoach.findFirst({
        where: { teamId, userId: currentUser.id },
      });
      if (!isCoach) {
        throw new ForbiddenException(MESSAGES.TEAM_COACH.FORBIDDEN);
      }
    }

    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);

    if (startDate >= endDate) {
      throw new BadRequestException(MESSAGES.TRAINING.INVALID_DATE_RANGE);
    }

    const targetDays = new Set(dto.daysOfWeek.map((d) => DAY_INDEX[d]));

    const sessionDates: Date[] = [];
    const current = new Date(startDate);
    while (current <= endDate) {
      if (targetDays.has(current.getDay())) {
        sessionDates.push(new Date(current));
      }
      current.setDate(current.getDate() + 1);
    }

    return prisma.$transaction(async (tx) => {
      const schedule = await tx.trainingSchedule.create({
        data: {
          academyId: team.academyId,
          teamId,
          daysOfWeek: dto.daysOfWeek.join(','),
          time: dto.time,
          startDate,
          endDate,
          location: dto.location,
        },
      });

      if (sessionDates.length > 0) {
        await tx.trainingSession.createMany({
          data: sessionDates.map((date) => ({
            academyId: team.academyId,
            teamId,
            scheduleId: schedule.id,
            date,
            status: 'SCHEDULED' as const,
          })),
        });
      }

      return {
        ...schedule,
        sessionsCreated: sessionDates.length,
      };
    });
  }
}
