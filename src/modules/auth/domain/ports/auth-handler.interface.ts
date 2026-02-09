import type { Request, Response } from 'express';

export interface IAuthHandler {
  handle(req: Request, res: Response): Promise<void>;
}

export const IAuthHandler = Symbol('IAuthHandler');
