'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { LiaCocktailSolid } from 'react-icons/lia';

import '@/styles/views/pages/home.scss';
import '@/styles/views/pages/serve-drinks.scss';

import { PLAYER_KEYS } from '@/utils/constants/keys';

export default function ServeDrinks() {
  const [isCupFilled, setIsCupFilled] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Focus the container automatically => Fix for keys events not working at start
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);

  const handleClick = () => {
    setIsCupFilled(true);
    setTimeout(() => {
      router.push('/serve-drinks-2');
    }, 10000);
  };

  // Gestion des événements clavier
  useEffect(() => {
    interface KeyboardEvent {
      key: string;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === PLAYER_KEYS.player1.confirmationButton) {
        handleClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  return (
    <main ref={containerRef}>
      <div className='brc-background'></div>
      <div className='brc-filling-container'>
        <div className='brc-drink-info'>
          <h2 className='drink-name'>Joueur 1</h2>
          <span>
            <LiaCocktailSolid /> {localStorage.getItem('cocktail')}
          </span>
        </div>
        <p className='brc-filling-container__instructions'>
          Placez le verre du joueur 1 sous la machine à cocktail, puis appuyer
          sur le bouton pour procéder au remplissage.
        </p>
        <div className='brc-buttons-box'>
          <button
            className='brc-buttons liquide-btn active'
            onClick={handleClick}
          >
            <div className='water-ctr'>
              <p>Remplir</p>
              <div className={`water ${isCupFilled ? 'active' : ''}`}></div>
            </div>
          </button>
        </div>
      </div>
    </main>
  );
}
