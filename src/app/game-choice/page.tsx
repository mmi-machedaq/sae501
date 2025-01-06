'use client';

import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { LiaCocktailSolid } from 'react-icons/lia';
import slugify from 'slugify';

import '@/styles/views/pages/home.scss';

import games from '@/data/games.json';

import { PLAYER_KEYS } from '@/utils/constants/keys';

export default function GameChoice() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0); // State for active index
  const containerRef = useRef<HTMLDivElement>(null); // Reference for focus

  // Redirect if no cocktail is chosen
  useEffect(() => {
    if (
      !localStorage.getItem('cocktail') ||
      localStorage.getItem('cocktail') === 'undefined'
    ) {
      router.push('/');
    }
  }, [router]);

  // Focus the container on component mount
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);

  const handleGameChoice = useCallback(
    (gameName: string) => {
      localStorage.setItem('game', gameName);
      router.push(`/games/${slugify(gameName, { lower: true })}`);
    },
    [router],
  );

  // Keyboard navigation for games
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === PLAYER_KEYS.player1.moveLeft) {
        setActiveIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : games.length - 1,
        );
      } else if (event.key === PLAYER_KEYS.player1.moveRight) {
        setActiveIndex((prevIndex) =>
          prevIndex < games.length - 1 ? prevIndex + 1 : 0,
        );
      } else if (event.key === PLAYER_KEYS.player1.confirmationButton) {
        handleGameChoice(games[activeIndex].name);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeIndex, handleGameChoice]);

  return (
    <main ref={containerRef} tabIndex={0}>
      <div className='brc-background'></div>
      <div className='brc-container'>
        <div className='brc-drink-info'>
          <h2>
            <LiaCocktailSolid /> {localStorage.getItem('cocktail')}
          </h2>
          <span>Cocktail choisi</span>
        </div>
        <div className='brc-buttons-box game-choice'>
          {games.map((game, index) => (
            <button
              key={index}
              onClick={() => handleGameChoice(game.name)}
              className={`brc-buttons-game delay-${index} ${slugify(game.name, {
                lower: true,
              })} ${activeIndex === index ? 'active' : ''}`}
            >
              {game.name}
            </button>
          ))}
        </div>

        <div className='brc-footer game'>
          <p>
            L'abus d'alcool est dangereux pour la santé, à consommer avec
            modération
          </p>
        </div>
      </div>
    </main>
  );
}
