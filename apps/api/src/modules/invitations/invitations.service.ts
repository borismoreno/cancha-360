import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { prisma } from '@cancha360/database';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { Role } from '@prisma/client';
import { MESSAGES } from '../../common/messages';

@Injectable()
export class InvitationsService {

  async createInvitation(
    academyId: number,
    userId: number,
    dto: CreateInvitationDto,
    userRole?: string,
  ) {
    if (userRole !== 'SUPER_ADMIN') {
      const membership = await prisma.membership.findUnique({
        where: { userId_academyId: { userId, academyId } },
      });

      if (!membership || !membership.role.includes(Role.DIRECTOR)) {
        throw new ForbiddenException(MESSAGES.INVITATION.NOT_DIRECTOR);
      }
    }

    const existing = await prisma.invitation.findFirst({
      where: { email: dto.email, academyId, status: 'PENDING' },
    });

    if (existing) {
      throw new BadRequestException(MESSAGES.INVITATION.ALREADY_EXISTS);
    }

    return prisma.invitation.create({
      data: {
        email: dto.email,
        academyId,
        role: dto.role,
        token: crypto.randomUUID(),
        status: 'PENDING',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
  }
}
