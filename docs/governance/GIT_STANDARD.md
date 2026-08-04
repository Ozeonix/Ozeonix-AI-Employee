# Git Workflow & Conventional Commit Standards

## 1. Branching Strategy
- `main`: Production-ready release branch.
- `develop`: Staging & integration branch.
- `feature/<short-description>`: New feature branches.
- `bugfix/<issue-description>`: Hotfix branches.

## 2. Conventional Commits
All commit messages MUST follow the Conventional Commits specification:
```
<type>(<scope>): <short description>
```
Types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes only
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `test`: Adding or correcting tests
- `chore`: Maintenance tasks, dependency updates

Example: `feat(auth): add API key hashing and revocation endpoint`

## 3. Semantic Versioning (SemVer)
- `MAJOR` version: Breaking architectural changes or phase milestone shifts.
- `MINOR` version: New backwards-compatible features.
- `PATCH` version: Backwards-compatible bug fixes.
