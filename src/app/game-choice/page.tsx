'use server';

import React from 'react';

import '@/styles/views/pages/home.scss';

import games from '@/data/games.json';

import Logo from '~/icons/logo.svg';

export default async function GameChoice() {
  return (
    <main>
      <div className='brc-background'></div>
      <div className='brc-container'>
        <div className='brc-logo'>
          <Logo />
        </div>
        <div className='brc-buttons-box game-choice'>
          {games.map((game, index) => (
            <button className={`brc-buttons ${game.name}`} key={index}>
              {game.name}
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
