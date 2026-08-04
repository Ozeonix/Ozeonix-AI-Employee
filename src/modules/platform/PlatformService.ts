import { PlatformRepository } from './PlatformRepository.js';
import { NotFoundError } from '../../shared/errors/AppError.js';

export class PlatformService {
  private platformRepository: PlatformRepository;

  constructor(platformRepository = new PlatformRepository()) {
    this.platformRepository = platformRepository;
  }

  async getCompanyProfile(companyId: string) {
    const company = await this.platformRepository.findCompanyById(companyId);
    if (!company || company.deletedAt) {
      throw new NotFoundError('Tenant Company not found');
    }
    return company;
  }

  async updateCompanyProfile(companyId: string, name?: string, phone?: string, logoUrl?: string) {
    return this.platformRepository.updateCompany(companyId, {
      ...(name && { name }),
      ...(phone && { phone }),
      ...(logoUrl && { logoUrl }),
    });
  }

  async setSetting(companyId: string, key: string, value: string, category?: string) {
    return this.platformRepository.setCompanySetting(companyId, key, value, category);
  }
}
