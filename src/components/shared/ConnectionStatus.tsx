'use client';

import { useEffect, useState } from 'react';

import { sendCocktailRecipe } from '@/services/sendCocktailRecipe';

export default function ConnectionStatus() {
  const [status, setStatus] = useState<
    'loading' | 'connected' | 'disconnected'
  >('loading');

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const data = await sendCocktailRecipe({ test: true });
        const message = data.message;

        if (message.status === true) {
          setStatus('connected');
        } else {
          setStatus('disconnected');
        }
      } catch (error) {
        console.error("Erreur lors de la connexion à l'API :", error);
        setStatus('disconnected');
      }
    };

    checkConnection();
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: '50px',
        right: '50px',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: '1rem',
        padding: '1rem 1.5rem',
        fontWeight: 'bold',
      }}
    >
      {status === 'loading' && <span>🔄 Vérification...</span>}
      {status === 'connected' && <span>🟢 Connecté</span>}
      {status === 'disconnected' && <span>🔴 Déconnecté</span>}
    </div>
  );
}
