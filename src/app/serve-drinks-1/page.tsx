'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { LiaCocktailSolid } from 'react-icons/lia';

import '@/styles/views/pages/home.scss';
import '@/styles/views/pages/serve-drinks.scss';
import '@/styles/views/pages/popup.scss';

import { PLAYER_KEYS } from '@/utils/constants/keys';

export default function ServeDrinks() {
  //arreter le son
  if (window.pageSound) {
    window.pageSound.pause();
    window.pageSound.currentTime = 0;
  }

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

    // Importation des fichiers audio

    const enterSound = new Audio('/sounds/press.mp3');

    // Gestion des événements clavier : touche entrée
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === PLAYER_KEYS.player1.confirmationButton) {
        if (!isPopupVisible) {
          handleClick();
        } else {
          handleClosePopup();
        }
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
  let player1Status;

  if (gameWinner === 'Player 1') {
    player1Status = 'Gagnant';
  } else if (gameLoser === 'Player 1') {
    player1Status = 'Perdant';
  } else {
    player1Status = 'Égalité';
  }

  const [isPopupVisible, setPopupVisible] = useState(true);

  // Son pour l'apparition du pop-up
  useEffect(() => {
    if (isPopupVisible) {
      const popupSound = new Audio('/sounds/win.mp3');
      popupSound.play();
    }
  }, [isPopupVisible]);

  const handleClosePopup = () => {
    setPopupVisible(false);
  };

  return (
    <main ref={containerRef} tabIndex={0}>
      {isPopupVisible && (
        <div className='popup' style={{ display: 'flex' }}>
          <div className='popup-content'>
            <h2>Résultat de la partie</h2>
            <p className='popup-message'>
              Le gagnant est{' '}
              {gameWinner === 'Player 1' ? 'Joueur 1' : 'Joueur 2'}{' '}
            </p>
            <button className='brc-buttons active' onClick={handleClosePopup}>
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
