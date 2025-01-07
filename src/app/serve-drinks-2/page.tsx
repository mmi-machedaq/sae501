'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { LiaCocktailSolid } from 'react-icons/lia';

import '@/styles/views/pages/home.scss';
import '@/styles/views/pages/serve-drinks.scss';

import { PLAYER_KEYS } from '@/utils/constants/keys';

export default function ServeDrinks() {
  const [isCupFilled, setIsCupFilled] = useState(false); // État pour le remplissage du verre : initialisé à faux
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null); // Référence pour le conteneur

  useEffect(() => {
    // Focus sur le conteneur au montage
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);

  // Gestion du remplissage du verre : redirection après 10 secondes
  const handleClick = () => {
    setIsCupFilled(true);
    setTimeout(() => {
      router.push('/bonus');
    }, 10000);
  };

  // Gestion des événements clavier
  useEffect(() => {
    interface KeyboardEvent {
      key: string;
    }

    // Importation des fichiers audio
    const enterSound = new Audio('/sounds/press.mp3');

    // Gestion des événements clavier : touche entrée
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === PLAYER_KEYS.player1.confirmationButton) {
        handleClick();
        enterSound.play(); // Jouer le son pour la touche entrée
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  // Récupérer les informations depuis le localStorage
  const gameWinner = localStorage.getItem('gameWinner');
  const gameLoser = localStorage.getItem('gameLoser');

  // Déterminer le statut du joueur 1
  let player2Status;

  if (gameWinner === 'Player 2') {
    player2Status = 'Gagnant';
  } else if (gameLoser === 'Player 2') {
    player2Status = 'Perdant';
  } else {
    player2Status = 'Égalité';
  }

  return (
    <main ref={containerRef}>
      <div className='brc-background'></div>
      <div className='brc-filling-container'>
        <div className='brc-drink-info'>
          <h2 className='drink-name'>Joueur 2</h2>
          <span>
            <LiaCocktailSolid /> {localStorage.getItem('cocktail')}
          </span>
        </div>
        <p className='brc-filling-container__instructions'>
          Placez le verre du joueur 2 ({player2Status}) sous la machine à
          cocktail, puis appuyer sur le bouton pour procéder au remplissage.
        </p>
        <div className='brc-buttons-box'>
          <button
            className='brc-buttons liquide-btn active'
            onClick={handleClick}
          >
            <div className='water-ctr'>
              <p>Remplir</p>
              <div
                className={`water ${isCupFilled ? 'active' : ''}`} // Ajout de la classe 'active' si le bouton est cliqué
              ></div>
            </div>
          </button>
        </div>
      </div>
    </main>
  );
}
