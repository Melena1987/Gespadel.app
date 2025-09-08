
import React, { useState } from 'react';
import type { Tournament, TournamentStatus, Registration, Player } from '../types';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { PlusIcon } from './icons/PlusIcon';
import { Modal } from './Modal';
import { CalendarIcon } from './icons/CalendarIcon';
import { LocationIcon } from './icons/LocationIcon';
import { UsersIcon } from './icons/UsersIcon';
import { ClipboardListIcon } from './icons/ClipboardListIcon';
import { LockClosedIcon } from './icons/LockClosedIcon';
import { RegistrationsModal } from './RegistrationsModal';
import { PencilIcon } from './icons/PencilIcon';
import { TrashIcon } from './icons/TrashIcon';
import { CurrencyEuroIcon } from './icons/CurrencyEuroIcon';
import { ExternalLinkIcon } from './icons/ExternalLinkIcon';


interface OrganizerDashboardProps {
  onBack: () => void;
  tournaments: Tournament[];
  registrations: Registration[];
  players: Player[];
  onCloseRegistrationsRequest: (tournamentId: string) => void;
  onCreateTournamentRequest: () => void;
  onEditTournament: (tournament: Tournament) => void;
  onDeleteTournamentRequest: (tournament: Tournament) => void;
  onViewTournament: (tournamentId: string) => void;
  onViewPlayer: (playerId: string) => void;
  onCancelRegistration: (registrationId: string) => void;
}

const statusStyles: Record<Tournament['status'], string> = {
    OPEN: 'bg-green-500/20 text-green-400 border-green-500/30',
    CLOSED: 'bg-red-500/20 text-red-400 border-red-500/30',
    IN_PROGRESS: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    FINISHED: 'bg-slate-600/20 text-slate-400 border-slate-600/30',
}

const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return `${startDate.toLocaleDateString('es-ES')} - ${endDate.toLocaleDateString('es-ES')}`;
}

export const OrganizerDashboard: React.FC<OrganizerDashboardProps> = ({ onBack, tournaments, registrations, players, onCloseRegistrationsRequest, onCreateTournamentRequest, onEditTournament, onDeleteTournamentRequest, onViewTournament, onViewPlayer, onCancelRegistration }) => {
  const [viewingTournament, setViewingTournament] = useState<Tournament | null>(null);

  const handleViewRegistrations = (tournament: Tournament) => {
    setViewingTournament(tournament);
  };

  const handleCloseRegistrationsModal = () => {
    setViewingTournament(null);
  };
  

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
            <button onClick={onBack} className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
            <ArrowLeftIcon />
            </button>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-violet-500 logo-gradient">
                Panel de Organizador
            </h1>
        </div>
        <button
          onClick={onCreateTournamentRequest}
          className="flex items-center justify-center gap-2 px-5 py-2.5 font-semibold text-white bg-cyan-600 rounded-lg shadow-md hover:bg-cyan-700 transition-all w-full sm:w-auto"
        >
          <PlusIcon />
          <span>Crear Torneo</span>
        </button>
      </header>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Mis Torneos</h2>
        <div className="space-y-4">
            {tournaments.map(t => {
                const registrationCount = registrations.filter(r => r.tournamentId === t.id && r.status !== 'CANCELLED').length;
                return (
                    <div key={t.id} className="bg-slate-800/50 rounded-xl p-4 ring-1 ring-white/10 flex flex-col sm:flex-row items-center gap-5">
                        <button onClick={() => onViewTournament(t.id)} className="flex-shrink-0 w-full sm:w-32 h-32 sm:h-20 block focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500 rounded-lg cursor-pointer">
                            {t.posterImage ? (
                            <img src={t.posterImage} alt={`Cartel de ${t.name}`} className="w-full h-full object-cover rounded-lg"/>
                            ) : (
                            <div className="w-full h-full bg-slate-900/75 rounded-lg flex items-center justify-center">
                                    <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-violet-500 logo-gradient">
                                        GESPADEL
                                    </span>
                            </div>
                            )}
                        </button>
                        <div className="flex-grow w-full">
                            <div className="flex items-center gap-4 mb-2">
                            <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full border ${statusStyles[t.status]}`}>{t.status}</span>
                            <h3 className="text-lg font-bold text-white">
                                <button onClick={() => onViewTournament(t.id)} className="hover:underline text-left transition-colors hover:text-cyan-400 focus:outline-none focus:text-cyan-400">
                                    {t.name}
                                </button>
                            </h3>
                            </div>
                            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400">
                                <div className="flex items-center gap-1.5">
                                    <LocationIcon />
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(t.clubName)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-cyan-400 underline hover:text-cyan-300 transition-colors"
                                    >
                                        <span>{t.clubName}</span>
                                        <ExternalLinkIcon className="h-3.5 w-3.5" />
                                    </a>
                                </div>
                                <div className="flex items-center gap-1.5"><CalendarIcon /> {formatDateRange(t.startDate, t.endDate)}</div>
                                <div className="flex items-center gap-1.5"><UsersIcon /> {registrationCount} inscritos</div>
                                {t.price > 0 && <div className="flex items-center gap-1.5 text-cyan-400 font-semibold"><CurrencyEuroIcon /> {t.price}€ / pareja<span className="text-slate-400 font-normal text-xs ml-1">(pago en el club)</span></div>}
                            </div>
                        </div>
                        <div className="flex-shrink-0 grid grid-cols-2 lg:grid-cols-4 gap-2 w-full lg:w-max">
                            <button onClick={() => onEditTournament(t)} className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold bg-slate-700 hover:bg-slate-600 rounded-md transition-colors"><PencilIcon /> Editar</button>
                            <button onClick={() => handleViewRegistrations(t)} className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold bg-slate-700 hover:bg-slate-600 rounded-md transition-colors"><ClipboardListIcon /> Inscripciones</button>
                            <button 
                                onClick={() => onCloseRegistrationsRequest(t.id)} 
                                disabled={t.status !== 'OPEN'}
                                className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold bg-slate-700 hover:bg-slate-600 rounded-md transition-colors disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed"
                            >
                                <LockClosedIcon /> 
                                {t.status === 'OPEN' ? 'Cerrar' : 'Cerrado'}
                            </button>
                            <button 
                                onClick={() => onDeleteTournamentRequest(t)}
                                className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold bg-red-900/50 text-red-400 hover:bg-red-900/75 rounded-md transition-colors"
                            >
                                <TrashIcon /> 
                                Eliminar
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
      </section>

      {viewingTournament && (
        <Modal isOpen={!!viewingTournament} onClose={handleCloseRegistrationsModal} size="2xl">
            <RegistrationsModal
                tournament={viewingTournament}
                registrations={registrations.filter(r => r.tournamentId === viewingTournament?.id)}
                players={players}
                onClose={handleCloseRegistrationsModal}
                onViewPlayer={onViewPlayer}
                onCancelRegistration={onCancelRegistration}
            />
        </Modal>
      )}
    </div>
  );
};
