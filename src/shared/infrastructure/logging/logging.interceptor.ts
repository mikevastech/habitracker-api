import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Request, Response } from 'express';

const isDev = process.env.NODE_ENV !== 'production';

const RESET = '\x1b[0m';
const GREEN = '\x1b[32m'; // GET
const BLUE = '\x1b[34m'; // POST (visible on light backgrounds)
const CYAN = '\x1b[36m'; // PUT, PATCH
const RED = '\x1b[31m'; // DELETE

function methodWithColor(method: string): string {
  switch (method) {
    case 'GET':
      return `${GREEN}${method}${RESET}`;
    case 'POST':
      return `${BLUE}${method}${RESET}`;
    case 'PUT':
    case 'PATCH':
      return `${CYAN}${method}${RESET}`;
    case 'DELETE':
      return `${RED}${method}${RESET}`;
    default:
      return method;
  }
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (!isDev) return next.handle();

    const http = context.switchToHttp();
    const req = http.getRequest<Request>();
    const method = req.method;
    const methodColored = methodWithColor(method);
    const url = req.url ?? req.originalUrl ?? '';
    const body = req.body as Record<string, unknown> | undefined;
    const start = Date.now();

    let bodyLog = '';
    try {
      if (body && typeof body === 'object' && Object.keys(body as object).length > 0) {
        bodyLog = ` body=${JSON.stringify(body)}`;
      }
    } catch {
      bodyLog = ' body=[?]';
    }

    this.logger.log(`→ ${methodColored} ${url}${bodyLog}`);

    return next.handle().pipe(
      tap(() => {
        const res = http.getResponse<Response>();
        const status = res.statusCode;
        const ms = Date.now() - start;
        this.logger.log(`← ${methodColored} ${url} ${status} ${ms}ms`);
      }),
      catchError((err: { status?: number; statusCode?: number; message?: string }) => {
        const ms = Date.now() - start;
        const status = err?.status ?? err?.statusCode ?? 500;
        const message = typeof err?.message === 'string' ? err.message : 'Unknown error';
        this.logger.warn(`← ${methodColored} ${url} ${status} ${ms}ms error=${message}`);
        throw err as Error;
      }),
    );
  }
}
