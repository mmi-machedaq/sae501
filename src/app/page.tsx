'use client';

import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import slugify from 'slugify';

import '@/styles/views/pages/home.scss';

import cocktails from '@/data/cocktails.json';

import { PLAYER_KEYS } from '@/utils/constants/keys';

import Logo from '~/icons/logo.svg';

export default function Home() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0); // État pour l'index actif
  const containerRef = useRef<HTMLDivElement>(null); // Référence pour le conteneur

  // Focus sur le conteneur au montage
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);

  // Nettoyage du localStorage au montage
  useEffect(() => {
    if (localStorage.getItem('cocktail') || localStorage.getItem('game')) {
      localStorage.clear();
    }
  }, []);

  // Gestion du choix du cocktail
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

    // Importation des fichiers audio
    const arrowSound = new Audio('/sounds/select.mp3');
    const enterSound = new Audio('/sounds/press.mp3');

    // Gestion des événements clavier : touches fléchées et entrée
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === PLAYER_KEYS.player1.moveLeft) {
        setActiveIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : cocktails.length - 1,
        );
        arrowSound.play(); // Jouer le son pour les flèches
      } else if (event.key === PLAYER_KEYS.player1.moveRight) {
        setActiveIndex((prevIndex) =>
          prevIndex < cocktails.length - 1 ? prevIndex + 1 : 0,
        );
        arrowSound.play(); // Jouer le son pour les flèches
      } else if (event.key === PLAYER_KEYS.player1.moveUp) {
        setActiveIndex((prevIndex) =>
          prevIndex > 2 ? prevIndex - 3 : prevIndex + 3,
        );
        arrowSound.play(); // Jouer le son pour les flèches
      } else if (event.key === PLAYER_KEYS.player1.moveDown) {
        setActiveIndex((prevIndex) =>
          prevIndex < 3 ? prevIndex + 3 : prevIndex - 3,
        );
        arrowSound.play(); // Jouer le son pour les flèches
      } else if (event.key === PLAYER_KEYS.player1.confirmationButton) {
        handleCocktailChoice(cocktails[activeIndex].name);
        enterSound.play(); // Jouer le son pour la touche entrée
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeIndex, handleCocktailChoice]);

  return (
    <main ref={containerRef} tabIndex={0}>
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
              })} ${activeIndex === index ? 'active' : ''}`} // Ajout d'une classe active si l'index est actif
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
