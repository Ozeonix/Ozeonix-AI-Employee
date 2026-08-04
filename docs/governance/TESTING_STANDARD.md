# Quality Assurance & Testing Standards

## 1. Test Pyramid
- **Unit Tests (60%)**: Isolated testing of Services and Utilities using mocks.
- **Integration Tests (30%)**: HTTP route integration testing with Supertest against test databases.
- **End-to-End Tests (10%)**: Full system automation flows.

## 2. Coverage Rules
- Minimum 80% line and branch coverage required before merging PRs.
- `npm test` must execute cleanly without failing assertions.
