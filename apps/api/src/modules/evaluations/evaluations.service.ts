import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { prisma } from '@cancha360/database';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { MESSAGES } from '../../common/messages';

type CurrentUser = { id: number; role: string; academyId?: number };

@Injectable()
export class EvaluationsService {

  async createEvaluation(
    playerId: number,
    dto: CreateEvaluationDto,
    currentUser: CurrentUser,
  ) {
    const isSuperAdmin = currentUser.role === 'SUPER_ADMIN';

    const player = await prisma.player.findFirst({
      where: isSuperAdmin
        ? { id: playerId }
        : { id: playerId, academyId: currentUser.academyId },
    });

    if (!player) {
      throw new NotFoundException(MESSAGES.PLAYER.NOT_FOUND(playerId));
    }

    if (!isSuperAdmin && currentUser.role === 'COACH') {
      const isCoach = await prisma.teamCoach.findFirst({
        where: { teamId: player.teamId, userId: currentUser.id },
      });
      if (!isCoach) {
        throw new ForbiddenException(MESSAGES.TEAM_COACH.FORBIDDEN);
      }
    }

    return prisma.evaluation.create({
      data: {
        academyId: player.academyId,
        playerId,
        coachId: currentUser.id,
        technicalScore: dto.technicalScore,
        tacticalScore: dto.tacticalScore,
        physicalScore: dto.physicalScore,
        attitudeScore: dto.attitudeScore,
        notes: dto.notes,
        date: new Date(),
      },
    });
  }

  async getPlayerProgress(playerId: number, currentUser: CurrentUser) {
    const isSuperAdmin = currentUser.role === 'SUPER_ADMIN';

    const player = await prisma.player.findFirst({
      where: isSuperAdmin
        ? { id: playerId }
        : { id: playerId, academyId: currentUser.academyId },
      include: {
        team: { select: { id: true, name: true, category: true } },
      },
    });

    if (!player) {
      throw new NotFoundException(MESSAGES.PLAYER.NOT_FOUND(playerId));
    }

    if (currentUser.role === 'PARENT') {
      const guardian = await prisma.playerGuardian.findUnique({
        where: {
          playerId_userId: {
            playerId,
            userId: currentUser.id,
          },
        },
      });

      if (!guardian) {
        throw new ForbiddenException(MESSAGES.PLAYER.NOT_LINKED);
      }
    }

    const evaluations = await prisma.evaluation.findMany({
      where: { playerId, academyId: player.academyId },
      orderBy: { date: 'asc' },
    });

    const attendanceRecords = await prisma.attendance.findMany({
      where: { playerId, academyId: player.academyId },
    });

    const totalTrainings = attendanceRecords.length;
    const totalPresent = attendanceRecords.filter(
      (a) => a.status === 'PRESENT',
    ).length;

    const count = evaluations.length;
    const averages =
      count === 0
        ? { technical: 0, tactical: 0, physical: 0, attitude: 0 }
        : {
            technical:
              evaluations.reduce((sum, e) => sum + e.technicalScore, 0) / count,
            tactical:
              evaluations.reduce((sum, e) => sum + e.tacticalScore, 0) / count,
            physical:
              evaluations.reduce((sum, e) => sum + e.physicalScore, 0) / count,
            attitude:
              evaluations.reduce((sum, e) => sum + e.attitudeScore, 0) / count,
          };

    const lastEvaluation = count > 0 ? evaluations[count - 1] : null;

    return {
      player: {
        id: player.id,
        name: player.name,
        position: player.position,
        birthdate: player.birthdate,
        team: player.team,
      },
      evaluations,
      averages,
      lastEvaluation,
      attendanceSummary: {
        totalSessions: totalTrainings,
        attended: totalPresent,
        missed: totalTrainings - totalPresent,
      },
    };
  }
}
