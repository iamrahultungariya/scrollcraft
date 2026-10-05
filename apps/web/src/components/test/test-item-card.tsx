'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { TestItem } from './test-registry';

interface TestItemCardProps {
  item: TestItem;
  index: number;
}

export const TestItemCard: React.FC<TestItemCardProps> = ({ item, index }) => {
  return (
    <Link
      href={item.slug === 'robust' ? '/test/robust' : `/test/${item.slug}`}
      className="group relative flex flex-col justify-between border border-line-soft hover:border-accent bg-bg/40 hover:bg-bg transition-colors duration-150 cursor-pointer font-body"
    >
      <div>
        {/* Card Header Strip */}
        <div className="border-b border-line-soft px-4 py-2.5 font-mono text-[11px] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-accent font-bold uppercase text-[10px] tracking-wider">
              {item.category}
            </span>
            <span className="text-muted/60 font-mono">
              #{String(index + 1).padStart(2, '0')}
            </span>
          </div>
          <span className="text-[10px] font-mono text-muted uppercase font-bold truncate max-w-[140px]">
            {item.driver.split('(')[0].trim()}
          </span>
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-5 space-y-2.5">
          {/* Title */}
          <h3 className="text-lg font-bold uppercase tracking-tight text-fg font-mono group-hover:text-accent transition-colors">
            {item.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-muted leading-relaxed line-clamp-2 font-body">
            {item.shortDescription}
          </p>

          {/* Key Features List */}
          <div className="mt-3 space-y-1.5 pt-1">
            {item.features.slice(0, 2).map((feat, fIdx) => (
              <div key={fIdx} className="flex items-center gap-2 text-[11px] text-fg/80 font-mono">
                <Check className="w-3 h-3 text-accent stroke-[2.5] shrink-0" />
                <span className="truncate">{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Card Footer & Action */}
      <div className="border-t border-line-soft px-4 py-3 flex items-center justify-between gap-2 font-mono text-xs">
        <div className="flex flex-wrap gap-2 overflow-hidden max-w-[60%]">
          {item.tags.slice(0, 2).map((tag, tIdx) => (
            <span
              key={tIdx}
              className="text-[10px] font-mono text-muted uppercase tracking-wider truncate"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="text-[11px] font-mono font-bold uppercase text-muted group-hover:text-accent transition-colors inline-flex items-center gap-1.5 shrink-0">
          <span>OPEN LAB</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};
