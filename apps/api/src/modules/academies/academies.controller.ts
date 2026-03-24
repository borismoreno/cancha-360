import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AcademiesService } from './academies.service';
import { CreateAcademyDto } from './dto/create-academy.dto';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('admin/academies')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AcademiesController {
  constructor(private readonly academiesService: AcademiesService) {}

  @Post()
  @Roles('SUPER_ADMIN')
  create(@Body() dto: CreateAcademyDto) {
    return this.academiesService.createAcademy(dto);
  }
}
