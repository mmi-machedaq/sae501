'use server';

import * as React from 'react';

import '@/styles/views/pages/home.scss';

import Logo from '~/icons/logo.svg';

export default async function Home() {
  return (
    <main>
      <div className='background'></div>
      <div className='barcade-container'>
        <div className='barcade-logo'>
          <Logo />
        </div>
        <div className='barcade-buttons-box'>
          <button className='barcade-buttons'>tequila</button>
          <button className='barcade-buttons'>margarita</button>
          <button className='barcade-buttons'>paloma</button>
          <button className='barcade-buttons'>mojito</button>
          <button className='barcade-buttons'>aviatioin</button>
          <button className='barcade-buttons'>paper plane</button>
        </div>
        <div className='barcade-footer'>
          <p>
            L'abus d'alcool est dangereux pour la santé, à consommer avec
            modération
          </p>
        </div>
      </div>
    </main>
  );
}
