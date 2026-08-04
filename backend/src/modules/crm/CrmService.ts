import { CrmRepository } from './CrmRepository.js';
import { CreateCustomerInput, UpdateCustomerInput } from './dto/crm.dto.js';
import { NotFoundError } from '../../shared/errors/AppError.js';

export class CrmService {
  private crmRepository: CrmRepository;

  constructor(crmRepository = new CrmRepository()) {
    this.crmRepository = crmRepository;
  }

  public async create(tenantId: string, input: CreateCustomerInput) {
    return this.crmRepository.createCustomer(tenantId, input);
  }

  public async update(id: string, tenantId: string, input: UpdateCustomerInput) {
    const customer = await this.crmRepository.findCustomerById(id, tenantId);
    if (!customer) {
      throw new NotFoundError('Customer not found');
    }
    return this.crmRepository.updateCustomer(id, tenantId, input);
  }

  public async getById(id: string, tenantId: string) {
    const customer = await this.crmRepository.findCustomerById(id, tenantId);
    if (!customer) {
      throw new NotFoundError('Customer not found');
    }
    return customer;
  }

  public async search(tenantId: string, filters: { query?: string; status?: string; page: number; limit: number }) {
    return this.crmRepository.searchCustomers(tenantId, filters);
  }

  public async delete(id: string, tenantId: string) {
    const customer = await this.crmRepository.findCustomerById(id, tenantId);
    if (!customer) {
      throw new NotFoundError('Customer not found');
    }
    return this.crmRepository.softDeleteCustomer(id, tenantId);
  }
}
