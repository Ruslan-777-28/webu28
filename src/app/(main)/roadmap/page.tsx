import React from 'react';
import { Metadata } from 'next';
import { RoadmapClient } from './_components/roadmap-client';

export const metadata: Metadata = {
  title: 'Roadmap | LECTOR',
  description: 'Етапи розвитку нашої екосистеми: від фундаменту до глобального інтелекту.',
};

export default function RoadmapPage() {
  return <RoadmapClient />;
}
