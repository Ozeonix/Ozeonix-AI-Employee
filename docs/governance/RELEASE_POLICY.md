# Release Management & Deprecation Policy

## 1. Release Lifecycle
- **Alpha**: Internal development releases.
- **Beta**: Staging releases for tenant testing.
- **GA (General Availability)**: Production releases tagged with SemVer (e.g. `v1.0.0`).

## 2. Deprecation Policy
- APIs targeted for deprecation must be marked with `@deprecated` tags and HTTP headers (`Sunset: <date>`).
- Minimum 90-day grace period required before removing deprecated endpoints.
