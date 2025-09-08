import React, { useState } from 'react';
import type { Tournament } from '../types';
import { ShareIcon } from './icons/ShareIcon';

interface ShareButtonProps {
  tournament: Tournament;
  className?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ tournament, className }) => {
  const [feedback, setFeedback] = useState('');

  const handleShare = async () => {
    // Construct a clean URL without query params for sharing
    const cleanUrl = `${window.location.origin}${window.location.pathname}`;
    const text = `¡Mira este torneo de pádel: ${tournament.name}! Se celebra en ${tournament.clubName}.`;
    const shareData = { title: tournament.name, text, url: cleanUrl };

    if (navigator.share) {
        try {
            await navigator.share(shareData);
        } catch (error) {
            console.error('Error al compartir:', error);
        }
    } else {
        try {
            await navigator.clipboard.writeText(cleanUrl);
            setFeedback('¡Copiado!');
            setTimeout(() => setFeedback(''), 2000);
        } catch (error) {
            console.error('Error al copiar el enlace:', error);
            setFeedback('Error');
            setTimeout(() => setFeedback(''), 2000);
        }
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        className={`flex-shrink-0 flex items-center justify-center p-2.5 bg-slate-700 text-slate-200 rounded-lg shadow-md hover:bg-slate-600 transition-all ${className}`}
        aria-label="Compartir torneo"
      >
        <ShareIcon />
      </button>
      {feedback && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-xs rounded-md shadow-lg whitespace-nowrap animate-fade-in-out z-10">
          {feedback}
        </div>
      )}
    </div>
  );
};