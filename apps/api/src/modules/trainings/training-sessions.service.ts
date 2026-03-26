import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { AttendanceStatus } from '@prisma/client';
import { prisma } from '@cancha360/database';
import { AttendanceDto } from './dto/attendance.dto';
import { CancelSessionDto } from './dto/cancel-session.dto';
import { MESSAGES } from '../../common/messages';


@Injectable()
export class TrainingSessionsService {

  async listSessions(
    teamId: number,
    currentUser: { id: number; role: string; academyId?: number },
  ) {
    const isSuperAdmin = currentUser.role === 'SUPER_ADMIN';

    const team = await prisma.team.findFirst({
      where: isSuperAdmin
        ? { id: teamId }
        : { id: teamId, academyId: currentUser.academyId },
    });

    if (!team) {
      throw new NotFoundException(MESSAGES.TEAM.NOT_FOUND(teamId));
    }

    return prisma.trainingSession.findMany({
      where: { teamId },
      orderBy: { date: 'asc' },
      include: {
        team: { select: { id: true, name: true, category: true } },
      },
    });
  }

  async getSession(
    sessionId: number,
    currentUser: { id: number; role: string; academyId?: number },
  ) {
    const isSuperAdmin = currentUser.role === 'SUPER_ADMIN';

    const session = await prisma.trainingSession.findFirst({
      where: isSuperAdmin
        ? { id: sessionId }
        : { id: sessionId, academyId: currentUser.academyId },
      include: {
        team: { select: { id: true, name: true, category: true } },
      },
    });

    if (!session) {
      throw new NotFoundException(MESSAGES.TRAINING.SESSION_NOT_FOUND(sessionId));
    }

    const players = await prisma.player.findMany({
      where: { teamId: session.teamId },
      orderBy: { name: 'asc' },
      select: { id: true, name: true, position: true },
    });

    const attendances = await prisma.attendance.findMany({
      where: { trainingId: sessionId },
    });

    const attendanceMap = new Map(attendances.map((a) => [a.playerId, a.status]));

    return {
      ...session,
      players: players.map((p) => ({
        ...p,
        attendanceStatus: attendanceMap.get(p.id) ?? null,
      })),
    };
  }

  async cancelSession(
    sessionId: number,
    dto: CancelSessionDto,
    currentUser: { id: number; role: string; academyId?: number },
  ) {
    const isSuperAdmin = currentUser.role === 'SUPER_ADMIN';

    const session = await prisma.trainingSession.findFirst({
      where: isSuperAdmin
        ? { id: sessionId }
        : { id: sessionId, academyId: currentUser.academyId },
    });

    if (!session) {
      throw new NotFoundException(
        MESSAGES.TRAINING.SESSION_NOT_FOUND(sessionId),
      );
    }

    if (!isSuperAdmin && currentUser.role === 'COACH') {
      const isCoach = await prisma.teamCoach.findFirst({
        where: { teamId: session.teamId, userId: currentUser.id },
      });
      if (!isCoach) {
        throw new ForbiddenException(MESSAGES.TEAM_COACH.FORBIDDEN);
      }
    }

    return prisma.trainingSession.update({
      where: { id: sessionId },
      data: {
        status: 'CANCELLED',
        cancelReason: dto.reason,
      },
    });
  }

  async recordAttendance(
    sessionId: number,
    dto: AttendanceDto,
    currentUser: { id: number; role: string; academyId?: number },
  ) {
    const isSuperAdmin = currentUser.role === 'SUPER_ADMIN';

    const session = await prisma.trainingSession.findFirst({
      where: isSuperAdmin
        ? { id: sessionId }
        : { id: sessionId, academyId: currentUser.academyId },
    });

    if (!session) {
      throw new NotFoundException(
        MESSAGES.TRAINING.SESSION_NOT_FOUND(sessionId),
      );
    }

    if (!isSuperAdmin && currentUser.role === 'COACH') {
      const isCoach = await prisma.teamCoach.findFirst({
        where: { teamId: session.teamId, userId: currentUser.id },
      });
      if (!isCoach) {
        throw new ForbiddenException(MESSAGES.TEAM_COACH.FORBIDDEN);
      }
    }

    const player = await prisma.player.findFirst({
      where: isSuperAdmin
        ? { id: dto.playerId }
        : { id: dto.playerId, academyId: currentUser.academyId },
    });

    if (!player) {
      throw new NotFoundException(MESSAGES.PLAYER.NOT_FOUND(dto.playerId));
    }

    return prisma.attendance.upsert({
      where: {
        playerId_trainingId: {
          playerId: dto.playerId,
          trainingId: sessionId,
        },
      },
      update: {
        status: dto.status as AttendanceStatus,
      },
      create: {
        academyId: session.academyId,
        playerId: dto.playerId,
        trainingId: sessionId,
        status: dto.status as AttendanceStatus,
      },
    });
  }
}
