'use client';

import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { LiaCocktailSolid } from 'react-icons/lia';
import slugify from 'slugify';

import '@/styles/views/pages/home.scss';
import '@/styles/views/pages/game-choice.scss';

import games from '@/data/games.json';

import { PLAYER_KEYS } from '@/utils/constants/keys';

export default function GameChoice() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0); // État pour l'index actif
  const containerRef = useRef<HTMLDivElement>(null); // Référence pour le conteneur

  // Présence du cocktail dans le localStorage : redirection si absent
  useEffect(() => {
    if (
      !localStorage.getItem('cocktail') ||
      localStorage.getItem('cocktail') === 'undefined'
    ) {
      router.push('/');
    }
  }, [router]);

  // Focus sur le conteneur au montage
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);

  // Nettoyage du localStorage au montage
  const handleGameChoice = useCallback(
    (gameName: string) => {
      localStorage.setItem('game', gameName);
      router.push(`/games/${slugify(gameName, { lower: true })}`);
    },
    [router],
  );

  // Gestion des événements clavier : touches fléchées et entrée
  useEffect(() => {
    interface KeyboardEvent {
      key: string;
    }
    // Importation des fichiers audio
    const arrowSound = new Audio('/sounds/select.mp3');
    const enterSound = new Audio('/sounds/press.mp3');

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === PLAYER_KEYS.player1.moveLeft) {
        setActiveIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : games.length,
        );
        arrowSound.play(); // Jouer le son pour les flèches
      } else if (event.key === PLAYER_KEYS.player1.moveRight) {
        setActiveIndex((prevIndex) =>
          prevIndex < games.length ? prevIndex + 1 : 0,
        );
        arrowSound.play(); // Jouer le son pour les flèches
      } else if (event.key === PLAYER_KEYS.player1.confirmationButton) {
        if (activeIndex === games.length) {
          router.push('/');
        } else {
          handleGameChoice(games[activeIndex].name);
        }
        enterSound.play(); // Jouer le son pour la touche entrée
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeIndex, handleGameChoice, router]);

  return (
    <main ref={containerRef} tabIndex={0}>
      <div className='brc-background'></div>
      <div className='brc-container'>
        <div className='brc-drink-info'>
          <h2>Choix du jeu</h2>
          <span>
            <LiaCocktailSolid /> {localStorage.getItem('cocktail')}
          </span>
        </div>
        <p className='brc-container__instructions'>
          Le perdant obtiendra un cocktail plus corsé :)
        </p>
        <div className='brc-buttons-box game-choice'>
          {games.map((game, index) => (
            <button
              key={index}
              onClick={() => handleGameChoice(game.name)}
              className={`brc-buttons-game delay-${index} ${slugify(game.name, {
                lower: true,
              })} ${activeIndex === index ? 'active' : ''}`} // Ajout de la classe 'active' si l'index est actif
            >
              {game.name}
            </button>
          ))}
          <button
            onClick={() => router.push('/')}
            className={`brc-buttons-game brc-button-back ${activeIndex === games.length ? 'active' : ''}`}
          >
            Retour à l'accueil
          </button>
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
