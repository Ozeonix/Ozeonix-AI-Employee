# Ozeonix Coding Standards & Guidelines

## 1. TypeScript Strictness
- `strict: true` must be enabled in `tsconfig.json`.
- `any` type is strictly forbidden. Use `unknown` or define explicit interfaces/types.
- Enable `noImplicitAny`, `strictNullChecks`, and `noUnusedLocals`.

## 2. Code Organization & Formatting
- Import order:
  1. Node core modules (`path`, `crypto`, `fs`)
  2. Third-party packages (`express`, `zod`, `@prisma/client`)
  3. Internal config & shared utilities (`@config`, `@shared`)
  4. Middleware (`@middleware`)
  5. Feature modules (`@modules`)
- Use ES Module `import`/`export` syntax with `.js` extensions for relative TypeScript files.

## 3. Function & Method Design
- Single Responsibility Principle (SRP): A function should do one thing well.
- Functions should not exceed 50 lines of code.
- Prefer async/await over raw Promises or callbacks.

## 4. Error Handling
- Never throw raw strings or generic `Error`. Throw custom `AppError` subclasses (`BadRequestError`, `UnauthorizedError`, `NotFoundError`, etc.).
- Never swallow exceptions in empty `catch` blocks. Always pass errors to `next(err)` or log with `logger.error()`.
