import type { Metadata } from 'next';
import { DocsView } from '@/components/docs/docs-view';

export const metadata: Metadata = {
  title: 'Documentation — ScrollCraft React & Next.js Scroll Toolkit',
  description:
    'Complete documentation, architecture deep dive, and API reference for the ScrollCraft React scroll engine and primitives.',
};

export default function DocsPage() {
  return (
    <div className="bg-ink min-h-screen text-paper selection:bg-lime selection:text-ink font-body antialiased">
      <DocsView />
    </div>
  );
}
