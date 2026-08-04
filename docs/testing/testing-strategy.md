# Testing Strategy & Quality Assurance

## Principles
- **Unit Testing**: Test individual domain services, helper classes, and middleware logic with isolated mocks using Jest.
- **Integration Testing**: Test real HTTP requests against Express routes with Supertest.
- **Coverage Goal**: Maintain >= 80% line and branch coverage across all core modules.

## Commands
```bash
npm test
npm run test:coverage
```
