import { logger } from './logger.js';

export class TelemetryService {
  private static requestCounter = 0;

  public static recordRequest(route: string, statusCode: number, durationMs: number) {
    this.requestCounter++;
    logger.info(
      `📊 [Prometheus Metric] http_requests_total{route="${route}",status="${statusCode}"} ${this.requestCounter} (${durationMs}ms)`
    );
  }
}
