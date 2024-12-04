'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { MdAutorenew } from 'react-icons/md';

import '@/styles/views/pages/home.scss';

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
      <div className='brc-filling-container'>
        <h2>{randomPhrase || 'Chargement...'}</h2>
        <div className='brc-buttons-box'>
          <button className='brc-buttons liquide-btn' onClick={handleClick}>
            <MdAutorenew /> Nouvelle partie
          </button>
        </div>
      </div>
    </main>
  );
}
