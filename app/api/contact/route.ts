import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { rateLimit, getClientIP, rateLimitResponse } from '@/lib/rate-limit';

let _resend: Resend | null = null;
function getResend() {
  if (!_resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured');
    }
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 2000;
const MAX_PAYLOAD_SIZE = 4096;

export async function POST(request: NextRequest) {
  const ip = getClientIP(request);
  const { success, resetAt } = rateLimit(ip, 3, 60 * 1000);
  if (!success) {
    return rateLimitResponse(resetAt);
  }

  try {
    const rawBody = await request.text();
    if (rawBody.length > MAX_PAYLOAD_SIZE) {
      return NextResponse.json(
        { error: 'Request too large.' },
        { status: 413 }
      );
    }

    const body = JSON.parse(rawBody);

    if (body.website) {
      return NextResponse.json(
        { message: 'Message sent. Patrick will be in touch.' },
        { status: 201 }
      );
    }

    const name = typeof body.name === 'string' ? body.name.trim().slice(0, MAX_NAME_LENGTH) : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase().slice(0, MAX_EMAIL_LENGTH) : '';
    const message = typeof body.message === 'string' ? body.message.trim().slice(0, MAX_MESSAGE_LENGTH) : '';

    if (!name) {
      return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 });
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    if (/<|>|javascript:|data:|on\w+=/i.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    if (!message) {
      return NextResponse.json({ error: 'Please include a message.' }, { status: 400 });
    }

    const { error: emailError } = await getResend().emails.send({
      from: `Patrick Wingert Site <${process.env.RESEND_FROM_EMAIL || 'patrick@patrickwingert.com'}>`,
      to: 'patrick@patrickwingert.com',
      replyTo: email,
      subject: `Sponsor Inquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });

    if (emailError) {
      console.error('Contact email failed:', emailError);
      return NextResponse.json(
        { error: 'Something went wrong. Please try emailing directly.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Message sent. Patrick will be in touch.' },
      { status: 201 }
    );
  } catch (err) {
    console.error('Contact error:', err);
    return NextResponse.json(
      { error: 'Something went wrong. Please try emailing directly.' },
      { status: 500 }
    );
  }
}
