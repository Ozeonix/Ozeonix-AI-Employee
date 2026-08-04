import { prisma } from '../../config/database.js';
import { Company, CompanySetting } from '@prisma/client';

export class PlatformRepository {
  async findCompanyById(id: string): Promise<Company | null> {
    return prisma.company.findUnique({
      where: { id },
      include: { settings: true, domains: true, subscriptions: { include: { plan: true } } },
    });
  }

  async updateCompany(id: string, data: Partial<Company>): Promise<Company> {
    return prisma.company.update({
      where: { id },
      data,
    });
  }

  async setCompanySetting(companyId: string, key: string, value: string, category = 'GENERAL'): Promise<CompanySetting> {
    return prisma.companySetting.upsert({
      where: {
        companyId_key: {
          companyId,
          key,
        },
      },
      update: { value, category },
      create: {
        companyId,
        tenantId: companyId,
        key,
        value,
        category,
      },
    });
  }
}
