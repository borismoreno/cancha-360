import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { prisma } from '@cancha360/database';
import { AddTeamCoachDto } from './dto/add-team-coach.dto';
import { MESSAGES } from '../../common/messages';

type CurrentUser = { id: number; role: string; academyId?: number };

@Injectable()
export class TeamCoachesService {

  async addCoach(
    teamId: number,
    dto: AddTeamCoachDto,
    currentUser: CurrentUser,
  ) {
    const team = await prisma.team.findFirst({
      where: { id: teamId, academyId: currentUser.academyId },
    });

    if (!team) {
      throw new NotFoundException(MESSAGES.TEAM.NOT_FOUND(teamId));
    }

    const user = await prisma.user.findUnique({
      where: { id: dto.userId },
    });

    if (!user) {
      throw new NotFoundException(
        MESSAGES.TEAM_COACH.USER_NOT_FOUND(dto.userId),
      );
    }

    const membership = await prisma.membership.findUnique({
      where: {
        userId_academyId: {
          userId: dto.userId,
          academyId: currentUser.academyId!,
        },
      },
    });

    if (!membership) {
      throw new BadRequestException(MESSAGES.TEAM.COACH_NOT_MEMBER);
    }

    if (!membership.role.includes('COACH')) {
      throw new BadRequestException(MESSAGES.TEAM.COACH_INVALID_ROLE);
    }

    const existing = await prisma.teamCoach.findUnique({
      where: { teamId_userId: { teamId, userId: dto.userId } },
    });

    if (existing) {
      throw new ConflictException(MESSAGES.TEAM_COACH.ALREADY_ASSIGNED);
    }

    return prisma.teamCoach.create({
      data: {
        teamId,
        userId: dto.userId,
        role: dto.role,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async getCoaches(teamId: number, currentUser: CurrentUser) {
    const team = await prisma.team.findFirst({
      where: { id: teamId, academyId: currentUser.academyId },
    });

    if (!team) {
      throw new NotFoundException(MESSAGES.TEAM.NOT_FOUND(teamId));
    }

    return prisma.teamCoach.findMany({
      where: { teamId },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async removeCoach(teamId: number, userId: number, currentUser: CurrentUser) {
    const team = await prisma.team.findFirst({
      where: { id: teamId, academyId: currentUser.academyId },
    });

    if (!team) {
      throw new NotFoundException(MESSAGES.TEAM.NOT_FOUND(teamId));
    }

    const teamCoach = await prisma.teamCoach.findUnique({
      where: { teamId_userId: { teamId, userId } },
    });

    if (!teamCoach) {
      throw new NotFoundException(MESSAGES.TEAM_COACH.NOT_FOUND);
    }

    await prisma.teamCoach.delete({
      where: { teamId_userId: { teamId, userId } },
    });
  }

  async isCoachOfTeam(teamId: number, userId: number): Promise<boolean> {
    const record = await prisma.teamCoach.findFirst({
      where: { teamId, userId },
    });
    return !!record;
  }
}
