import type { Metadata } from 'next';
import SchedulePage from '@/components/sections/SchedulePage';

export const metadata: Metadata = {
  title: 'Race Schedule | Patrick Wingert',
  description: '2026 race calendar. The road to USA Para Triathlon National Championships.',
};

export default function Schedule() {
  return <SchedulePage />;
}
