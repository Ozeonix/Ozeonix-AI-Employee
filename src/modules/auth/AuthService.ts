import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { AuthRepository } from './AuthRepository.js';
import { RegisterDto, LoginDto } from './dto/auth.dto.js';
import { ConflictError, UnauthorizedError } from '../../shared/errors/AppError.js';

export class AuthService {
  private authRepository: AuthRepository;

  constructor(authRepository = new AuthRepository()) {
    this.authRepository = authRepository;
  }

  async register(dto: RegisterDto) {
    const existingCompany = await this.authRepository.findCompanyBySlug(dto.companySlug);
    if (existingCompany) {
      throw new ConflictError('Company slug already exists');
    }

    const existingUser = await this.authRepository.findUserByEmail(dto.email);
    if (existingUser) {
      throw new ConflictError('User email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const { company, user } = await this.authRepository.createTenantWithAdmin({
      companyName: dto.companyName,
      companySlug: dto.companySlug,
      email: dto.email,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone,
    });

    const tokens = await this.generateTokens(user.id, company.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      company: {
        id: company.id,
        name: company.name,
        slug: company.slug,
      },
      tokens,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.authRepository.findUserByEmail(dto.email);
    if (!user || user.deletedAt) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedError('User account is inactive');
    }

    const tokens = await this.generateTokens(user.id, user.companyId);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        companyId: user.companyId,
      },
      tokens,
    };
  }

  async refreshTokens(refreshTokenStr: string) {
    const storedToken = await this.authRepository.findRefreshToken(refreshTokenStr);
    if (!storedToken || storedToken.isRevoked || storedToken.expiresAt < new Date()) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    await this.authRepository.revokeRefreshToken(refreshTokenStr);
    return this.generateTokens(storedToken.userId, storedToken.user.companyId);
  }

  private async generateTokens(userId: string, tenantId: string) {
    const accessToken = jwt.sign({ userId, tenantId }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    });

    const refreshToken = jwt.sign({ userId, tenantId }, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.authRepository.storeRefreshToken(userId, refreshToken, expiresAt, tenantId);

    return {
      accessToken,
      refreshToken,
      expiresIn: env.JWT_EXPIRES_IN,
    };
  }
}
