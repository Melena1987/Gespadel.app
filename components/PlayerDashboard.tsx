import React, { useState } from 'react';
import { MOCK_TOURNAMENTS } from '../constants';
import type { Tournament } from '../types';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { LocationIcon } from './icons/LocationIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { UsersIcon } from './icons/UsersIcon';
import { Modal } from './Modal';
import { RegistrationModal } from './RegistrationModal';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { ProfileModal } from './ProfileModal';

interface PlayerDashboardProps {
  onBack: () => void;
}

const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });

export const PlayerDashboard: React.FC<PlayerDashboardProps> = ({ onBack }) => {
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const MOCK_PLAYER = { id: 'p1', name: 'Jugador de Prueba', email: 'player@test.com', phone: '600123456'};

  const handleRegister = (data: any) => {
    console.log('Registering with data:', data);
    alert(`¡Inscripción para ${data.player1.name} en ${selectedTournament?.name} realizada con éxito!`);
    setSelectedTournament(null);
  };
  
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="flex justify-between items-center mb-8">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
          <ArrowLeftIcon />
          <span>Volver</span>
        </button>
        <div className="flex items-center gap-4">
             <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-cyan-400">
                Panel de Jugador
            </h1>
             <button onClick={() => setIsProfileOpen(true)} className="text-slate-300 hover:text-white transition-colors">
                <UserCircleIcon />
            </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_TOURNAMENTS.filter(t => t.status === 'OPEN').map(tournament => (
          <div key={tournament.id} className="bg-slate-800/50 rounded-xl shadow-lg ring-1 ring-white/10 flex flex-col overflow-hidden transition-all duration-300 hover:ring-violet-500/50 hover:shadow-violet-500/10">
            {tournament.posterImage && <img src={tournament.posterImage} alt={tournament.name} className="h-40 w-full object-cover"/>}
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-xl font-bold text-white mb-2">{tournament.name}</h3>
              <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
                  <LocationIcon />
                  <span>{tournament.clubName}</span>
              </div>
              <p className="text-slate-400 text-sm mb-4 flex-grow">{tournament.description}</p>
              
              <div className="border-t border-slate-700/50 pt-4 space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-slate-300">
                      <CalendarIcon/> 
                      <span>{formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                      <UsersIcon/> 
                      <span>
                        Categorías: {tournament.categories.masculine.join(', ')} (M), {tournament.categories.feminine.join(', ')} (F)
                      </span>
                  </div>
              </div>

              <div className="mt-6">
                <button 
                  onClick={() => setSelectedTournament(tournament)}
                  className="w-full px-6 py-2 font-semibold text-white bg-violet-600 rounded-lg shadow-md hover:bg-violet-700 transition-all"
                >
                  Inscribirse
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {selectedTournament && (
        <Modal isOpen={!!selectedTournament} onClose={() => setSelectedTournament(null)} size="2xl">
          <RegistrationModal 
            tournament={selectedTournament}
            onClose={() => setSelectedTournament(null)}
            onSubmit={handleRegister}
          />
        </Modal>
      )}

       {isProfileOpen && (
        <Modal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} size="md">
          <ProfileModal player={MOCK_PLAYER} onClose={() => setIsProfileOpen(false)} />
        </Modal>
      )}

    </div>
  );
};
