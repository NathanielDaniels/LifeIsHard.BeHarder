import type { Metadata } from 'next';
import TeamShowcase from '@/components/sections/TeamShowcase';

export const metadata: Metadata = {
  title: 'Team | Patrick Wingert',
  description: 'The team behind the mission.',
};

export default function TeamPage() {
  return <TeamShowcase />;
}
