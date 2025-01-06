'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { MdAutorenew } from 'react-icons/md';

import '@/styles/views/pages/home.scss';
import '@/styles/views/pages/bonus.scss';

import phrases from '@/data/phrases.json';

import { PLAYER_KEYS } from '@/utils/constants/keys';

export default function Bonus() {
  const router = useRouter();
  const [randomPhrase, setRandomPhrase] = useState('');

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * phrases.length);
    setRandomPhrase(phrases[randomIndex].text);
  }, []);

  const handleClick = () => {
    localStorage.clear();
    router.push('/');
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
    <main>
      <div className='brc-background'></div>
      <div className='brc-bonus-container'>
        <h2>Défi bonus</h2>
        <p className='brc-bonus-container__random-sentence'>
          {randomPhrase || 'Chargement...'}
        </p>
        <div className='brc-buttons-box'>
          <button className='brc-buttons active' onClick={handleClick}>
            <MdAutorenew />
            Nouvelle partie
          </button>
        </div>
      </div>
    </main>
  );
}
