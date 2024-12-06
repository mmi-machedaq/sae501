'use client';

import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import slugify from 'slugify';

import '@/styles/views/pages/home.scss';

import cocktails from '@/data/cocktails.json';

import Logo from '~/icons/logo.svg';

export default function Home() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0); // État pour l'index actif

  useEffect(() => {
    if (localStorage.getItem('cocktail') || localStorage.getItem('game')) {
      localStorage.clear();
    }
  }, []);

  const handleCocktailChoice = useCallback(
    (cocktailName: string) => {
      localStorage.setItem('cocktail', cocktailName);
      router.push('/game-choice');
    },
    [router],
  );

  // Gestion des événements clavier
  useEffect(() => {
    interface KeyboardEvent {
      key: string;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        setActiveIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : cocktails.length - 1,
        );
      } else if (event.key === 'ArrowRight') {
        setActiveIndex((prevIndex) =>
          prevIndex < cocktails.length - 1 ? prevIndex + 1 : 0,
        );
      } else if (event.key === 'Enter') {
        handleCocktailChoice(cocktails[activeIndex].name);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeIndex, handleCocktailChoice]);

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
              key={index}
              onClick={() => handleCocktailChoice(cocktail.name)}
              className={`brc-buttons delay-${index} ${slugify(cocktail.name, {
                lower: true,
              })} ${activeIndex === index ? 'active' : ''}`} // Ajout d'une classe active
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
