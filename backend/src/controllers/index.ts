import { Request, Response } from 'express';
import { formatResponse } from '../utils/index.js';

export class HealthController {
  public check = (_req: Request, res: Response): void => {
    res.status(200).json(formatResponse(true, 'System is healthy'));
  };
}
