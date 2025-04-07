'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { LiaCocktailSolid } from 'react-icons/lia';

import '@/styles/views/pages/home.scss';
import '@/styles/views/pages/serve-drinks.scss';

import cocktails from '@/data/cocktails.json';

import { sendCocktailRecipe } from '@/services/sendCocktailRecipe';
import { PLAYER_KEYS } from '@/utils/constants/keys';

export default function ServeDrinks() {
  const [isFillingTheCup, setIsFillingTheCup] = useState(false);
  const [isErrorPopupVisible, setErrorPopupVisible] = useState(false);
  const [selectedCocktail, setSelectedCocktail] = useState({}); // État pour le cocktail sélectionné : initialisé à un objet vide
  const [isCupFilled, setIsCupFilled] = useState(false); // État pour le remplissage du verre : initialisé à faux
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null); // Référence pour le conteneur
  const [gameWinner, setGameWinner] = useState<string | null>(null);
  const [gameLoser, setGameLoser] = useState<string | null>(null);
  const [player2Status, setPlayer2Status] = useState<string>('Égalité'); // Default value
  const [cocktailName, setCocktailName] = useState<string | null>('');

  useEffect(() => {
    if (localStorage.getItem('cocktail')) {
      setCocktailName(localStorage.getItem('cocktail'));
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

      if (!isErrorPopupVisible) {
        router.push('/bonus');
      }
    }
  };

  const handleCloseErrorPopup = () => {
    setErrorPopupVisible(false);
    router.push('/');
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
        if (!isErrorPopupVisible) {
          handleClick();
        } else {
          handleCloseErrorPopup();
        }
        if (!isFillingTheCup) {
          enterSound.play(); // Jouer le son pour la touche entrée
        }
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('keydown', handleKeyDown);
      }
    };
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const winner = localStorage.getItem('gameWinner');
      const loser = localStorage.getItem('gameLoser');

      setGameWinner(winner);
      setGameLoser(loser);

      // Determine Player 1 status
      if (winner === 'Player 2') {
        setPlayer2Status('Gagnant');
      } else if (loser === 'Player 2') {
        setPlayer2Status('Perdant');
      } else {
        setPlayer2Status('Égalité');
      }
    }
  }, []);

  return (
    <main ref={containerRef}>
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
          <h2 className='drink-name'>Joueur 2</h2>
          {selectedCocktail && (
            <span>
              <LiaCocktailSolid /> {cocktailName}
            </span>
          )}
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
