'use client';

import React, { useEffect, useState } from 'react';

import '@/styles/views/pages/home.scss';

import phrases from '@/data/phrases.json';

export default function Bonus() {
  const [randomPhrase, setRandomPhrase] = useState('');

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * phrases.length);
    setRandomPhrase(phrases[randomIndex]);
  }, []);

  const handleClick = () => {
    window.location.href = '/';
  };

  return (
    <main>
      <div className='brc-background'></div>
      <div className='brc-filling-container'>
        <h2>{randomPhrase || 'Chargement...'}</h2>
        <div className='brc-buttons-box'>
          <button className='brc-buttons liquide-btn' onClick={handleClick}>
            Nouvelle partie
          </button>
        </div>
      </div>
    </main>
  );
}
