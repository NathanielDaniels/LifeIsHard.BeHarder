import type { Metadata } from 'next';
import ComingSoonClient from './coming-soon-client';
// import { Analytics } from "@vercel/analytics/next"
// import { SpeedInsights } from "@vercel/speed-insights/next"
// import { GoogleAnalytics } from '@next/third-parties/google'


export const metadata: Metadata = {
  title: 'Patrick Wingert | Coming Soon',
  description:
    'Something epic is coming. Patrick Wingert — Dare2tri Elite Team athlete, record-setting trekker. Life is Hard. Be Harder.',
};

export default function ComingSoonPage() {
  return <ComingSoonClient />;
}
