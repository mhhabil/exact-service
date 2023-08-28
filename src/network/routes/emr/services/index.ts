import { SimrsService as SService } from './simrs';
import { ElasticLoggerService as ELService } from './elastic-logger.service';

export function SimrsService() {
  return new SService();
}

export function ElasticLoggerService() {
  return new ELService();
}
