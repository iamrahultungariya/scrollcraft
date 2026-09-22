import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Caveat } from 'next/font/google';
import { ScrollProvider, ScrollInspector } from '@scrollcraft/react';
import { RouteScrollSync } from '@/components/layout/route-scroll-sync';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import '../styles/globals.css';

const geistSans = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

const caveat = Caveat({
  variable: '--font-caveat',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  themeColor: '#050505',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://scrollcraft.dev'),
  title: {
    default: 'ScrollCraft — The Scroll Engine React Never Had',
    template: '%s | ScrollCraft',
  },
  description:
    'Composable primitives and reactive hooks for parallax, reveals, pins, and scroll-progress — powered by Lenis, safe in RSC, zero React re-renders.',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'ScrollCraft — The Scroll Engine React Never Had',
    description:
      'Composable primitives and reactive hooks for parallax, reveals, pins, and scroll-progress — powered by Lenis, safe in RSC, zero React re-renders.',
    url: 'https://scrollcraft.dev',
    siteName: 'ScrollCraft',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ScrollCraft — The Scroll Engine React Never Had',
    description:
      'Composable primitives and reactive hooks for parallax, reveals, pins, and scroll-progress — powered by Lenis, safe in RSC, zero React re-renders.',
    creator: '@scrollcraft',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} bg-[#050505] text-zinc-100 min-h-screen antialiased selection:bg-violet-600/30 selection:text-white font-sans flex flex-col`}
        suppressHydrationWarning
      >
        <ScrollProvider
          smooth={true}
          respectReducedMotion={true}
          autoResetOnRouteChange={true}
        >
          <RouteScrollSync />
          <div className="relative flex-1 flex flex-col min-h-0 pb-16 md:pb-0">
            {children}
          </div>
          <MobileBottomNav />
          <ScrollInspector defaultCollapsed position="bottom-right" />
        </ScrollProvider>
      </body>
    </html>
  );
}
