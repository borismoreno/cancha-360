import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { prisma } from '@cancha360/database';
import { CreatePlayerDto } from './dto/create-player.dto';
import { Role, MembershipStatus } from '@prisma/client';
import * as crypto from 'crypto';
import { MESSAGES } from '../../common/messages';

@Injectable()
export class PlayersService {

  async listPlayers(
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

    return prisma.player.findMany({
      where: { teamId },
      orderBy: { name: 'asc' },
    });
  }

  async createPlayer(
    teamId: number,
    dto: CreatePlayerDto,
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

    return prisma.$transaction(async (tx) => {
      const player = await tx.player.create({
        data: {
          academyId: team.academyId,
          teamId,
          name: dto.name,
          birthdate: new Date(dto.birthdate),
          position: dto.position,
        },
      });

      if (!dto.parentEmail) {
        return player;
      }

      let parentUser = await tx.user.findUnique({
        where: { email: dto.parentEmail },
      });

      if (!parentUser) {
        if (!dto.parentName) {
          throw new BadRequestException(MESSAGES.PLAYER.PARENT_NAME_REQUIRED);
        }

        parentUser = await tx.user.create({
          data: {
            email: dto.parentEmail,
            name: dto.parentName,
            passwordHash: crypto.randomUUID(),
          },
        });
      }

      const existingMembership = await tx.membership.findUnique({
        where: {
          userId_academyId: {
            userId: parentUser.id,
            academyId: team.academyId,
          },
        },
      });

      if (!existingMembership) {
        await tx.membership.create({
          data: {
            userId: parentUser.id,
            academyId: team.academyId,
            role: [Role.PARENT],
            status: MembershipStatus.ACTIVE,
          },
        });
      }

      const existingGuardian = await tx.playerGuardian.findUnique({
        where: {
          playerId_userId: {
            playerId: player.id,
            userId: parentUser.id,
          },
        },
      });

      if (!existingGuardian) {
        await tx.playerGuardian.create({
          data: {
            playerId: player.id,
            userId: parentUser.id,
          },
        });
      }

      return player;
    });
  }
}
