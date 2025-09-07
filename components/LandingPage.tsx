import React from 'react';

interface LandingPageProps {
  onNavigate: (view: 'organizer' | 'player') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
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
          className="bg-slate-800/50 rounded-xl shadow-lg ring-1 ring-white/10 p-8 flex flex-col items-center text-center cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/20"
          onClick={() => onNavigate('organizer')}
        >
          <h2 className="text-3xl font-bold text-white mb-3">Soy Organizador</h2>
          <p className="text-slate-400 mb-6">Crea y gestiona tus torneos de forma sencilla y eficiente.</p>
          <button className="px-8 py-3 font-semibold text-white bg-cyan-600 rounded-lg shadow-md hover:bg-cyan-700 transition-all">
            Ir al Panel de Organizador
          </button>
        </div>
        
        <div 
          className="bg-slate-800/50 rounded-xl shadow-lg ring-1 ring-white/10 p-8 flex flex-col items-center text-center cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-violet-500/20"
          onClick={() => onNavigate('player')}
        >
          <h2 className="text-3xl font-bold text-white mb-3">Soy Jugador</h2>
          <p className="text-slate-400 mb-6">Descubre torneos cerca de ti y apúntate a la competición.</p>
          <button className="px-8 py-3 font-semibold text-white bg-violet-600 rounded-lg shadow-md hover:bg-violet-700 transition-all">
            Buscar Torneos
          </button>
        </div>
      </div>
    </div>
  );
};