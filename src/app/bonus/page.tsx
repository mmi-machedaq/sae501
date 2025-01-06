'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { MdAutorenew } from 'react-icons/md';

import '@/styles/views/pages/home.scss';
import '@/styles/views/pages/bonus.scss';

import phrases from '@/data/phrases.json';

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

  return (
    <main>
      <div className='brc-background'></div>
      <div className='brc-bonus-container'>
        <h2>On relance les cartes :</h2>
        <p className='brc-bonus-container__random-sentence'>
          {randomPhrase || 'Chargement...'}
        </p>
        <div className='brc-buttons-box'>
          <button className='brc-buttons' onClick={handleClick}>
            <MdAutorenew />
            Nouvelle partie
          </button>
        </div>
      </div>
    </main>
  );
}
