// ============================================
// POST /api/whoop/webhook
// Receives webhook events from WHOOP
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { WhoopWebhookPayload } from '@/types/whoop';
import { invalidateCache } from '@/lib/whoop-cache';
import { getValidAccessToken } from '@/lib/whoop-token-storage';
import { saveAllWorkouts } from '@/lib/whoop-history';
import { rateLimit, getClientIP, rateLimitResponse } from '@/lib/rate-limit';
import crypto from 'crypto';

const MAX_PAYLOAD_SIZE = 100 * 1024; // 100KB

export async function POST(request: NextRequest) {
  const ip = getClientIP(request);
  const { success, resetAt } = rateLimit(`webhook:${ip}`, 60, 60 * 1000);
  if (!success) return rateLimitResponse(resetAt);

  try {
    // Payload size check
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > MAX_PAYLOAD_SIZE) {
      return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
    }

    const body = await request.text();
    if (body.length > MAX_PAYLOAD_SIZE) {
      return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
    }

    // Signature verification
    const webhookSecret = process.env.WHOOP_WEBHOOK_SECRET;
    const signature = request.headers.get('x-whoop-signature');

    if (webhookSecret) {
      if (!signature) {
        console.error('[webhook] Missing signature');
        return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
      }
      if (!verifySignature(body, signature, webhookSecret)) {
        console.error('[webhook] Invalid signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    // Parse payload
    let payload: WhoopWebhookPayload;
    try {
      payload = JSON.parse(body);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    if (!payload.type || !payload.user_id) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    console.log(`[webhook] Received: ${payload.type}`, {
      userId: payload.user_id,
      resourceId: payload.id,
      timestamp: payload.timestamp,
    });

    // Respond to WHOOP immediately - do the async work after
    // (Vercel will keep the function alive long enough to finish)
    const processingPromise = handleWebhookEvent(payload);

    // Return success fast so WHOOP doesn't retry
    const response = NextResponse.json({ received: true });

    // Await processing in background (Next.js edge keeps fn alive)
    await processingPromise;

    return response;
  } catch (error) {
    console.error('[webhook] Unexpected error:', error);
    // Always 200 to prevent WHOOP from retrying indefinitely
    return NextResponse.json({ received: true, error: 'Processing failed' });
  }
}

async function handleWebhookEvent(payload: WhoopWebhookPayload): Promise<void> {
  switch (payload.type) {
    case 'workout.updated': {
      console.log(`[webhook] Workout updated: ${payload.id}`);
      // Save all recent workouts to Supabase so the coach briefing sees every activity.
      // Uses upsert on whoop_workout_id so duplicates are harmless.
      const token = await getValidAccessToken();
      if (token) {
        const result = await saveAllWorkouts(token);
        console.log(`[webhook] Saved ${result.saved} workout(s)`, result.errors.length ? result.errors : '');
      } else {
        console.error('[webhook] No valid access token — cannot save workouts');
      }
      break;
    }
    // case 'sleep.updated':
    //   console.log(`[webhook] Sleep updated: ${payload.id}`);
    //   break;
    case 'recovery.updated':
      console.log(`[webhook] Recovery updated: ${payload.id}`);
      break;
    default:
      console.log(`[webhook] Unhandled type: ${payload.type}`);
  }

  // Invalidate the Supabase cache so next /api/whoop/stats call
  // fetches fresh data. This is now Supabase-backed so it works
  // across all serverless instances.
  await invalidateCache();
  console.log(`[webhook] Cache invalidated after ${payload.type}`);
}

function verifySignature(body: string, signature: string, secret: string): boolean {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false; // Lengths don't match
  }
}

// GET for WHOOP webhook verification challenge
export async function GET(request: NextRequest) {
  const challenge = request.nextUrl.searchParams.get('challenge');
  if (challenge) {
    const sanitized = challenge.replace(/[^a-zA-Z0-9_-]/g, '');
    return NextResponse.json({ challenge: sanitized });
  }
  return NextResponse.json({ status: 'Webhook endpoint active' });
}


// // ============================================
// // POST /api/whoop/webhook
// // Receives webhook events from WHOOP
// // ============================================

// import { NextRequest, NextResponse } from 'next/server';
// import { WhoopWebhookPayload } from '@/types/whoop';
// import { invalidateCache } from '@/lib/whoop-cache';
// import { rateLimit, getClientIP, rateLimitResponse } from '@/lib/rate-limit';
// import crypto from 'crypto';

// // Max webhook payload size (100KB)
// const MAX_PAYLOAD_SIZE = 100 * 1024;

// export async function POST(request: NextRequest) {
//   // --- Rate Limiting: 60 requests/minute ---
//   const ip = getClientIP(request);
//   const { success, resetAt } = rateLimit(`webhook:${ip}`, 60, 60 * 1000);
//   if (!success) return rateLimitResponse(resetAt);

//   try {
//     // --- Payload size check ---
//     const contentLength = request.headers.get('content-length');
//     if (contentLength && parseInt(contentLength) > MAX_PAYLOAD_SIZE) {
//       return NextResponse.json(
//         { error: 'Payload too large' },
//         { status: 413 }
//       );
//     }

//     // Get the raw body for signature verification
//     const body = await request.text();

//     // Extra safety: check actual body size
//     if (body.length > MAX_PAYLOAD_SIZE) {
//       return NextResponse.json(
//         { error: 'Payload too large' },
//         { status: 413 }
//       );
//     }

//     const signature = request.headers.get('x-whoop-signature');
    
//     // Verify webhook signature
//     const webhookSecret = process.env.WHOOP_WEBHOOK_SECRET;
//     if (webhookSecret) {
//       // Secret is configured - signature is REQUIRED
//       if (!signature) {
//         console.error('Missing webhook signature');
//         return NextResponse.json(
//           { error: 'Missing signature' },
//           { status: 401 }
//         );
//       }

//       const isValid = verifySignature(body, signature, webhookSecret);
//       if (!isValid) {
//         console.error('Invalid webhook signature');
//         return NextResponse.json(
//           { error: 'Invalid signature' },
//           { status: 401 }
//         );
//       }
//     }
    
//     // Parse the webhook payload
//     let payload: WhoopWebhookPayload;
//     try {
//       payload = JSON.parse(body);
//     } catch {
//       return NextResponse.json(
//         { error: 'Invalid JSON' },
//         { status: 400 }
//       );
//     }

//     // Validate payload has required fields
//     if (!payload.type || !payload.user_id) {
//       return NextResponse.json(
//         { error: 'Invalid payload' },
//         { status: 400 }
//       );
//     }
    
//     console.log(`Received WHOOP webhook: ${payload.type}`, {
//       userId: payload.user_id,
//       resourceId: payload.id,
//       timestamp: payload.timestamp,
//     });
    
//     // Handle different event types
//     switch (payload.type) {
//       case 'workout.updated':
//         await handleWorkoutUpdate(payload);
//         break;
        
//       case 'sleep.updated':
//         await handleSleepUpdate(payload);
//         break;
        
//       case 'recovery.updated':
//         await handleRecoveryUpdate(payload);
//         break;
        
//       default:
//         console.log(`Unhandled webhook type: ${payload.type}`);
//     }
    
//     // Always invalidate cache to force fresh fetch
//     invalidateCache();
    
//     // Return success quickly (WHOOP expects fast response)
//     return NextResponse.json({ received: true });
    
//   } catch (error) {
//     console.error('Webhook processing error:', error);
//     // Still return 200 to prevent retries for parse errors
//     return NextResponse.json({ received: true, error: 'Processing failed' });
//   }
// }

// // ============================================
// // Webhook Handlers
// // ============================================

// async function handleWorkoutUpdate(payload: WhoopWebhookPayload) {
//   console.log(`Workout updated: ${payload.id}`);
// }

// async function handleSleepUpdate(payload: WhoopWebhookPayload) {
//   console.log(`Sleep updated: ${payload.id}`);
// }

// async function handleRecoveryUpdate(payload: WhoopWebhookPayload) {
//   console.log(`Recovery updated: ${payload.id}`);
// }

// // ============================================
// // Signature Verification
// // ============================================

// function verifySignature(
//   body: string,
//   signature: string,
//   secret: string
// ): boolean {
//   const expectedSignature = crypto
//     .createHmac('sha256', secret)
//     .update(body)
//     .digest('hex');
    
//   // Use timing-safe comparison
//   try {
//     return crypto.timingSafeEqual(
//       Buffer.from(signature),
//       Buffer.from(expectedSignature)
//     );
//   } catch {
//     // Lengths don't match
//     return false;
//   }
// }

// // ============================================
// // Webhook Verification (GET for WHOOP setup)
// // ============================================

// export async function GET(request: NextRequest) {
//   // WHOOP may send a verification request
//   const challenge = request.nextUrl.searchParams.get('challenge');
  
//   if (challenge) {
//     // Sanitize challenge - only allow alphanumeric and basic chars
//     const sanitized = challenge.replace(/[^a-zA-Z0-9_-]/g, '');
//     return NextResponse.json({ challenge: sanitized });
//   }
  
//   return NextResponse.json({ status: 'Webhook endpoint active' });
// }
