// Instagram API Integration Helper
// Provides utilities for fetching Instagram posts via Basic Display API
// Documentation: https://developers.facebook.com/docs/instagram-basic-display-api

interface InstagramPost {
  id: string;
  caption: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  permalink: string;
  timestamp: string;
}

interface InstagramResponse {
  data: InstagramPost[];
  paging?: {
    cursors: {
      before: string;
      after: string;
    };
    next?: string;
  };
}

/**
 * Fetch recent Instagram posts
 * Requires INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_USER_ID in environment
 */
export async function getInstagramPosts(limit: number = 12): Promise<InstagramPost[]> {
  try {
    const userId = process.env.INSTAGRAM_USER_ID;
    const accessToken = process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN;

    if (!userId || !accessToken) {
      console.warn('Instagram credentials not configured');
      return getMockInstagramPosts();
    }

    const fields = 'id,caption,media_type,media_url,permalink,timestamp';
    const url = `https://graph.instagram.com/${userId}/media?fields=${fields}&access_token=${accessToken}&limit=${limit}`;

    const response = await fetch(url, {
      next: { revalidate: 1800 } // Cache for 30 minutes
    });

    if (!response.ok) {
      throw new Error(`Instagram API error: ${response.status}`);
    }

    const data: InstagramResponse = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    return getMockInstagramPosts();
  }
}

/**
 * Mock Instagram posts for development/fallback
 */
function getMockInstagramPosts(): InstagramPost[] {
  return [
    {
      id: '1',
      caption: 'Morning run complete 💪',
      media_type: 'IMAGE',
      media_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
      permalink: 'https://instagram.com/p/mock1',
      timestamp: new Date().toISOString()
    },
    {
      id: '2',
      caption: 'Training day',
      media_type: 'IMAGE',
      media_url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80',
      permalink: 'https://instagram.com/p/mock2',
      timestamp: new Date().toISOString()
    },
    {
      id: '3',
      caption: 'Push through',
      media_type: 'IMAGE',
      media_url: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=600&q=80',
      permalink: 'https://instagram.com/p/mock3',
      timestamp: new Date().toISOString()
    },
    {
      id: '4',
      caption: 'Race prep',
      media_type: 'IMAGE',
      media_url: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&q=80',
      permalink: 'https://instagram.com/p/mock4',
      timestamp: new Date().toISOString()
    },
    {
      id: '5',
      caption: 'Mountain views',
      media_type: 'IMAGE',
      media_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
      permalink: 'https://instagram.com/p/mock5',
      timestamp: new Date().toISOString()
    },
    {
      id: '6',
      caption: 'Summit day',
      media_type: 'IMAGE',
      media_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',
      permalink: 'https://instagram.com/p/mock6',
      timestamp: new Date().toISOString()
    }
  ];
}

/**
 * Refresh Instagram access token
 * Long-lived tokens expire after 60 days and need refresh
 */
export async function refreshInstagramToken(currentToken: string): Promise<string | null> {
  try {
    const url = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${currentToken}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error refreshing Instagram token:', error);
    return null;
  }
}

// Example API route implementation:
// Create /app/api/instagram/route.ts with this content:
/*
import { getInstagramPosts } from '@/lib/instagram';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '12');
  
  const posts = await getInstagramPosts(limit);
  
  return Response.json({ posts });
}
*/
