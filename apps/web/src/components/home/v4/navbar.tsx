'use client';

import React from 'react';
import { SiteNav } from '@/components/layout/site-nav';
import { ScrollProgress } from '@scrollcraft/react';

export function Navbar() {
  return (
    <>
      {/* Clean single-color progress line — no neon gradient */}
      <ScrollProgress className="fixed top-0 left-0 right-0 h-[1px] bg-[#3b82f6] z-[100] origin-left pointer-events-none" />
      <SiteNav variant="floating" />
    </>
  );
}
