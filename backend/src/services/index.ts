export class HealthService {
  public getStatus() {
    return { healthy: true, uptime: process.uptime() };
  }
}
