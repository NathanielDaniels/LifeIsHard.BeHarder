import { fetchWhoopStats } from '@/lib/whoop-client';
import type { WhoopStats } from '@/types/whoop';

type WhoopStatsFetcher = (accessToken: string) => Promise<WhoopStats>;

/** Fetches WHOOP data for the current request without persisting the response. */
export function fetchFreshWhoopStats(
  accessToken: string,
  fetcher: WhoopStatsFetcher = fetchWhoopStats,
): Promise<WhoopStats> {
  return fetcher(accessToken);
}
