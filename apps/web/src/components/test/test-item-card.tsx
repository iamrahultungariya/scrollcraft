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
      href={`/test/${item.slug}`}
      style={{ contentVisibility: 'auto', containIntrinsicSize: '240px 220px' }}
      className="group relative flex flex-col justify-between border-2 border-line bg-bg shadow-rest hover:shadow-hover hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer font-body"
    >
      <div>
        {/* Card Header Strip */}
        <div className="border-b-2 border-line bg-line-soft/30 px-3.5 py-2 font-mono text-[11px] font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="border border-line bg-bg px-2 py-0.5 text-accent uppercase font-bold text-[10px]">
              {item.category}
            </span>
            <span className="text-muted font-mono">
              #{String(index + 1).padStart(2, '0')}
            </span>
          </div>
          <span className="text-[10px] font-mono text-fg px-2 py-0.5 border border-line-soft bg-bg truncate max-w-[140px] uppercase font-bold">
            {item.driver.split('(')[0].trim()}
          </span>
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-3">
          {/* Title */}
          <h3 className="text-xl font-black uppercase tracking-tight text-fg font-mono group-hover:text-accent transition-colors flex items-center gap-2">
            {item.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-fg/80 leading-relaxed line-clamp-2 font-body">
            {item.shortDescription}
          </p>

          {/* Key Features List */}
          <div className="mt-3 space-y-1.5 pt-1">
            {item.features.slice(0, 2).map((feat, fIdx) => (
              <div key={fIdx} className="flex items-center gap-2 text-[11px] text-fg/90 font-mono">
                <span className="w-3.5 h-3.5 border border-line bg-bg flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 text-accent stroke-[3]" />
                </span>
                <span className="truncate">{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Card Footer & Action */}
      <div className="border-t-2 border-line p-3.5 bg-line-soft/10 flex items-center justify-between gap-2 font-mono text-xs">
        <div className="flex flex-wrap gap-1.5 overflow-hidden max-w-[60%]">
          {item.tags.slice(0, 2).map((tag, tIdx) => (
            <span
              key={tIdx}
              className="text-[10px] font-mono px-1.5 py-0.5 border border-line-soft bg-bg text-muted uppercase font-bold truncate"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="h-8 px-2.5 border border-line bg-bg group-hover:bg-accent text-fg group-hover:text-black font-mono text-[11px] font-bold uppercase transition-all inline-flex items-center gap-1 shrink-0">
          <span>OPEN LAB</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
};
