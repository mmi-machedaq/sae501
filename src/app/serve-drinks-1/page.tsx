'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { LiaCocktailSolid } from 'react-icons/lia';

import '@/styles/views/pages/home.scss';
import '@/styles/views/pages/serve-drinks.scss';
import '@/styles/views/pages/popup.scss';

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
      router.push('/serve-drinks-2');
    }, 10000);
  };

  // Gestion des événements clavier
  useEffect(() => {
    interface KeyboardEvent {
      key: string;
    }

    // Gestion des événements clavier : touche entrée
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

  // Récupérer les informations depuis le localStorage
  const gameWinner = localStorage.getItem('gameWinner');
  const gameLoser = localStorage.getItem('gameLoser');

  // Déterminer le statut du joueur 1
  let player1Status;
  let player2Status;

  if (gameWinner === 'Player 1') {
    player1Status = 'Gagnant';
  } else if (gameLoser === 'Player 1') {
    player1Status = 'Perdant';
  } else {
    player1Status = 'Égalité';
  }

  if (gameWinner === 'Player 2') {
    player2Status = 'Gagnant';
  } else if (gameLoser === 'Player 2') {
    player2Status = 'Perdant';
  } else {
    player2Status = 'Égalité';
  }

  const [isPopupVisible, setPopupVisible] = useState(true);

  const handleClosePopup = () => {
    setPopupVisible(false);
  };

  return (
    <main ref={containerRef}>
      {isPopupVisible && (
        <div className='popup' style={{ display: 'flex' }}>
          <div className='popup-content'>
            <h2>Résultat de la partie</h2>
            <p className='popup-message'>Joueur 1 : {player1Status}</p>
            <p className='popup-message'>Joueur 2 : {player2Status}</p>
            <button className='brc-buttons hide' onClick={handleClosePopup}>
              Suivant
            </button>
          </div>
        </div>
      )}

      <div className='brc-background'></div>
      <div className='brc-filling-container'>
        <div className='brc-drink-info'>
          <h2 className='drink-name'>Joueur 1</h2>
          <span>
            <LiaCocktailSolid /> {localStorage.getItem('cocktail')}
          </span>
        </div>
        <p className='brc-filling-container__instructions'>
          Placez le verre du joueur 1 ({player1Status}) sous la machine à
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
