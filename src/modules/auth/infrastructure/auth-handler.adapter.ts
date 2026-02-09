import { Injectable } from '@nestjs/common';
import type { Request, Response } from 'express';
import { auth } from '../../../shared/infrastructure/auth/auth.lib';
import type { IAuthHandler } from '../domain/ports/auth-handler.interface';

@Injectable()
export class AuthHandlerAdapter implements IAuthHandler {
  async handle(req: Request, res: Response): Promise<void> {
    await (auth.handler as unknown as (req: Request, res: Response) => Promise<unknown>)(req, res);
  }
}
