import { prisma } from '../../config/database.js';

export class RbacRepository {
  async listUsers(tenantId: string) {
    return prisma.user.findMany({
      where: { companyId: tenantId, deletedAt: null },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        status: true,
        createdAt: true,
        userRoles: { include: { role: true } },
      },
    });
  }

  async listRoles() {
    return prisma.role.findMany({
      where: { deletedAt: null },
      include: { rolePermissions: { include: { permission: true } } },
    });
  }

  async listPermissions() {
    return prisma.permission.findMany({ where: { deletedAt: null } });
  }

  async createApiKey(companyId: string, userId: string, name: string, keyHash: string, keyPrefix: string) {
    return prisma.apiKey.create({
      data: {
        companyId,
        userId,
        name,
        keyHash,
        keyPrefix,
        tenantId: companyId,
      },
    });
  }

  async listApiKeys(companyId: string) {
    return prisma.apiKey.findMany({
      where: { companyId, deletedAt: null },
      select: {
        id: true,
        name: true,
        keyPrefix: true,
        isActive: true,
        createdAt: true,
      },
    });
  }
}
