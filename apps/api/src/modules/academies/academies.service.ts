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
}
