import React from 'react';

interface CookieConsentProps {
  onAccept: () => void;
  onOpenPrivacyPolicy: () => void;
}

export const CookieConsent: React.FC<CookieConsentProps> = ({ onAccept, onOpenPrivacyPolicy }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4" role="dialog" aria-live="polite" aria-label="Aviso de cookies">
      <div className="max-w-4xl mx-auto bg-slate-800/80 backdrop-blur-sm rounded-lg shadow-lg ring-1 ring-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 p-4">
        <p className="text-sm text-slate-300 text-center sm:text-left">
          Utilizamos cookies para mejorar tu experiencia. Al continuar navegando, aceptas nuestra{' '}
          <button onClick={onOpenPrivacyPolicy} className="font-semibold text-cyan-400 hover:underline focus:outline-none focus:underline">
            política de privacidad y uso de cookies
          </button>.
        </p>
        <button
          onClick={onAccept}
          className="flex-shrink-0 px-5 py-2 font-semibold text-white bg-cyan-600 rounded-lg shadow-md hover:bg-cyan-700 transition-all text-sm"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
};
