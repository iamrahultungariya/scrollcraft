'use client';

import React from 'react';

import Image from 'next/image';

interface ScrollCraftLogoProps {
  variant?: 'icon' | 'full' | 'badge' | 'lockup-dark' | 'lockup-light' | 'app-violet' | 'app-orange' | 'app-dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  badgeText?: string;
}

export const ScrollCraftEmblem: React.FC<{
  size?: number;
  className?: string;
  useImage?: boolean;
}> = ({
  size = 28,
  className = '',
  useImage = true,
}) => {
  if (useImage) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`relative shrink-0 select-none ${className}`}
      >
        <Image
          src="/images/scrollcraft-logo.webp"
          alt="ScrollCraft emblem"
          width={size * 2}
          height={size * 2}
          priority
          className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(124,58,237,0.4)]"
        />
      </div>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
      aria-label="ScrollCraft logo"
    >
      <defs>
        <linearGradient id="emblem-violet" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#8B5CF6" />
          <stop offset="100%" stop-color="#6D28D9" />
        </linearGradient>
      </defs>
      <path
        d="M24 20C21.79 20 20 21.79 20 24V28C20 30.21 21.79 32 24 32H38C40.21 32 42 30.21 42 28V24C42 21.79 40.21 20 38 20H24Z"
        fill="#8B5CF6"
      />
      <path
        d="M20 28C20 32.42 23.58 36 28 36H36C40.42 36 44 39.58 44 44C44 48.42 40.42 52 36 52H22C17.58 52 14 48.42 14 44C14 39.58 17.58 36 22 36"
        stroke="url(#emblem-violet)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M42 24C42 19.58 38.42 16 34 16H24C19.58 16 16 19.58 16 24"
        stroke="#A78BFA"
        strokeWidth="7"
        strokeLinecap="round"
      />
    </svg>
  );
};

export const ScrollCraftLogo: React.FC<ScrollCraftLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  badgeText = 'BETA',
}) => {
  const sizeConfig = {
    sm: { textSize: 'text-xs', badgeSize: 'text-[9px] px-1.5 py-0.5' },
    md: { textSize: 'text-sm', badgeSize: 'text-[10px] px-2 py-0.5' },
    lg: { textSize: 'text-base', badgeSize: 'text-xs px-2 py-0.5' },
    xl: { textSize: 'text-xl', badgeSize: 'text-xs px-2.5 py-1' },
  }[size];

  return (
    <div className={`inline-flex items-center gap-2 select-none font-display font-black tracking-wider uppercase text-fg ${className}`}>
      <span className={`${sizeConfig.textSize} tracking-wider font-extrabold flex items-center gap-1.5 text-paper`}>
        SCROLL CRAFT
        <span className="w-2 h-2 bg-lime inline-block shrink-0" aria-hidden="true" />
      </span>
      {variant === 'badge' && badgeText && (
        <span
          className={`${sizeConfig.badgeSize} font-mono font-bold tracking-wider uppercase bg-lime text-black border-2 border-lime leading-none`}
        >
          {badgeText}
        </span>
      )}
    </div>
  );
};

