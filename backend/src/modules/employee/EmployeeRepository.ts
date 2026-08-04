import { prisma } from '../../config/database.js';

export class EmployeeRepository {
  public async listEmployees(tenantId: string) {
    return prisma.employee.findMany({
      where: { companyId: tenantId, deletedAt: null },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  public async findEmployeeById(id: string, tenantId: string) {
    return prisma.employee.findFirst({
      where: { id, companyId: tenantId, deletedAt: null },
      include: { user: true },
    });
  }

  public async updateEmployee(id: string, tenantId: string, data: any) {
    return prisma.employee.update({
      where: { id, companyId: tenantId },
      data,
      include: { user: true },
    });
  }

  public async logActivity(companyId: string, userId: string, action: string, details: any) {
    return prisma.auditLog.create({
      data: {
        companyId,
        tenantId: companyId,
        userId,
        action,
        entity: 'EmployeeActivity',
        newValues: details,
      },
    });
  }
}
