import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { prisma } from '../../config/database.js';
import { hashPassword, verifyPassword } from '../../utils/password.js';
import { RegisterInput, LoginInput } from './dto/auth.dto.js';
import { ConflictError, UnauthorizedError } from '../../shared/errors/AppError.js';

export class AuthService {
  public async register(dto: RegisterInput) {
    const existingCompany = await prisma.company.findUnique({
      where: { slug: dto.companySlug },
    });
    if (existingCompany) {
      throw new ConflictError('Company slug is already taken');
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new ConflictError('User email is already registered');
    }

    const passwordHash = await hashPassword(dto.password);

    return prisma.$transaction(async (tx) => {
      // Create Company
      const company = await tx.company.create({
        data: {
          name: dto.companyName,
          slug: dto.companySlug,
          email: dto.email,
          phone: dto.phone,
          status: 'ACTIVE',
        },
      });

      const tenantId = company.id;
      await tx.company.update({
        where: { id: company.id },
        data: { tenantId },
      });

      // Create Admin User
      const user = await tx.user.create({
        data: {
          companyId: company.id,
          tenantId,
          email: dto.email,
          passwordHash,
          firstName: dto.firstName,
          lastName: dto.lastName,
          phone: dto.phone,
          status: 'ACTIVE',
          emailVerified: true,
        },
      });

      // Create Employee Record with ADMIN role
      const employeeCode = `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
      const employee = await tx.employee.create({
        data: {
          companyId: company.id,
          tenantId,
          userId: user.id,
          employeeCode,
          department: 'Executive',
          designation: 'Company Administrator',
          role: 'ADMIN',
          status: 'ACTIVE',
        },
      });

      const tokens = await this.generateTokens(user.id, company.id, employee.role);

      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: employee.role,
        },
        company: {
          id: company.id,
          name: company.name,
          slug: company.slug,
        },
        tokens,
      };
    });
  }

  public async login(dto: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: dto.email },
      include: { employee: true, company: true },
    });

    if (!user || user.deletedAt) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isValid = await verifyPassword(user.passwordHash, dto.password);
    if (!isValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedError('User account is inactive');
    }

    const role = user.employee?.role || 'EMPLOYEE';
    const tokens = await this.generateTokens(user.id, user.companyId, role);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        companyId: user.companyId,
        role,
      },
      tokens,
    };
  }

  public async refreshTokens(refreshTokenStr: string) {
    try {
      const decoded = jwt.verify(refreshTokenStr, env.JWT_REFRESH_SECRET) as {
        userId: string;
        tenantId: string;
        role: string;
      };

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: { employee: true },
      });

      if (!user || user.deletedAt || user.status !== 'ACTIVE') {
        throw new UnauthorizedError('Invalid refresh token');
      }

      const role = user.employee?.role || 'EMPLOYEE';
      return this.generateTokens(user.id, user.companyId, role);
    } catch (_err) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }
  }

  private async generateTokens(userId: string, tenantId: string, role: string) {
    const accessToken = jwt.sign({ userId, tenantId, role }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    });

    const refreshToken = jwt.sign({ userId, tenantId, role }, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: env.JWT_EXPIRES_IN,
    };
  }
}
