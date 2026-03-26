import { Module } from '@nestjs/common';
import { AcademiesController } from './academies.controller';
import { AcademiesPortalController } from './academies-portal.controller';
import { AcademiesService } from './academies.service';

@Module({
  controllers: [AcademiesController, AcademiesPortalController],
  providers: [AcademiesService],
})
export class AcademiesModule {}
