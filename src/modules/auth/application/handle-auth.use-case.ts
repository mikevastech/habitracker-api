import { Inject, Injectable } from '@nestjs/common';
import type { Request, Response } from 'express';
import { IAuthHandler } from '../domain/ports/auth-handler.interface';

@Injectable()
export class HandleAuthUseCase {
  constructor(
    @Inject(IAuthHandler)
    private readonly authHandler: IAuthHandler,
  ) {}

  async execute(req: Request, res: Response): Promise<void> {
    await this.authHandler.handle(req, res);
  }
}
