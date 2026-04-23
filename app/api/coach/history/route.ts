import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/admin-auth';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const isAuthed = await verifyAdminRequest(request);
  if (!isAuthed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: briefings } = await supabase
    .from('daily_briefings')
    .select('date, briefing_markdown, model_used, generated_at')
    .order('date', { ascending: false })
    .limit(30);

  return NextResponse.json({
    briefings: briefings || [],
  });
}
