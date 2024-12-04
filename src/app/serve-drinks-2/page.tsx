'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { FaGlassMartiniAlt } from 'react-icons/fa';

import '@/styles/views/pages/home.scss';

export default function ServeDrinks() {
  const [isCupFilled, setIsCupFilled] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    setIsCupFilled(true);
    setTimeout(() => {
      router.push('/bonus');
    }, 10000);
  };

  return (
    <main>
      <div className='brc-background'></div>
      <div className='brc-filling-container'>
        <h2>Veuillez placer le verre du joueur 2, pour le remplissage</h2>
        <div className='brc-buttons-box'>
          <button className='brc-buttons liquide-btn' onClick={handleClick}>
            <div className='water-ctr'>
              <p>
                <FaGlassMartiniAlt /> Remplir
              </p>
              <div className={`water ${isCupFilled ? 'active' : ''}`}></div>
            </div>
          </button>
        </div>
      </div>
    </main>
  );
}
