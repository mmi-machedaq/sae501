import type { Metadata } from 'next';
import * as React from 'react';

export const metadata: Metadata = {
  title: '404 - Not Found',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <section>
      <div>Not Found</div>
    </section>
  );
}
