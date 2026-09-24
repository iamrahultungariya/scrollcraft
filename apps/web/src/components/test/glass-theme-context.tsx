'use client';

import React, { createContext, useContext, useState, useMemo } from 'react';

export type GlassMode = 'dragon' | 'child-dragon' | 'raw' | '50%' | 'low' | 'flat';

export interface GlassThemeConfig {
  mode: GlassMode;
  label: string;
  blurPx: number;
  description: string;
  style: React.CSSProperties;
}

const GLASS_CONFIGS: Record<GlassMode, { label: string; blurPx: number; description: string; style: React.CSSProperties }> = {
  dragon: {
    label: 'Dragon (50px)',
    blurPx: 50,
    description: 'Extreme heavy blur. Ultimate GPU stress test.',
    style: {
      backdropFilter: 'blur(50px)',
      WebkitBackdropFilter: 'blur(50px)',
      backgroundColor: 'rgba(24, 24, 32, 0.3)',
      borderColor: 'rgba(255, 255, 255, 0.25)',
      boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.7), inset 0 1px 0 0 rgba(255, 255, 255, 0.3)',
    },
  },
  'child-dragon': {
    label: 'Child Dragon (35px)',
    blurPx: 35,
    description: 'Very heavy blur.',
    style: {
      backdropFilter: 'blur(35px)',
      WebkitBackdropFilter: 'blur(35px)',
      backgroundColor: 'rgba(24, 24, 32, 0.35)',
      borderColor: 'rgba(255, 255, 255, 0.22)',
      boxShadow: '0 25px 55px -12px rgba(0, 0, 0, 0.65), inset 0 1px 0 0 rgba(255, 255, 255, 0.25)',
    },
  },
  raw: {
    label: 'Raw (Full 24px)',
    blurPx: 24,
    description: 'Maximum frosted glass translucency with luminous specular border highlights.',
    style: {
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      backgroundColor: 'rgba(24, 24, 32, 0.42)',
      borderColor: 'rgba(255, 255, 255, 0.18)',
      boxShadow: '0 24px 50px -12px rgba(0, 0, 0, 0.6), inset 0 1px 0 0 rgba(255, 255, 255, 0.22)',
    },
  },
  '50%': {
    label: '50% (12px)',
    blurPx: 12,
    description: 'Balanced frosted glass delivering optimum legibility and depth.',
    style: {
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      backgroundColor: 'rgba(20, 20, 28, 0.65)',
      borderColor: 'rgba(255, 255, 255, 0.12)',
      boxShadow: '0 16px 36px -10px rgba(0, 0, 0, 0.45), inset 0 1px 0 0 rgba(255, 255, 255, 0.12)',
    },
  },
  low: {
    label: 'Low (5px)',
    blurPx: 5,
    description: 'Subtle atmospheric blur with high-density backing.',
    style: {
      backdropFilter: 'blur(5px)',
      WebkitBackdropFilter: 'blur(5px)',
      backgroundColor: 'rgba(18, 18, 24, 0.82)',
      borderColor: 'rgba(255, 255, 255, 0.08)',
      boxShadow: '0 12px 28px -8px rgba(0, 0, 0, 0.4)',
    },
  },
  flat: {
    label: 'Flat (Hardcoded)',
    blurPx: 0,
    description: 'Pure opaque obsidian surface with zero backdrop filtering.',
    style: {
      backdropFilter: 'none',
      WebkitBackdropFilter: 'none',
      backgroundColor: '#121217',
      borderColor: 'rgba(255, 255, 255, 0.08)',
      boxShadow: '0 4px 20px -4px rgba(0, 0, 0, 0.5)',
    },
  },
};

interface GlassContextValue {
  mode: GlassMode;
  setMode: (mode: GlassMode) => void;
  config: GlassThemeConfig;
  allConfigs: typeof GLASS_CONFIGS;
}

const GlassContext = createContext<GlassContextValue | null>(null);

export function GlassThemeProvider({
  children,
  initialMode = 'raw',
}: {
  children: React.ReactNode;
  initialMode?: GlassMode;
}) {
  const [mode, setMode] = useState<GlassMode>(initialMode);

  const value = useMemo<GlassContextValue>(() => {
    const active = GLASS_CONFIGS[mode];
    return {
      mode,
      setMode,
      config: {
        mode,
        label: active.label,
        blurPx: active.blurPx,
        description: active.description,
        style: active.style,
      },
      allConfigs: GLASS_CONFIGS,
    };
  }, [mode]);

  return <GlassContext.Provider value={value}>{children}</GlassContext.Provider>;
}

export function useGlassTheme(): GlassContextValue {
  const ctx = useContext(GlassContext);
  if (!ctx) {
    // Fallback if rendered outside provider
    const fallback = GLASS_CONFIGS.raw;
    return {
      mode: 'raw',
      setMode: () => {},
      config: {
        mode: 'raw',
        label: fallback.label,
        blurPx: fallback.blurPx,
        description: fallback.description,
        style: fallback.style,
      },
      allConfigs: GLASS_CONFIGS,
    };
  }
  return ctx;
}

/**
 * Reusable GlassCard component that reactively applies current glassmorphism level
 */
export const GlassCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { glowColor?: string; activeHover?: boolean }
>(({ children, className = '', style, glowColor, activeHover = true, ...props }, ref) => {
  const { config } = useGlassTheme();

  return (
    <div
      ref={ref}
      style={{
        ...config.style,
        transition: 'backdrop-filter 0.3s ease, background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
        ...style,
      }}
      className={`rounded-2xl border transition-all duration-300 relative overflow-hidden ${
        activeHover ? 'hover:border-zinc-400/30' : ''
      } ${className}`}
      {...props}
    >
      {glowColor && (
        <div
          className="ambient-glow absolute -top-20 -right-20 w-48 h-48 rounded-full pointer-events-none opacity-20 blur-2xl"
          style={{ backgroundColor: glowColor }}
          aria-hidden="true"
        />
      )}
      {children}
    </div>
  );
});

GlassCard.displayName = 'GlassCard';
