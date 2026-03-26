import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { prisma } from '@cancha360/database';
import { CreateTeamDto } from './dto/create-team.dto';
import { MESSAGES } from '../../common/messages';

@Injectable()
export class TeamsService {

  async listTeams(
    academyId: number,
    currentUser: { id: number; role: string; academyId?: number },
  ) {
    const isSuperAdmin = currentUser.role === 'SUPER_ADMIN';

    const academy = await prisma.academy.findFirst({
      where: isSuperAdmin
        ? { id: academyId }
        : { id: academyId, memberships: { some: { userId: currentUser.id } } },
    });

    if (!academy) {
      throw new NotFoundException(MESSAGES.ACADEMY.NOT_FOUND(academyId));
    }

    return prisma.team.findMany({
      where: { academyId },
      orderBy: { name: 'asc' },
    });
  }

  async listTeamsForUser(currentUser: { id: number; role: string; academyId?: number }) {
    const isSuperAdmin = currentUser.role === 'SUPER_ADMIN';
    if (!isSuperAdmin && !currentUser.academyId) return [];

    return prisma.team.findMany({
      where: isSuperAdmin ? {} : { academyId: currentUser.academyId },
      orderBy: { name: 'asc' },
      select: { id: true, name: true, category: true, academyId: true },
    });
  }

  async getTeam(
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

    return team;
  }

  async createTeam(
    academyId: number,
    dto: CreateTeamDto,
    currentUser: { id: number; role: string; academyId?: number },
  ) {
    const isSuperAdmin = currentUser.role === 'SUPER_ADMIN';

    const academy = await prisma.academy.findUnique({
      where: isSuperAdmin
        ? { id: academyId }
        : { id: academyId, memberships: { some: { userId: currentUser.id } } },
    });

    if (!academy) {
      throw new NotFoundException(MESSAGES.ACADEMY.NOT_FOUND(academyId));
    }

    return prisma.team.create({
      data: {
        academyId: academy.id,
        name: dto.name,
        category: dto.category,
      },
    });
  }
}
