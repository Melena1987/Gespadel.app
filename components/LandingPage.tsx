import React from 'react';
import { MailIcon } from './icons/MailIcon';

interface LandingPageProps {
  onOrganizerLoginRequest: () => void;
  onPlayerGoogleLoginRequest: () => void;
  onPlayerEmailLoginRequest: () => void;
}

const GoogleIcon = () => (
    <svg className="w-5 h-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path fill="currentColor" d="M488 261.8C488 403.3 381.5 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-76.2 64.5C308.6 102.3 282.7 96 248 96c-88.8 0-160.1 71.1-160.1 160s71.3 160 160.1 160c97.2 0 132.8-62.4 140.8-92.2H248v-73.6h239.2c1.2 12.3 1.8 24.9 1.8 38.6z"></path>
    </svg>
);


export const LandingPage: React.FC<LandingPageProps> = ({ onOrganizerLoginRequest, onPlayerGoogleLoginRequest, onPlayerEmailLoginRequest }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-4">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-violet-500">
          GESPADEL
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Tu plataforma central para organizar y participar en torneos de pádel. Gestiona tus eventos o encuentra tu próximo desafío.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <div 
          className="bg-slate-800/50 rounded-xl shadow-lg ring-1 ring-white/10 p-8 flex flex-col items-center text-center transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/20"
        >
          <h2 className="text-3xl font-bold text-white mb-3">Soy Organizador</h2>
          <p className="text-slate-400 mb-6">Crea y gestiona tus torneos de forma sencilla y eficiente.</p>
          <button 
            onClick={onOrganizerLoginRequest}
            className="w-full px-8 py-3 font-semibold text-white bg-cyan-600 rounded-lg shadow-md hover:bg-cyan-700 transition-all">
            Iniciar Sesión / Registrarse
          </button>
        </div>
        
        <div 
          className="bg-slate-800/50 rounded-xl shadow-lg ring-1 ring-white/10 p-8 flex flex-col items-center text-center transition-all duration-300 hover:scale-105 hover:shadow-violet-500/20"
        >
          <h2 className="text-3xl font-bold text-white mb-3">Soy Jugador</h2>
          <p className="text-slate-400 mb-6">Descubre torneos cerca de ti y apúntate a la competición.</p>
          <div className="w-full space-y-3">
             <button 
                onClick={onPlayerGoogleLoginRequest}
                className="w-full flex items-center justify-center gap-3 px-8 py-3 font-semibold text-slate-800 bg-white rounded-lg shadow-md hover:bg-slate-200 transition-all">
                <GoogleIcon />
                Continuar con Google
             </button>
             <button 
                onClick={onPlayerEmailLoginRequest}
                className="w-full flex items-center justify-center gap-3 px-8 py-3 font-semibold text-white bg-violet-600 rounded-lg shadow-md hover:bg-violet-700 transition-all">
                <MailIcon />
                Continuar con Email
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};