import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { rateLimit, getClientIP, rateLimitResponse } from '@/lib/rate-limit';

const SUBSCRIBERS_FILE = path.join(process.cwd(), 'data', 'subscribers.json');

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
    // If `website` field is filled, it's a bot — real form doesn't have this field
    if (body.website) {
      // Silently accept to not tip off bots
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

    // Reject suspicious patterns (script injection attempts)
    if (/<|>|javascript:|data:|on\w+=/i.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address.' },
        { status: 400 }
      );
    }

    // --- Store subscriber ---
    let subscribers: { email: string; subscribedAt: string }[] = [];
    try {
      const data = await fs.readFile(SUBSCRIBERS_FILE, 'utf-8');
      subscribers = JSON.parse(data);
    } catch {
      // File doesn't exist yet — start fresh
      await fs.mkdir(path.dirname(SUBSCRIBERS_FILE), { recursive: true });
    }

    if (subscribers.some((s) => s.email === email)) {
      return NextResponse.json(
        { message: "You're already on the list." },
        { status: 200 }
      );
    }

    subscribers.push({
      email,
      subscribedAt: new Date().toISOString(),
    });

    await fs.writeFile(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2));

    return NextResponse.json(
      { message: "You're in. We'll let you know when it drops." },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong. Try again.' },
      { status: 500 }
    );
  }
}
