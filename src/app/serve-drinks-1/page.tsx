'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { LiaCocktailSolid } from 'react-icons/lia';

import '@/styles/views/pages/home.scss';
import '@/styles/views/pages/serve-drinks.scss';

export default function ServeDrinks() {
  const [isCupFilled, setIsCupFilled] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    setIsCupFilled(true);
    setTimeout(() => {
      router.push('/serve-drinks-2');
    }, 10000);
  };

  return (
    <main>
      <div className='brc-background'></div>
      <div className='brc-filling-container'>
        <div className='brc-drink-info'>
          <h2 className='drink-name'>
            <LiaCocktailSolid /> {localStorage.getItem('cocktail')}
          </h2>
          <span>Cocktail choisi</span>
        </div>
        <p className='brc-filling-container__instructions'>
          Placez le verre du joueur 1 sous la machine à cocktail, pour procéder
          au remplissage.
        </p>
        <div className='brc-buttons-box'>
          <button className='brc-buttons liquide-btn' onClick={handleClick}>
            <div className='water-ctr'>
              <p>Remplir</p>
              <div className={`water ${isCupFilled ? 'active' : ''}`}></div>
            </div>
          </button>
        </div>
      </div>
    </main>
  );
}
