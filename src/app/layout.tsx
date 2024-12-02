import type { Metadata, Viewport } from 'next';
import { ReactNode } from 'react';

import '../styles/global.scss';

import { Gotham } from '@/fonts';

export const metadata: Metadata = {
  title: 'SAE 501',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='fr'>
      <body className={Gotham.variable}>{children}</body>
    </html>
  );
}
