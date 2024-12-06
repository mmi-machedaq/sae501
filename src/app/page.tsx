'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import slugify from 'slugify';

import '@/styles/views/pages/home.scss';

import cocktails from '@/data/cocktails.json';

import Logo from '~/icons/logo.svg';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem('cocktail') || localStorage.getItem('game')) {
      localStorage.clear();
    }
  }, []);

  const handleCocktailChoice = (cocktailName: string) => {
    localStorage.setItem('cocktail', cocktailName);
    router.push('/game-choice');
  };

  return (
    <main>
      <div className='brc-background'></div>
      <div className='brc-container'>
        <div className='brc-logo'>
          <Logo />
        </div>
        <div className='brc-buttons-box'>
          {cocktails.map((cocktail, index) => (
            <button
              onClick={() =>
                handleCocktailChoice(slugify(cocktail.name, { lower: true }))
              }
              className={`brc-buttons delay-${index} ${slugify(cocktail.name, { lower: true })}`}
              key={index}
            >
              {cocktail.name}
            </button>
          ))}
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
