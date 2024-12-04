'use client';

import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import slugify from 'slugify';

import games from '@/data/games.json';

const GamePage = () => {
  const router = useRouter();
  const { game } = useParams() as { game: string };

  useEffect(() => {
    if (!games.some((g) => slugify(g.name, { lower: true }) === game)) {
      router.push('/');
      return;
    }

    if (
      !localStorage.getItem('cocktail') ||
      localStorage.getItem('cocktail') === 'undefined' ||
      !localStorage.getItem('game') ||
      localStorage.getItem('game') !== game
    ) {
      router.push('/');
      return;
    }
  }, [router, game]);

  if (localStorage.getItem('game') && localStorage.getItem('game') === game) {
    const Game = dynamic(() => import(`@/components/games/${game}.tsx`), {
      ssr: false,
    });
    return <Game />;
  }
};

export default GamePage;
