import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { MESSAGES } from '../../common/messages';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context
      .switchToHttp()
      .getRequest<{ user?: { role: string[] } }>();

    if (!user) {
      throw new ForbiddenException(MESSAGES.AUTH.INSUFFICIENT_ROLE);
    }

    if (user.role.includes('SUPER_ADMIN')) {
      return true;
    }

    if (!requiredRoles.some((role) => user.role.includes(role))) {
      throw new ForbiddenException(MESSAGES.AUTH.INSUFFICIENT_ROLE);
    }

    return true;
  }
}
