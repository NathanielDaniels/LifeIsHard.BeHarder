import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { rateLimit, getClientIP, rateLimitResponse } from '@/lib/rate-limit';

// Lazy-init so build doesn't crash when env vars are missing
let _resend: Resend | null = null;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}
function getAudienceId() {
  const id = process.env.RESEND_AUDIENCE_ID;
  if (!id) throw new Error('RESEND_AUDIENCE_ID is not set');
  return id;
}

// Max email length (RFC 5321)
const MAX_EMAIL_LENGTH = 254;
// Max payload size (1KB)
const MAX_PAYLOAD_SIZE = 1024;

export async function POST(request: NextRequest) {
  // --- Rate Limiting: 5 requests/minute per IP ---
  const ip = getClientIP(request);
  const { success, resetAt } = rateLimit(ip, 5, 60 * 1000);
  if (!success) {
    return rateLimitResponse(resetAt);
  }

  try {
    // --- Payload size check ---
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > MAX_PAYLOAD_SIZE) {
      return NextResponse.json(
        { error: 'Request too large.' },
        { status: 413 }
      );
    }

    const body = await request.json();

    // --- Honeypot check (bot trap) ---
    if (body.website) {
      return NextResponse.json(
        { message: "You're in. We'll let you know when it drops." },
        { status: 201 }
      );
    }

    const rawEmail = body.email;

    // --- Input validation ---
    if (!rawEmail || typeof rawEmail !== 'string') {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // Sanitize: trim, lowercase, enforce max length
    const email = rawEmail.trim().toLowerCase().slice(0, MAX_EMAIL_LENGTH);

    // Validate format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // Reject suspicious patterns
    if (/<|>|javascript:|data:|on\w+=/i.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address.' },
        { status: 400 }
      );
    }

    // --- Add contact to Resend Audience ---
    const { error } = await getResend().contacts.create({
      email,
      audienceId: getAudienceId(),
    });

    if (error) {
      // Resend returns a specific error when the contact already exists
      if (error.message?.includes('already exists')) {
        return NextResponse.json(
          { message: "You're already on the list." },
          { status: 200 }
        );
      }

      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Something went wrong. Try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "You're in. We'll let you know when it drops." },
      { status: 201 }
    );
  } catch (err) {
    console.error('Subscribe error:', err);
    return NextResponse.json(
      { error: `Debug Error: ${err instanceof Error ? err.message : String(err)}` },
      { status: 500 }
    );
  }
}


export async function GET() {
  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  try {
    if (!apiKey) throw new Error('Missing RESEND_API_KEY');
    
    const resend = new Resend(apiKey);
    const { data, error } = await resend.audiences.list();
    
    return NextResponse.json({
      status: 'ok',
      env: {
        hasApiKey: !!apiKey,
        hasAudienceId: !!audienceId,
        // Show partial ID to verify it matches
        audienceIdHint: audienceId ? `${audienceId.substring(0, 7)}...` : null
      },
      audiences: data,
      resendError: error
    });
  } catch (err) {
    return NextResponse.json({ 
      status: 'error', 
      message: String(err),
      env: {
        hasApiKey: !!apiKey,
        hasAudienceId: !!audienceId
      }
    }, { status: 500 });
  }
}

