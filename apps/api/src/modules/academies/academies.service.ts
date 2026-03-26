import { Injectable } from '@nestjs/common';
import { prisma } from '@cancha360/database';
import { CreateAcademyDto } from './dto/create-academy.dto';
import { Role } from '@prisma/client';

@Injectable()
export class AcademiesService {

  async createAcademy(dto: CreateAcademyDto) {
    return prisma.$transaction(async (tx) => {
      const academy = await tx.academy.create({
        data: {
          name: dto.name,
          country: dto.country,
          city: dto.city,
          status: 'ACTIVE',
          createdBySuperAdmin: true,
        },
      });

      const invitation = await tx.invitation.create({
        data: {
          email: dto.directorEmail,
          academyId: academy.id,
          role: Role.DIRECTOR,
          token: crypto.randomUUID(),
          status: 'PENDING',
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      return { academy, invitation };
    });
  }

  async getCurrent(currentUser: { id: number; role: string; academyId?: number }) {
    if (!currentUser.academyId) return null;
    return prisma.academy.findUnique({
      where: { id: currentUser.academyId },
      select: { id: true, name: true, city: true, country: true },
    });
  }

  async getMembers(
    currentUser: { id: number; role: string; academyId?: number },
    role?: string,
  ) {
    const academyId = currentUser.academyId;
    if (!academyId) return [];

    const memberships = await prisma.membership.findMany({
      where: {
        academyId,
        status: 'ACTIVE',
        ...(role ? { role: { has: role as Role } } : {}),
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    return memberships.map((m) => ({
      userId: m.userId,
      name: m.user.name,
      email: m.user.email,
      roles: m.role,
    }));
  }
}
