'use client';

import type { Metadata } from 'next';
import * as React from 'react';

export const metadata: Metadata = {
  title: 'Une erreur est survenue.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function Error() {
  return (
    <section>
      <div>Erreur</div>
    </section>
  );
}
