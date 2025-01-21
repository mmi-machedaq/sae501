'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { LiaCocktailSolid } from 'react-icons/lia';

import '@/styles/views/pages/home.scss';
import '@/styles/views/pages/serve-drinks.scss';
import '@/styles/views/pages/popup.scss';

import cocktails from '@/data/cocktails.json';

import { sendCocktailRecipe } from '@/services/sendCocktailRecipe';
import { PLAYER_KEYS } from '@/utils/constants/keys';

export default function ServeDrinks() {
  const [isFillingTheCup, setIsFillingTheCup] = useState(false);
  const [isPopupVisible, setPopupVisible] = useState(true);
  const [isErrorPopupVisible, setErrorPopupVisible] = useState(false);
  const [selectedCocktail, setSelectedCocktail] = useState({}); // État pour le cocktail sélectionné : initialisé à un objet vide
  const [isCupFilled, setIsCupFilled] = useState(false); // État pour le remplissage du verre : initialisé à faux
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null); // Référence pour le conteneur

  // Stop the sound
  if (window.pageSound) {
    window.pageSound.pause();
    window.pageSound.currentTime = 0;
  }

  useEffect(() => {
    if (localStorage.getItem('cocktail')) {
      const cocktailName = localStorage.getItem('cocktail');
      const cocktail = cocktails.find((item) => item.name === cocktailName);

      if (cocktail) {
        setSelectedCocktail({
          cocktail: cocktail.ingredients,
        });
      } else {
        console.error('Cocktail not found !');
      }
    }

    // Focus sur le conteneur au montage
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);

  const sendCocktailRecipeToMachine = async () => {
    try {
      if (!selectedCocktail) {
        console.error('No cocktail selected');
        return false;
      }

      const response = await sendCocktailRecipe(selectedCocktail);

      if (response) {
        return true;
      }
    } catch (error) {
      console.log('Erreur :' + error);
      setErrorPopupVisible(true);
      return false;
    }
  };

  // Gestion du remplissage du verre : redirection après 10 secondes
  const handleClick = async () => {
    if (!isFillingTheCup) {
      setIsFillingTheCup(true);
      setIsCupFilled(true);
      await sendCocktailRecipeToMachine();
      router.push('/serve-drinks-2');
    }
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
        if (!isPopupVisible && !isErrorPopupVisible) {
          handleClick();
        } else {
          if (isPopupVisible) {
            handleClosePopup();
          } else {
            handleCloseErrorPopup();
          }
        }
        if (!isFillingTheCup) {
          enterSound.play(); // Jouer le son pour la touche entrée
        }
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

  const handleCloseErrorPopup = () => {
    setErrorPopupVisible(false);
    router.push('/');
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

      {isErrorPopupVisible && (
        <div className='popup' style={{ display: 'flex' }}>
          <div className='popup-content'>
            <h2>Une erreur est survenue</h2>
            <p className='popup-message'>
              La connexion entre la machine à cocktail et l'application semble
              compromise. Veuillez réessayer.
            </p>
            <button
              className='brc-buttons active'
              onClick={handleCloseErrorPopup}
            >
              Fermer
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
