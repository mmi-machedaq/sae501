'use server';

import React from 'react';

import '@/styles/views/pages/home.scss';

import cocktails from '@/data/cocktails.json';

import Logo from '~/icons/logo.svg';

export default async function Home() {
  return (
    <main>
      <div className='brc-background'></div>
      <div className='brc-container'>
        <div className='brc-logo'>
          <Logo />
        </div>
        <div className='brc-buttons-box'>
          {cocktails.map((cocktail, index) => (
            <button className={`brc-buttons ${cocktail.name}`} key={index}>
              {cocktail.name}
            </button>
          ))}
        </div>
        <div className='brc-footer'>
          <p>
            L'abus d'alcool est dangereux pour la santé, à consommer avec
            modération
          </p>
        </div>
      </div>
    </main>
  );
}
