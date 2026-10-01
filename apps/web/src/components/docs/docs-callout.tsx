'use client';

import React from 'react';
import { Sparkles, Terminal, AlertTriangle, AlertCircle } from 'lucide-react';

interface DocsCalloutProps {
  type?: 'note' | 'tip' | 'warning' | 'danger';
  title?: string;
  children: React.ReactNode;
}

export const DocsCallout: React.FC<DocsCalloutProps> = ({
  type = 'note',
  title,
  children,
}) => {
  const styles = {
    note: {
      container: 'bg-bg border-2 border-line border-l-[6px] border-l-accent shadow-rest',
      icon: <Sparkles className="w-4 h-4 text-accent shrink-0 mt-0.5" />,
      titleColor: 'text-accent',
    },
    tip: {
      container: 'bg-bg border-2 border-line border-l-[6px] border-l-accent shadow-rest',
      icon: <Terminal className="w-4 h-4 text-accent shrink-0 mt-0.5" />,
      titleColor: 'text-accent',
    },
    warning: {
      container: 'bg-bg border-2 border-line border-l-[6px] border-l-line shadow-rest',
      icon: <AlertTriangle className="w-4 h-4 text-fg shrink-0 mt-0.5" />,
      titleColor: 'text-fg',
    },
    danger: {
      container: 'bg-bg border-2 border-line border-l-[6px] border-l-accent shadow-rest',
      icon: <AlertCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" />,
      titleColor: 'text-accent',
    },
  }[type];

  return (
    <div
      className={`my-6 flex gap-3.5 p-4 text-sm leading-relaxed transition-all ${styles.container}`}
    >
      {styles.icon}
      <div className="flex-1 min-w-0">
        {title && (
          <h5 className={`font-black text-xs tracking-wider uppercase font-mono mb-1.5 ${styles.titleColor}`}>
            {title}
          </h5>
        )}
        <div className="text-xs sm:text-[13px] text-fg/90 space-y-1.5 leading-relaxed font-body">
          {children}
        </div>
      </div>
    </div>
  );
};
