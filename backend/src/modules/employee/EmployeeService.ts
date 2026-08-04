import { EmployeeRepository } from './EmployeeRepository.js';
import { CreateEmployeeInput, UpdateEmployeeInput } from './dto/employee.dto.js';
import { prisma } from '../../config/database.js';
import { hashPassword } from '../../utils/password.js';
import { NotFoundError, ConflictError } from '../../shared/errors/AppError.js';

export class EmployeeService {
  private employeeRepository: EmployeeRepository;

  constructor(employeeRepository = new EmployeeRepository()) {
    this.employeeRepository = employeeRepository;
  }

  public async create(tenantId: string, input: CreateEmployeeInput) {
    const existingUser = await prisma.user.findUnique({ where: { email: input.email } });
    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    const passwordHash = await hashPassword(input.password);
    const employeeCode = `EMP-${Math.floor(1000 + Math.random() * 9000)}`;

    return prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          companyId: tenantId,
          tenantId,
          email: input.email,
          passwordHash,
          firstName: input.firstName,
          lastName: input.lastName,
          status: 'ACTIVE',
          emailVerified: true,
        },
      });

      const employee = await tx.employee.create({
        data: {
          companyId: tenantId,
          tenantId,
          userId: user.id,
          employeeCode,
          department: input.department,
          designation: input.designation,
          role: input.role,
          status: 'ACTIVE',
        },
        include: { user: true },
      });

      return employee;
    });
  }

  public async list(tenantId: string) {
    return this.employeeRepository.listEmployees(tenantId);
  }

  public async getById(id: string, tenantId: string) {
    const emp = await this.employeeRepository.findEmployeeById(id, tenantId);
    if (!emp) {
      throw new NotFoundError('Employee record not found');
    }
    return emp;
  }

  public async update(id: string, tenantId: string, input: UpdateEmployeeInput) {
    const emp = await this.employeeRepository.findEmployeeById(id, tenantId);
    if (!emp) {
      throw new NotFoundError('Employee record not found');
    }
    return this.employeeRepository.updateEmployee(id, tenantId, input);
  }

  public async logActivity(tenantId: string, userId: string, action: string, details: any) {
    return this.employeeRepository.logActivity(tenantId, userId, action, details);
  }
}
