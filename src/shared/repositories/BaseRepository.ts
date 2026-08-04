export interface IBaseRepository<T> {
  findById(id: string, tenantId?: string): Promise<T | null>;
  findMany(filter?: any, tenantId?: string): Promise<T[]>;
  create(data: any, tenantId?: string): Promise<T>;
  update(id: string, data: any, tenantId?: string): Promise<T>;
  softDelete(id: string, tenantId?: string): Promise<boolean>;
}
