import React from 'react';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { TEST_REGISTRY } from '@/components/test/test-registry';
import { TestDetailView } from '@/components/test/test-detail-view';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return TEST_REGISTRY.filter((item) => item.slug !== 'robust').map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (slug === 'robust') {
    return {
      title: 'Robust Testing Lab — Fullscreen Stress Laboratory | ScrollCraft',
    };
  }
  const item = TEST_REGISTRY.find((i) => i.slug === slug);

  if (!item) {
    return {
      title: 'Item Not Found | ScrollCraft Test Lab',
    };
  }

  return {
    title: `${item.title} — Test Lab Interactive Demonstration | ScrollCraft`,
    description: item.shortDescription,
  };
}

export default async function TestDetailPage({ params }: Props) {
  const { slug } = await params;
  if (slug === 'robust') {
    redirect('/test/robust');
  }

  const item = TEST_REGISTRY.find((i) => i.slug === slug);

  if (!item) {
    notFound();
  }

  return <TestDetailView item={item} />;
}
