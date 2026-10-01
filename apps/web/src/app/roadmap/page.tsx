import type { Metadata } from 'next';
import React from 'react';
import { RoadmapView } from '@/components/roadmap/roadmap-view';

export const metadata: Metadata = {
  title: 'Roadmap & Architecture Plan | ScrollCraft',
  description:
    'The certified engineering roadmap for ScrollCraft. Explore active v0.2.0 Beta production verification and upcoming v0.3.0 architectural milestones.',
};

export default function RoadmapPage() {
  return <RoadmapView />;
}
