import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAccess, adminUnauthorizedResponse } from '@/lib/admin-auth';
import { supabase } from '@/lib/supabase';

// GET — fetch recent coach responses (for pipeline to inject into briefing)
// Protected by admin secret, same as /api/whoop/history
export async function GET(request: NextRequest) {
  if (!verifyAdminAccess(request)) {
    return adminUnauthorizedResponse();
  }

  const { searchParams } = new URL(request.url);
  const since = searchParams.get('since') || new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from('coach_responses')
    .select('*')
    .gte('created_at', since)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ responses: data || [] });
}
