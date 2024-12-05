'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { LiaCocktailSolid } from 'react-icons/lia';
import slugify from 'slugify';

import '@/styles/views/pages/home.scss';

import games from '@/data/games.json';

import Logo from '~/icons/logo.svg';

export default function GameChoice() {
  const router = useRouter();

  useEffect(() => {
    if (
      !localStorage.getItem('cocktail') ||
      localStorage.getItem('cocktail') === 'undefined'
    ) {
      router.push('/');
    }
  }, [router]);

  const handleGameChoice = (game: string) => {
    localStorage.setItem('game', game);
    router.push(`/games/${game}`);
  };

  return (
    <main>
      <div className='brc-background'></div>
      <div className='brc-container'>
        <div className='brc-logo'>
          <Logo />
        </div>
        <div className='brc-buttons-box game-choice'>
          {games.map((game, index) => (
            <button
              onClick={() =>
                handleGameChoice(slugify(game.name, { lower: true }))
              }
              className={`brc-buttons ${slugify(game.name, { lower: true })}`}
              key={index}
            >
              {game.name}
            </button>
          ))}
        </div>
        <div className='brc-drink-info'>
          <p>
            <LiaCocktailSolid /> {localStorage.getItem('cocktail')}
          </p>
          <span>Cocktail choisi</span>
        </div>
        <div className='brc-footer'>
          <p>
            L'abus d'alcool est dangereux pour la santé, à consommer avec
            modération
          </p>
        </div>
      </div>
    </main>
  );
}
