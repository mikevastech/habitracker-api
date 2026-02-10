import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { auth } from '../auth.lib';
import type { Session } from '../auth.lib';
import type { AuthenticatedUser } from '../../../domain/auth.types';

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
  session: Session['session'];
}

function toAuthenticatedUser(user: {
  id: string;
  email: string;
  name?: string | null;
  lastName?: string | null;
  image?: string | null;
}): AuthenticatedUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name ?? null,
    lastName: user.lastName ?? null,
    image: user.image ?? null,
  };
}

@Injectable()
export class SessionGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const session = await auth.api.getSession({
      headers: request.headers as HeadersInit,
    });

    if (!session) {
      throw new UnauthorizedException('Authentication required');
    }

    request.user = toAuthenticatedUser(session.user);
    request.session = session.session;

    return true;
  }
}
