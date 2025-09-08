// Fix: Create file content for PlayerDashboard.tsx
import React, { useState } from 'react';
import type { Tournament, Player, Registration } from '../types';
import { Modal } from './Modal';
import { RegistrationModal } from './RegistrationModal';
import { LocationIcon } from './icons/LocationIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { ShareButton } from './ShareButton';
import { CurrencyEuroIcon } from './icons/CurrencyEuroIcon';

interface PlayerDashboardProps {
  tournaments: Tournament[];
  player: Player | null;
  registrations: Registration[];
  onRegister: (registrationData: any, tournament: Tournament) => void;
  onViewTournament: (tournamentId: string) => void;
  onLoginRequest: () => void;
  onCancelRegistration: (registrationId: string) => void;
}

const statusStyles: Record<Tournament['status'], string> = {
    OPEN: 'bg-green-500/20 text-green-400 ring-1 ring-green-500/30',
    CLOSED: 'bg-red-500/20 text-red-400 ring-1 ring-red-500/30',
    IN_PROGRESS: 'bg-cyan-500/20 text-cyan-400 ring-1 ring-cyan-500/30',
    FINISHED: 'bg-slate-600/20 text-slate-400 ring-1 ring-slate-600/30',
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
}

export const PlayerDashboard: React.FC<PlayerDashboardProps> = ({
    tournaments,
    player,
    registrations,
    onRegister,
    onViewTournament,
    onLoginRequest,
    onCancelRegistration,
}) => {
  const defaultTab = player && registrations.some(r => r.player1Id === player.id && r.status !== 'CANCELLED') ? 'registrations' : 'search';
  const [activeTab, setActiveTab] = useState<'registrations' | 'search'>(defaultTab);
  
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);

  const handleRegisterClick = (tournament: Tournament) => {
    if (!player) {
      onLoginRequest();
    } else {
      setSelectedTournament(tournament);
    }
  };

  const handleCloseModal = () => {
    setSelectedTournament(null);
  };

  const handleRegistrationSubmit = (registrationData: any) => {
    if (!selectedTournament) return;
    onRegister(registrationData, selectedTournament);
    handleCloseModal();
    setActiveTab('registrations');
  };
  
  const registeredTournamentIds = new Set(registrations.filter(r => player && r.player1Id === player.id && r.status !== 'CANCELLED').map(r => r.tournamentId));
  const registeredTournaments = tournaments.filter(t => registeredTournamentIds.has(t.id));
  const availableTournaments = tournaments.filter(t => !registeredTournamentIds.has(t.id));
  
  const tournamentsToShow = activeTab === 'registrations' ? registeredTournaments : availableTournaments;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex border-b border-slate-700">
        <button 
          onClick={() => setActiveTab('registrations')} 
          disabled={!player}
          className={`px-4 py-2 font-semibold transition-colors ${activeTab === 'registrations' ? 'text-violet-400 border-b-2 border-violet-400' : 'text-slate-400 hover:text-white'} disabled:text-slate-600 disabled:cursor-not-allowed`}
          aria-current={activeTab === 'registrations'}
        >
          Mis Inscripciones
        </button>
        <button 
          onClick={() => setActiveTab('search')}
          className={`px-4 py-2 font-semibold transition-colors ${activeTab === 'search' ? 'text-violet-400 border-b-2 border-violet-400' : 'text-slate-400 hover:text-white'}`}
          aria-current={activeTab === 'search'}
        >
          Buscar Torneos
        </button>
      </div>

      <section>
        {tournamentsToShow.length === 0 ? (
          <div className="text-center py-16 text-slate-400 bg-slate-800/20 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">{activeTab === 'registrations' ? 'Sin Inscripciones' : 'No hay torneos disponibles'}</h3>
              <p>{activeTab === 'registrations' ? "Aún no te has inscrito a ningún torneo. ¡Busca uno y apúntate!" : "Prueba de nuevo más tarde o revisa tus inscripciones."}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournamentsToShow.map(t => {
              const registration = activeTab === 'registrations' && player ? registrations.find(r => r.tournamentId === t.id && r.player1Id === player.id && r.status !== 'CANCELLED') : null;
              return (
                <div key={t.id} className="bg-slate-800/50 rounded-xl shadow-lg ring-1 ring-white/10 flex flex-col transition-all duration-300 hover:scale-[1.02] hover:shadow-violet-500/10">
                  <button onClick={() => onViewTournament(t.id)} className="w-full block focus:outline-none focus:ring-2 focus:ring-inset focus:ring-violet-500 rounded-t-xl cursor-pointer">
                    {t.posterImage ? (
                      <img src={t.posterImage} alt={`Cartel de ${t.name}`} className="rounded-t-xl h-48 w-full object-cover"/>
                    ) : (
                      <div className="rounded-t-xl h-48 w-full bg-slate-900/75 flex items-center justify-center">
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-violet-500">
                          GESPADEL
                        </span>
                      </div>
                    )}
                  </button>
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-white pr-2">
                          <button onClick={() => onViewTournament(t.id)} className="hover:underline text-left transition-colors hover:text-violet-400 focus:outline-none focus:text-violet-400">
                            {t.name}
                          </button>
                        </h3>
                        <span className={`flex-shrink-0 inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full ${statusStyles[t.status]}`}>{t.status}</span>
                    </div>
                    <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-1.5 text-sm text-slate-400">
                            <LocationIcon /> {t.clubName}
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-slate-400">
                            <CalendarIcon /> {formatDate(t.startDate)}
                        </div>
                         {t.price > 0 &&
                            <div className="flex items-center gap-1.5 text-sm text-cyan-400 font-semibold">
                                <CurrencyEuroIcon /> {t.price}€ por pareja <span className="text-slate-400 font-normal text-xs ml-1">(pago en el club)</span>
                            </div>
                        }
                    </div>
                     {registration && (
                         <div className="flex items-center justify-center gap-2 bg-slate-700/50 text-slate-300 text-sm font-semibold p-2 rounded-md text-center mb-4">
                            <CheckCircleIcon />
                            <span>Inscrito en {registration.category} {registration.gender === 'masculine' ? 'Masculina' : 'Femenina'}</span>
                        </div>
                      )}
                    <p className="text-sm text-slate-400 mb-4 flex-grow">{t.description}</p>
                    <div className="mt-auto flex items-stretch gap-3">
                        <div className="flex-grow">
                            {activeTab === 'registrations' && registration ? (
                                t.status === 'OPEN' ? (
                                <button
                                    onClick={() => onCancelRegistration(registration.id)}
                                    className="w-full px-4 py-2 font-semibold rounded-lg shadow-md transition-all text-white bg-red-600 hover:bg-red-700"
                                >
                                    Anular Inscripción
                                </button>
                                ) : (
                                <button
                                    disabled
                                    className="w-full px-4 py-2 font-semibold rounded-lg shadow-md transition-all bg-slate-700 text-slate-400 cursor-not-allowed"
                                >
                                    Inscrito
                                </button>
                                )
                            ) : (
                                <button
                                onClick={() => handleRegisterClick(t)}
                                disabled={t.status !== 'OPEN'}
                                className="w-full px-4 py-2 font-semibold rounded-lg shadow-md transition-all text-white bg-violet-600 hover:bg-violet-700 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:text-slate-400"
                                >
                                {t.status === 'OPEN' ? 'Inscribirme' : 'Inscripciones cerradas'}
                                </button>
                            )}
                        </div>
                        <ShareButton tournament={t} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {selectedTournament && player && (
        <Modal isOpen={!!selectedTournament} onClose={handleCloseModal} size="2xl">
          <RegistrationModal 
            player={player}
            tournament={selectedTournament}
            onClose={handleCloseModal}
            onSubmit={handleRegistrationSubmit}
          />
        </Modal>
      )}
    </div>
  );
};
