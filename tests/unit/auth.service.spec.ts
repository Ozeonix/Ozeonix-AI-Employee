import { AuthService } from '../../src/modules/auth/AuthService.js';
import { AuthRepository } from '../../src/modules/auth/AuthRepository.js';
import { ConflictError, UnauthorizedError } from '../../src/shared/errors/AppError.js';
import bcrypt from 'bcryptjs';

jest.mock('../../src/modules/auth/AuthRepository.js');
jest.mock('bcryptjs');

describe('AuthService Unit Tests', () => {
  let authService: AuthService;
  let mockAuthRepo: jest.Mocked<AuthRepository>;

  beforeEach(() => {
    mockAuthRepo = new AuthRepository() as jest.Mocked<AuthRepository>;
    authService = new AuthService(mockAuthRepo);
  });

  it('should throw ConflictError if company slug already exists during registration', async () => {
    mockAuthRepo.findCompanyBySlug.mockResolvedValue({ id: 'comp-1' } as any);

    await expect(
      authService.register({
        companyName: 'Acme',
        companySlug: 'acme',
        email: 'test@acme.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      })
    ).rejects.toThrow(ConflictError);
  });

  it('should throw UnauthorizedError on invalid login password', async () => {
    mockAuthRepo.findUserByEmail.mockResolvedValue({
      id: 'user-1',
      passwordHash: 'hashed',
      status: 'ACTIVE',
      deletedAt: null,
    } as any);

    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      authService.login({
        email: 'test@acme.com',
        password: 'wrongpassword',
      })
    ).rejects.toThrow(UnauthorizedError);
  });
});
