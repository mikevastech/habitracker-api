import { Request, Response, NextFunction } from 'express';

const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const BLUE = '\x1b[34m';
const CYAN = '\x1b[36m';
const RED = '\x1b[31m';

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

/** Logs every request (method + url) before guards/interceptors. Ensures POST and others are always visible. */
export function requestLoggerMiddleware(req: Request, _res: Response, next: NextFunction): void {
  if (process.env.NODE_ENV === 'production') return next();
  const method = methodWithColor(req.method);
  const url = req.originalUrl ?? req.url ?? '';
  console.log(`[Request] → ${method} ${url}`);
  next();
}
