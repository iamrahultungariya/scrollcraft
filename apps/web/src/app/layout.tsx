import type { Metadata, Viewport } from 'next';
import { Sora, Manrope, JetBrains_Mono } from 'next/font/google';
import { ScrollProvider, ScrollInspector } from '@scrollcraft/react';
import { RouteScrollSync } from '@/components/layout/route-scroll-sync';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import '../styles/globals.css';

const sora = Sora({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  display: 'swap',
});

const manrope = Manrope({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
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
    icon: [
      { url: '/icon.webp', type: 'image/webp' },
      { url: '/images/scrollcraft-logo.webp', type: 'image/webp' },
    ],
    shortcut: '/images/scrollcraft-logo.webp',
    apple: '/images/scrollcraft-logo.webp',
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
        className={`${sora.variable} ${manrope.variable} ${jetbrainsMono.variable} bg-ink text-paper min-h-screen antialiased selection:bg-lime selection:text-ink font-body flex flex-col`}
        suppressHydrationWarning
      >
        <ScrollProvider
          smooth={{
            lerp: 0.12,
            duration: 0.75,
            smoothWheel: true,
            wheelMultiplier: 1.0,
          }}
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
