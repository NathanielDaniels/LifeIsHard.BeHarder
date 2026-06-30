import { NextResponse } from 'next/server';
import { getInstagramPosts } from '@/lib/instagram';

// This handler reads searchParams, so it's dynamic — caching is handled by the
// CDN via the Cache-Control header below, and upstream by the Data Cache in
// getInstagramPosts(). No route-segment `revalidate` (it would be a no-op here).

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requested = Number(searchParams.get('limit'));
  const limit = Number.isFinite(requested) && requested > 0 ? Math.min(requested, 25) : 6;

  const posts = await getInstagramPosts(limit);

  return NextResponse.json(
    { posts },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
      },
    }
  );
}
