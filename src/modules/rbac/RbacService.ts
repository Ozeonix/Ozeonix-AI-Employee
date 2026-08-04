import crypto from 'crypto';
import { RbacRepository } from './RbacRepository.js';

export class RbacService {
  private rbacRepository: RbacRepository;

  constructor(rbacRepository = new RbacRepository()) {
    this.rbacRepository = rbacRepository;
  }

  async getUsers(tenantId: string) {
    return this.rbacRepository.listUsers(tenantId);
  }

  async getRoles() {
    return this.rbacRepository.listRoles();
  }

  async getPermissions() {
    return this.rbacRepository.listPermissions();
  }

  async generateApiKey(companyId: string, userId: string, name: string) {
    const rawKey = `oz_${crypto.randomBytes(24).toString('hex')}`;
    const keyPrefix = rawKey.substring(0, 7);
    const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');

    const apiKey = await this.rbacRepository.createApiKey(companyId, userId, name, keyHash, keyPrefix);

    return {
      id: apiKey.id,
      name: apiKey.name,
      keyPrefix: apiKey.keyPrefix,
      rawApiKey: rawKey, // Returned ONLY once upon creation
    };
  }

  async getApiKeys(companyId: string) {
    return this.rbacRepository.listApiKeys(companyId);
  }
}
