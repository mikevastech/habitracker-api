import { Controller, All, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { HandleAuthUseCase } from '../application/handle-auth.use-case';

@Controller('auth')
export class AuthController {
  constructor(private readonly handleAuthUseCase: HandleAuthUseCase) {}

  @All('*')
  async handleAuth(@Req() req: Request, @Res() res: Response): Promise<void> {
    await this.handleAuthUseCase.execute(req, res);
  }
}
