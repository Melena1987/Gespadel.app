import React, { useState } from 'react';
import type { Tournament, Player, Registration, Category } from '../types';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { LocationIcon } from './icons/LocationIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { UsersIcon } from './icons/UsersIcon';
import { Modal } from './Modal';
import { RegistrationModal } from './RegistrationModal';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { ShareButton } from './ShareButton';

interface TournamentDetailPageProps {
  tournament: Tournament;
  onBack: () => void;
  player: Player | null;
  registrations: Registration[];
  onRegister: (registrationData: any, tournament: Tournament) => void;
  onLoginRequest: () => void;
  onDeleteRegistration: (registrationId: string) => void;
}

const statusStyles: Record<Tournament['status'], string> = {
    OPEN: 'bg-green-500/20 text-green-400 border-green-500/30',
    CLOSED: 'bg-red-500/20 text-red-400 border-red-500/30',
    IN_PROGRESS: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    FINISHED: 'bg-slate-600/20 text-slate-400 border-slate-600/30',
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
        dateStyle: 'long',
        timeStyle: 'short',
    });
}

const CategoryPill: React.FC<{category: Category, gender: 'masculine' | 'feminine'}> = ({ category, gender }) => {
    const color = gender === 'masculine' ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400' : 'border-pink-500/30 bg-pink-500/10 text-pink-400';
    return <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${color}`}>{category}</span>;
}

export const TournamentDetailPage: React.FC<TournamentDetailPageProps> = ({ tournament, onBack, player, registrations, onRegister, onLoginRequest, onDeleteRegistration }) => {
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  
  const registrationCount = registrations.filter(r => r.tournamentId === tournament.id).length;
  const registration = player ? registrations.find(r => r.tournamentId === tournament.id && r.player1Id === player.id) : null;
  const isRegistered = !!registration;
  const canRegister = tournament.status === 'OPEN' && !isRegistered;

  const handleRegistrationSubmit = (registrationData: any) => {
    onRegister(registrationData, tournament);
    setIsRegistrationModalOpen(false);
  };
  
  const handleRegisterClick = () => {
    if (!canRegister) return;

    if (!player) {
      onLoginRequest();
    } else {
      setIsRegistrationModalOpen(true);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="flex items-center mb-8 gap-4">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
          <ArrowLeftIcon />
          <span className="hidden sm:inline">Volver</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-4">
            {tournament.posterImage ? (
                <img src={tournament.posterImage} alt={`Cartel de ${tournament.name}`} className="w-full object-cover rounded-xl shadow-lg ring-1 ring-white/10"/>
            ) : (
                <div className="w-full aspect-[3/4] bg-slate-800/50 rounded-xl flex items-center justify-center ring-1 ring-white/10">
                    <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-violet-500">GESPADEL</span>
                </div>
            )}
            
            <div className="flex items-stretch gap-3">
              <div className="flex-grow">
                {isRegistered && registration ? (
                    tournament.status === 'OPEN' ? (
                        <button 
                            onClick={() => onDeleteRegistration(registration.id)}
                            className="w-full h-full px-6 py-3 font-semibold text-lg text-white bg-red-600 rounded-lg shadow-md hover:bg-red-700 transition-all"
                        >
                            Anular Inscripción
                        </button>
                    ) : (
                        <div className="h-full flex items-center justify-center gap-2 w-full px-6 py-3 font-semibold text-lg bg-green-500/20 text-green-300 rounded-lg shadow-md">
                            <CheckCircleIcon />
                            <span>Inscrito</span>
                        </div>
                    )
                ) : (
                    <button onClick={handleRegisterClick} disabled={!canRegister} className="w-full h-full px-6 py-3 font-semibold text-lg text-white bg-violet-600 rounded-lg shadow-md hover:bg-violet-700 transition-all disabled:bg-slate-600 disabled:cursor-not-allowed disabled:text-slate-400">
                        {tournament.status === 'OPEN' ? 'Inscribirme Ahora' : 'Inscripciones Cerradas'}
                    </button>
                )}
              </div>
              <ShareButton tournament={tournament} className="px-4 text-lg" />
            </div>
        </div>

        <div className="md:col-span-2">
            <div className="flex items-center gap-4 mb-3">
                <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full border ${statusStyles[tournament.status]}`}>{tournament.status}</span>
                <h1 className="text-3xl font-bold text-white">{tournament.name}</h1>
            </div>

            <div className="space-y-4 text-slate-300 mb-8 border-b border-slate-700 pb-8">
                <div className="flex items-center gap-3"><LocationIcon /> <span>{tournament.clubName}</span></div>
                <div className="flex items-center gap-3"><CalendarIcon /> <span>{formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}</span></div>
                <div className="flex items-center gap-3"><UsersIcon /> <span>{registrationCount} inscritos</span></div>
            </div>

            <div className="mb-8">
                <h2 className="text-xl font-bold text-white mb-3">Descripción</h2>
                <p className="text-slate-400 whitespace-pre-line">{tournament.description}</p>
            </div>

            <div>
                <h2 className="text-xl font-bold text-white mb-4">Categorías</h2>
                <div className="space-y-4">
                    {tournament.categories.masculine.length > 0 && (
                        <div>
                            <h3 className="font-semibold text-cyan-400 mb-2">Masculinas</h3>
                            <div className="flex flex-wrap gap-2">{tournament.categories.masculine.map(cat => <CategoryPill key={`m-${cat}`} category={cat} gender="masculine" />)}</div>
                        </div>
                    )}
                     {tournament.categories.feminine.length > 0 && (
                        <div>
                            <h3 className="font-semibold text-pink-400 mb-2">Femeninas</h3>
                            <div className="flex flex-wrap gap-2">{tournament.categories.feminine.map(cat => <CategoryPill key={`f-${cat}`} category={cat} gender="feminine" />)}</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
       {isRegistrationModalOpen && player && (
        <Modal isOpen={isRegistrationModalOpen} onClose={() => setIsRegistrationModalOpen(false)} size="2xl">
          <RegistrationModal 
            player={player}
            tournament={tournament}
            onClose={() => setIsRegistrationModalOpen(false)}
            onSubmit={handleRegistrationSubmit}
          />
        </Modal>
      )}
    </div>
  );
};