import type { Metadata } from 'next';
import SponsorsShowcase from '@/components/sections/SponsorsShowcase';

export const metadata: Metadata = {
  title: 'Sponsors | Patrick Wingert',
  description: 'The partners and supporters fueling the mission. Become a sponsor.',
};

export default function SponsorsPage() {
  return <SponsorsShowcase />;
}
