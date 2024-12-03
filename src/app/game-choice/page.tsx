'use server';

import * as React from 'react';

import '@/styles/views/pages/home.scss';

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
          <button className='brc-buttons pong'>pong</button>
          <button className='brc-buttons pac-man'>pac-man</button>
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
