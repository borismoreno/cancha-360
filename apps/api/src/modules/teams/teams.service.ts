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
