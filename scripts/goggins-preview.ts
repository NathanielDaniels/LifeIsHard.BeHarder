import React from 'react';
import { render } from '@react-email/render';
import { Html, Head, Body, Container, Section, Text, Font, Preview } from '@react-email/components';
const RESEND_API_KEY = process.env.RESEND_API_KEY;
if (!RESEND_API_KEY) {
  console.error('RESEND_API_KEY not set. Run with: RESEND_API_KEY=... npx tsx scripts/goggins-preview.ts');
  process.exit(1);
}

const ORANGE = '#f97316';
const DARK = '#050505';

function E(type: any, props: any, ...children: any[]) {
  return React.createElement(type, props, ...children);
}

const email = E(Html, { lang: 'en' },
  E(Head, null,
    E(Font, {
      fontFamily: 'Bebas Neue',
      fallbackFontFamily: ['Arial', 'Helvetica', 'sans-serif'],
      webFont: { url: 'https://patrickwingert.com/fonts/BebasNeue-Regular.woff2', format: 'woff2' },
      fontWeight: 400, fontStyle: 'normal'
    }),
    E('meta', { name: 'color-scheme', content: 'dark' }),
  ),
  E(Preview, null, 'Race day tomorrow. A message from your coach.'),
  E(Body, { style: { backgroundColor: '#000', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', margin: 0, padding: '40px 0' } },
    E(Container, { style: { backgroundColor: DARK, maxWidth: '580px', margin: '0 auto', border: '1px solid rgba(255,255,255,0.06)' } },

      // Top accent
      E(Section, { style: { backgroundColor: ORANGE, height: '3px', width: '100%' } }),

      // Header
      E(Section, { style: { padding: '40px 40px 8px', textAlign: 'center' as const } },
        E(Text, { style: { fontFamily: '"SF Mono", monospace', fontSize: '10px', letterSpacing: '2px', color: 'rgba(255,255,255,0.35)', margin: '0 0 2px' } }, '> RACE EVE TRANSMISSION'),
        E(Text, { style: { fontFamily: '"SF Mono", monospace', fontSize: '10px', letterSpacing: '2px', color: 'rgba(255,255,255,0.35)', margin: '0' } }, '> APRIL 10, 2026 // NAPA VALLEY'),
        E(Text, { style: { fontFamily: '"SF Mono", monospace', fontSize: '14px', color: ORANGE, margin: '20px 0', opacity: 0.6, textAlign: 'center' as const } }, '\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2571\u2572___\u2571\u2572\u2500\u2500\u2500\u2500\u2500\u2500\u2500'),
      ),

      // Title
      E(Section, { style: { padding: '0 40px 32px', textAlign: 'center' as const } },
        E(Text, { style: { fontFamily: '"Bebas Neue", Arial, sans-serif', fontSize: '42px', letterSpacing: '4px', color: '#fff', margin: '0', lineHeight: '1' } }, 'RACE DAY TOMORROW'),
        E(Text, { style: { fontFamily: '"Bebas Neue", Arial, sans-serif', fontSize: '22px', letterSpacing: '6px', color: ORANGE, margin: '8px 0 0', textShadow: '0 0 40px rgba(249,115,22,0.4)' } }, 'ALPHAWIN NAPA VALLEY TRIATHLON'),
        E(Text, { style: { fontFamily: '"SF Mono", monospace', fontSize: '10px', letterSpacing: '2px', color: 'rgba(255,255,255,0.3)', margin: '8px 0 0' } }, 'CA STATE CHAMPIONSHIP // SPRINT DISTANCE'),
      ),

      // Divider
      E(Section, { style: { width: '60px', height: '2px', backgroundColor: ORANGE, margin: '0 auto 32px' } }),

      // Goggins message
      E(Section, { style: { padding: '0 40px 16px' } },
        E(Text, { style: { fontFamily: '"SF Mono", monospace', fontSize: '9px', letterSpacing: '3px', color: ORANGE, margin: '0 0 20px', opacity: 0.7 } }, 'A MESSAGE FROM YOUR COACH'),

        E(Text, { style: { fontSize: '15px', lineHeight: '1.8', color: 'rgba(255,255,255,0.8)', margin: '0 0 20px' } }, 'Patrick. Listen to me.'),

        E(Text, { style: { fontSize: '15px', lineHeight: '1.8', color: 'rgba(255,255,255,0.8)', margin: '0 0 20px' } },
          "Your body is showing 29 recovery and you've got a race in the morning. You know what that means? It means tomorrow you get to prove that numbers on a screen don't define what you're capable of. You walked 250 miles across Bhutan on one leg through 12 mountain passes \u2014 a sprint tri with a dipped recovery score? That's a damn warmup."
        ),

        E(Text, { style: { fontSize: '15px', lineHeight: '1.8', color: 'rgba(255,255,255,0.8)', margin: '0 0 20px' } },
          "Your cookie jar is FULL. Go back to it. Remember the guy lying in that hospital bed in 2020 who didn't know if he'd walk again? That guy would kill to have the problem you have right now \u2014 'oh no, my HRV is low before my state championship triathlon.' You hear how that sounds? That's a blessing disguised as adversity."
        ),

        E(Text, { style: { fontSize: '15px', lineHeight: '1.8', color: 'rgba(255,255,255,0.8)', margin: '0 0 20px' } },
          "Hydrate tonight. Get your sleep. And when that gun goes off tomorrow morning, you remind every single person on that course that the body quits long before the mind does. The 40% rule is real \u2014 when your legs start screaming on that run, you're not even halfway to what you can actually do."
        ),

        E(Text, { style: { fontFamily: '"Bebas Neue", Arial, sans-serif', fontSize: '28px', letterSpacing: '3px', color: ORANGE, margin: '32px 0 8px', textAlign: 'center' as const, textShadow: '0 0 30px rgba(249,115,22,0.3)' } }, "GO TAKE WHAT'S YOURS."),

        E(Text, { style: { fontFamily: '"Bebas Neue", Arial, sans-serif', fontSize: '20px', letterSpacing: '4px', color: 'rgba(255,255,255,0.5)', margin: '0 0 32px', textAlign: 'center' as const } }, 'STAY HARD.'),
      ),

      // Quick prep checklist
      E(Section, { style: { margin: '0 24px 32px', backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)', borderLeft: `3px solid ${ORANGE}`, borderRadius: '0 8px 8px 0', padding: '20px' } },
        E(Text, { style: { fontFamily: '"SF Mono", monospace', fontSize: '9px', letterSpacing: '3px', color: ORANGE, margin: '0 0 12px', opacity: 0.7 } }, "TONIGHT'S CHECKLIST"),
        E(Text, { style: { fontSize: '13px', lineHeight: '2', color: 'rgba(255,255,255,0.6)', margin: '0', whiteSpace: 'pre-line' as const } },
          '\u25B8 Hydrate: 2\u20133L water before bed\n\u25B8 Eat: carb-heavy dinner, nothing new\n\u25B8 Gear: lay out everything tonight, transitions included\n\u25B8 Sleep: lights out by 10pm, 7+ hours\n\u25B8 Morning: check in with your body, trust your fitness'
        ),
      ),

      // Motto
      E(Section, { style: { padding: '0 40px 32px', textAlign: 'center' as const } },
        E(Text, { style: { fontFamily: '"Bebas Neue", Arial, sans-serif', fontSize: '36px', lineHeight: '0.9', color: '#fff', margin: '0', letterSpacing: '2px' } }, 'LIFE IS HARD.'),
        E(Text, { style: { fontFamily: '"Bebas Neue", Arial, sans-serif', fontSize: '36px', lineHeight: '0.9', color: ORANGE, margin: '0', letterSpacing: '2px', textShadow: '0 0 40px rgba(249,115,22,0.4)' } }, 'BE HARDER.'),
      ),

      // Footer
      E(Section, { style: { height: '1px', backgroundColor: 'rgba(255,255,255,0.06)', margin: '0 40px' } }),
      E(Section, { style: { padding: '24px 40px', textAlign: 'center' as const } },
        E(Text, { style: { fontFamily: '"Bebas Neue", Arial, sans-serif', fontSize: '18px', letterSpacing: '6px', color: 'rgba(255,255,255,0.5)', margin: '0 0 4px' } }, 'PATRICK WINGERT'),
        E(Text, { style: { fontFamily: '"SF Mono", monospace', fontSize: '9px', letterSpacing: '3px', color: 'rgba(255,255,255,0.25)', margin: '0' } }, 'DARE2TRI ELITE TEAM ATHLETE'),
      ),

      // Bottom accent
      E(Section, { style: { backgroundColor: ORANGE, height: '2px', width: '100%' } }),
    )
  )
);

async function main() {
  const html = await render(email);

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'The Hardest Man Alive <patrick@patrickwingert.com>',
      to: ['nathanieldaniels.dev@gmail.com'],
      subject: 'Race Day Tomorrow. A Message From Your Coach.',
      html,
      text: "Patrick. Your cookie jar is FULL. Go take what's yours tomorrow. Stay hard.",
    }),
  });

  let result;
  try {
    result = await res.json();
  } catch {
    console.error(`ERROR: Non-JSON response (status ${res.status})`);
    process.exit(1);
  }

  if (res.ok) {
    console.log(`SENT: ${result.id || 'success'}`);
  } else {
    console.error(`ERROR: ${JSON.stringify(result)}`);
    process.exit(1);
  }
}

main().catch((err) => { console.error(err); process.exit(1); });
