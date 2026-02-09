import { Controller, All, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { auth } from './auth.lib';

@Controller('api/auth')
export class AuthController {
  @All('*')
  async handleAuth(@Req() req: Request, @Res() res: Response) {
    const protocol = req.protocol;
    const host = req.get('host');
    const fullUrl = `${protocol}://${host}${req.originalUrl}`;

    const response = await auth.handler(
      new globalThis.Request(fullUrl, {
        method: req.method,
        headers: req.headers as HeadersInit,
        body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : null,
      }),
    );

    res.status(response.status);
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    const body = await response.text();
    return res.send(body);
  }
}
