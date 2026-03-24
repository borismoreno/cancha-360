import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  DIRECTOR = 'DIRECTOR',
  COACH = 'COACH',
  PARENT = 'PARENT',
}

@Injectable()
export class FakeUserMiddleware implements NestMiddleware {
  use(req: Request & { user?: unknown }, _res: Response, next: NextFunction) {
    req.user = {
      id: Number(req.headers['x-user-id']) || 1,
      role: req.headers['x-user-role'] || 'SUPER_ADMIN',
      academyId: Number(req.headers['x-academy-id']) || 1,
    };
    next();
  }
}
