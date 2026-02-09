import { Injectable } from '@nestjs/common';
import type { Request, Response } from 'express';
import { toNodeHandler } from 'better-auth/node';
import { auth } from '../../../shared/infrastructure/auth/auth.lib';
import type { IAuthHandler } from '../domain/ports/auth-handler.interface';

/**
 * Better Auth uses better-call, which expects a Web API Request (with headers.get(), etc.).
 * We use better-call's Node adapter to convert Express req/res to Web Request/Response.
 */
@Injectable()
export class AuthHandlerAdapter implements IAuthHandler {
  private readonly nodeHandler = toNodeHandler(auth.handler);

  async handle(req: Request, res: Response): Promise<void> {
    // toNodeHandler's getRequest uses req.url for the path; ensure it's the full path (Nest may set req.url to the tail only).
    const path = req.originalUrl ?? req.url ?? '';
    (req as Request & { url: string }).url = path.startsWith('http')
      ? new URL(path).pathname
      : path;
    if (process.env.NODE_ENV !== 'production') {
      console.log('[AuthHandlerAdapter] forwarding to Better Auth:', path);
    }
    try {
      await this.nodeHandler(req, res);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const stack = err instanceof Error ? err.stack : undefined;
      console.error('[AuthHandler] Error:', message);
      if (stack) console.error('[AuthHandler] Stack:', stack);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Auth failed', message });
      }
    }
  }
}
