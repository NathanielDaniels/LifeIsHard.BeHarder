// Instagram API Integration Helper
// Uses the "Instagram API with Instagram Login" (Graph-based) endpoints.
// NOTE: the old Instagram Basic Display API was shut down Dec 4, 2024 — do not use it.
// Docs: https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login
//
// Requires a server-only INSTAGRAM_ACCESS_TOKEN (long-lived, 60 days, self-refreshing).
// Never expose this as NEXT_PUBLIC_* — it would leak into the browser bundle.

const GRAPH_VERSION = 'v25.0';
const GRAPH_BASE = `https://graph.instagram.com/${GRAPH_VERSION}`;
// refresh_access_token lives on the unversioned host
const REFRESH_BASE = 'https://graph.instagram.com';
const PROFILE_URL = 'https://www.instagram.com/patwingit';

type IgMediaType = 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';

interface IgApiPost {
  id: string;
  caption?: string;
  media_type: IgMediaType;
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  timestamp: string;
}

interface IgApiResponse {
  data?: IgApiPost[];
  error?: { message?: string; code?: number };
}

// Normalized shape consumed by the InstagramFeed component.
export interface FeedPost {
  id: string;
  image: string; // displayable cover: video poster frame, carousel first child, or photo
  caption: string;
  permalink: string;
  isVideo: boolean;
  timeLabel: string; // relative age, e.g. "3h", "2d", "1w"
}

/** Compact relative-age label. Computed server-side at fetch time (cached 30m). */
function relativeLabel(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const seconds = Math.max(0, (Date.now() - then) / 1000);
  const DAY = 86400;
  if (seconds < 3600) return `${Math.max(1, Math.floor(seconds / 60))}m`;
  if (seconds < DAY) return `${Math.floor(seconds / 3600)}h`;
  if (seconds < DAY * 7) return `${Math.floor(seconds / DAY)}d`;
  if (seconds < DAY * 30) return `${Math.floor(seconds / (DAY * 7))}w`;
  if (seconds < DAY * 365) return `${Math.floor(seconds / (DAY * 30))}mo`;
  return `${Math.floor(seconds / (DAY * 365))}y`;
}

function normalize(post: IgApiPost): FeedPost {
  const isVideo = post.media_type === 'VIDEO';
  // Videos expose only an .mp4 in media_url (not <img>-renderable), so we need
  // thumbnail_url for the poster frame. Carousels return the first child's image
  // in media_url, which is exactly the cover we want. Photos use media_url.
  const image = isVideo ? (post.thumbnail_url ?? '') : (post.media_url ?? '');
  return {
    id: post.id,
    image,
    caption: post.caption?.trim() ?? '',
    permalink: post.permalink ?? PROFILE_URL,
    isVideo,
    timeLabel: relativeLabel(post.timestamp),
  };
}

/**
 * Fetch recent posts from Patrick's Instagram professional account.
 * Returns [] on any failure — the caller is responsible for fallback UI.
 */
export async function getInstagramPosts(limit = 6): Promise<FeedPost[]> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) {
    console.warn('[instagram] INSTAGRAM_ACCESS_TOKEN not configured');
    return [];
  }

  const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
  // Token goes in the Authorization header, never the query string, so it can't
  // leak into Vercel/Node request logs. The Next Data Cache (next.revalidate) holds
  // the upstream response for 30 min so we never approach the Instagram rate limit.
  const url = `${GRAPH_BASE}/me/media?fields=${fields}&limit=${limit}`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 1800 },
    });
    const json: IgApiResponse = await res.json();

    if (!res.ok || json.error) {
      console.error('[instagram] API error:', json.error?.message ?? `HTTP ${res.status}`);
      return [];
    }

    // Drop anything without a renderable cover (e.g. a video missing its thumbnail).
    return (json.data ?? []).map(normalize).filter((p) => p.image);
  } catch (error) {
    console.error('[instagram] fetch failed:', error);
    return [];
  }
}

/**
 * Refresh a long-lived Instagram access token.
 * Long-lived tokens expire after 60 days; refresh once they're >24h old.
 * Returns the new token, or null on failure.
 */
export async function refreshInstagramToken(currentToken: string): Promise<string | null> {
  try {
    const url = `${REFRESH_BASE}/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(currentToken)}`;
    const res = await fetch(url);
    if (!res.ok) {
      console.error('[instagram] token refresh failed: HTTP', res.status);
      return null;
    }
    const data = await res.json();
    return data.access_token ?? null;
  } catch (error) {
    console.error('[instagram] token refresh error:', error);
    return null;
  }
}
