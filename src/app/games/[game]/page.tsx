'use client';

import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import slugify from 'slugify';

import '@/styles/views/pages/game.scss';

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
      !localStorage.getItem('game')
    ) {
      router.push('/');
      return;
    }

    if (localStorage.getItem('game')) {
      const storedGame = localStorage.getItem('game');
      if (storedGame && slugify(storedGame, { lower: true }) !== game) {
        router.push('/');
        return;
      }
    }
  }, [router, game]);

  if (localStorage.getItem('game')) {
    const storedGame = localStorage.getItem('game');
    if (storedGame && slugify(storedGame, { lower: true }) === game) {
      const Game = dynamic(() => import(`@/components/games/${game}.tsx`), {
        ssr: false,
      });
      return (
        <div className='game'>
          <Game />
        </div>
      );
    }
  }
};

export default GamePage;
