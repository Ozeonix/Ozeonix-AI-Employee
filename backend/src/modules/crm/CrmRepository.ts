import { prisma } from '../../config/database.js';
import { Customer } from '@prisma/client';

export class CrmRepository {
  public async createCustomer(tenantId: string, data: any): Promise<Customer> {
    return prisma.customer.create({
      data: {
        ...data,
        companyId: tenantId,
        tenantId,
      },
    });
  }

  public async updateCustomer(id: string, tenantId: string, data: any): Promise<Customer> {
    return prisma.customer.update({
      where: { id, tenantId },
      data,
    });
  }

  public async findCustomerById(id: string, tenantId: string): Promise<Customer | null> {
    return prisma.customer.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: { conversations: { include: { messages: true } } },
    });
  }

  public async searchCustomers(tenantId: string, filters: { query?: string; status?: string; page: number; limit: number }) {
    const where: any = { companyId: tenantId, deletedAt: null };

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.query) {
      where.OR = [
        { name: { contains: filters.query, mode: 'insensitive' } },
        { phone: { contains: filters.query, mode: 'insensitive' } },
        { email: { contains: filters.query, mode: 'insensitive' } },
      ];
    }

    const skip = (filters.page - 1) * filters.limit;

    const [items, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: filters.limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.customer.count({ where }),
    ]);

    return { items, total, page: filters.page, limit: filters.limit, totalPages: Math.ceil(total / filters.limit) };
  }

  public async softDeleteCustomer(id: string, tenantId: string): Promise<boolean> {
    await prisma.customer.update({
      where: { id, tenantId },
      data: { deletedAt: new Date() },
    });
    return true;
  }
}
