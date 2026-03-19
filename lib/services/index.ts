// ============================================
// Service Registry
// All API service providers register here.
// The cron job and admin dashboard iterate over this list.
// ============================================

import { ServiceProvider } from '@/types/api-tokens';
import { whoopService } from './whoop-service';

/**
 * All registered service providers.
 * To add a new API service:
 *   1. Create lib/services/<name>-service.ts implementing ServiceProvider
 *   2. Import and push it here
 *   3. Insert a row in api_connections table
 * The cron job and admin dashboard will pick it up automatically.
 */
const services: ServiceProvider[] = [
  whoopService,
  // Future:
  // instagramService,
  // stravaService,
];

export function getAllServices(): ServiceProvider[] {
  return services;
}

export function getService(id: string): ServiceProvider | undefined {
  return services.find(s => s.id === id);
}
