import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/admin-auth';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const isAuthed = await verifyAdminRequest(request);
  if (!isAuthed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ninety = new Date(Date.now() - 90 * 86400000).toISOString().split('T')[0];
  const twentyEight = new Date(Date.now() - 28 * 86400000).toISOString().split('T')[0];
  const thirty = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];

  const [snapResult, workoutResult, responseResult] = await Promise.all([
    supabase
      .from('whoop_daily_snapshots')
      .select('*')
      .order('date', { ascending: true })
      .gte('date', ninety),
    supabase
      .from('whoop_workouts')
      .select('*')
      .order('date', { ascending: true })
      .gte('date', twentyEight),
    supabase
      .from('coach_responses')
      .select('*')
      .order('created_at', { ascending: false })
      .gte('date', thirty),
  ]);

  if (snapResult.error) {
    return NextResponse.json({ error: 'Failed to fetch snapshots' }, { status: 500 });
  }

  return NextResponse.json({
    snapshots: snapResult.data || [],
    workouts: workoutResult.data || [],
    responses: responseResult.data || [],
    generatedAt: new Date().toISOString(),
  });
}
