import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { prisma } from '@cancha360/database';
import { AcceptInvitationDto } from '../invitations/dto/accept-invitation.dto';
import { LoginDto } from './dto/login.dto';
import { SelectAcademyDto } from './dto/select-academy.dto';
import { MESSAGES } from '../../common/messages';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(dto: LoginDto) {
    const user = await prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        memberships: {
          where: { status: 'ACTIVE' },
          include: { academy: { select: { id: true, name: true } } },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException(MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException(MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    if (user.role === 'SUPER_ADMIN') {
      const token = this.jwtService.sign({
        userId: user.id,
        role: 'SUPER_ADMIN',
      });
      return { accessToken: token };
    }

    if (user.memberships.length === 0) {
      throw new ForbiddenException(MESSAGES.AUTH.NO_MEMBERSHIPS);
    }

    if (user.memberships.length === 1) {
      const membership = user.memberships[0];
      const token = this.jwtService.sign({
        userId: user.id,
        academyId: membership.academyId,
        role: membership.role,
      });
      return { accessToken: token };
    }

    const tempToken = this.jwtService.sign(
      { userId: user.id, type: 'TEMP_AUTH' },
      { expiresIn: '10m' },
    );

    return {
      requiresAcademySelection: true,
      tempToken,
      memberships: user.memberships.map((m) => ({
        academyId: m.academyId,
        academyName: m.academy.name,
        role: m.role,
      })),
    };
  }

  async selectAcademy(userId: number, dto: SelectAcademyDto) {
    const membership = await prisma.membership.findUnique({
      where: {
        userId_academyId: {
          userId,
          academyId: dto.academyId,
        },
      },
    });

    if (!membership || membership.status !== 'ACTIVE') {
      throw new ForbiddenException(MESSAGES.AUTH.NO_MEMBERSHIP_FOR_ACADEMY);
    }

    const token = this.jwtService.sign({
      userId,
      academyId: membership.academyId,
      role: membership.role,
    });

    return { accessToken: token };
  }

  async acceptInvitation(dto: AcceptInvitationDto) {
    const invitation = await prisma.invitation.findUnique({
      where: { token: dto.token },
    });

    if (!invitation) {
      throw new NotFoundException(MESSAGES.INVITATION.NOT_FOUND);
    }

    if (invitation.status !== 'PENDING') {
      throw new BadRequestException(MESSAGES.INVITATION.NOT_PENDING);
    }

    if (invitation.expiresAt < new Date()) {
      throw new BadRequestException(MESSAGES.INVITATION.EXPIRED);
    }

    return prisma.$transaction(async (tx: any) => {
      let user = await tx.user.findUnique({
        where: { email: invitation.email },
      });

      if (!user) {
        user = await tx.user.create({
          data: {
            email: invitation.email,
            name: dto.name,
            passwordHash: await bcrypt.hash(dto.password, 10),
            role: invitation.role,
          },
        });
      }

      const existingMembership = await tx.membership.findUnique({
        where: {
          userId_academyId: {
            userId: user.id,
            academyId: invitation.academyId,
          },
        },
      });

      if (existingMembership) {
        throw new BadRequestException(MESSAGES.INVITATION.ALREADY_MEMBER);
      }

      const membership = await tx.membership.create({
        data: {
          userId: user.id,
          academyId: invitation.academyId,
          role: [invitation.role],
          status: 'ACTIVE',
        },
      });

      await tx.invitation.update({
        where: { id: invitation.id },
        data: { status: 'ACCEPTED' },
      });

      const academy = await tx.academy.findUnique({
        where: { id: invitation.academyId },
      });

      return {
        user: { id: user.id, email: user.email, name: user.name },
        membership,
        academy: { id: academy.id, name: academy.name },
      };
    });
  }
}
