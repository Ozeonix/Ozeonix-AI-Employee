import { Request, Response, NextFunction } from 'express';
import { AuthService } from './AuthService.js';
import { registerSchema, loginSchema, refreshTokenSchema } from './dto/auth.dto.js';
import { sendResponse } from '../../shared/utils/response.js';
import { TenantRequest } from '../../middleware/tenant.middleware.js';

export class AuthController {
  private authService: AuthService;

  constructor(authService = new AuthService()) {
    this.authService = authService;
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      const result = await this.authService.register(validatedData);
      return sendResponse(res, 201, 'Tenant company and admin account created successfully', result);
    } catch (err) {
      next(err);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      const result = await this.authService.login(validatedData);
      return sendResponse(res, 200, 'Authenticated successfully', result);
    } catch (err) {
      next(err);
    }
  };

  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = refreshTokenSchema.parse(req.body);
      const tokens = await this.authService.refreshTokens(validatedData.refreshToken);
      return sendResponse(res, 200, 'Tokens refreshed successfully', tokens);
    } catch (err) {
      next(err);
    }
  };

  me = async (req: TenantRequest, res: Response, next: NextFunction) => {
    try {
      return sendResponse(res, 200, 'Current user profile retrieved', req.user);
    } catch (err) {
      next(err);
    }
  };
}
