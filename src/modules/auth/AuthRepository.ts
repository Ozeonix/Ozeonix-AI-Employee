import { prisma } from '../../config/database.js';
import { User, Company, RefreshToken } from '@prisma/client';

export class AuthRepository {
  async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
      include: { company: true },
    });
  }

  async findCompanyBySlug(slug: string): Promise<Company | null> {
    return prisma.company.findUnique({
      where: { slug },
    });
  }

  async createTenantWithAdmin(data: {
    companyName: string;
    companySlug: string;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) {
    return prisma.$transaction(async (tx) => {
      // 1. Create Company
      const company = await tx.company.create({
        data: {
          name: data.companyName,
          slug: data.companySlug,
          email: data.email,
          phone: data.phone,
          status: 'ACTIVE',
        },
      });

      // 2. Set tenantId to company.id
      await tx.company.update({
        where: { id: company.id },
        data: { tenantId: company.id },
      });

      // 3. Create Admin User
      const user = await tx.user.create({
        data: {
          companyId: company.id,
          tenantId: company.id,
          email: data.email,
          passwordHash: data.passwordHash,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          status: 'ACTIVE',
          emailVerified: true,
        },
      });

      // 4. Assign Admin Role if exists
      const adminRole = await tx.role.findUnique({ where: { code: 'ROLE_SUPER_ADMIN' } });
      if (adminRole) {
        await tx.userRole.create({
          data: {
            userId: user.id,
            roleId: adminRole.id,
            tenantId: company.id,
          },
        });
      }

      return { company, user };
    });
  }

  async storeRefreshToken(userId: string, token: string, expiresAt: Date, tenantId?: string) {
    return prisma.refreshToken.create({
      data: {
        userId,
        token,
        expiresAt,
        tenantId,
      },
    });
  }

  async findRefreshToken(token: string): Promise<RefreshToken | null> {
    return prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });
  }

  async revokeRefreshToken(token: string) {
    return prisma.refreshToken.update({
      where: { token },
      data: { isRevoked: true },
    });
  }
}
