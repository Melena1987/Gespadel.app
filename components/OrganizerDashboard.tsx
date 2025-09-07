import React, { useState } from 'react';
import { MOCK_TOURNAMENTS, TOURNAMENT_MODEL, PLAYER_MODEL, REGISTRATION_MODEL } from '../constants';
import type { Tournament } from '../types';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { PlusIcon } from './icons/PlusIcon';
import { Modal } from './Modal';
import { TournamentForm } from './TournamentForm';
import { DataModelTable } from './DataModelTable';
import { CalendarIcon } from './icons/CalendarIcon';
import { LocationIcon } from './icons/LocationIcon';
import { UsersIcon } from './icons/UsersIcon';
import { ClipboardListIcon } from './icons/ClipboardListIcon';
import { LockClosedIcon } from './icons/LockClosedIcon';


interface OrganizerDashboardProps {
  onBack: () => void;
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

export const OrganizerDashboard: React.FC<OrganizerDashboardProps> = ({ onBack }) => {
  const [tournaments, setTournaments] = useState<Tournament[]>(MOCK_TOURNAMENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateTournament = (data: Omit<Tournament, 'id' | 'status'>) => {
    const newTournament: Tournament = {
      id: `t${tournaments.length + 1}`,
      status: 'OPEN',
      ...data,
    };
    setTournaments(prev => [newTournament, ...prev]);
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
            <button onClick={onBack} className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
            <ArrowLeftIcon />
            </button>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-violet-500">
                Panel de Organizador
            </h1>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 font-semibold text-white bg-cyan-600 rounded-lg shadow-md hover:bg-cyan-700 transition-all w-full sm:w-auto"
        >
          <PlusIcon />
          <span>Crear Torneo</span>
        </button>
      </header>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Mis Torneos</h2>
        <div className="space-y-4">
            {tournaments.map(t => (
                <div key={t.id} className="bg-slate-800/50 rounded-xl p-5 ring-1 ring-white/10 flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-grow">
                        <div className="flex items-center gap-4">
                           <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full border ${statusStyles[t.status]}`}>{t.status}</span>
                           <h3 className="text-lg font-bold text-white">{t.name}</h3>
                        </div>
                        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-sm text-slate-400">
                            <div className="flex items-center gap-1.5"><LocationIcon /> {t.clubName}</div>
                            <div className="flex items-center gap-1.5"><CalendarIcon /> {formatDateRange(t.startDate, t.endDate)}</div>
                            <div className="flex items-center gap-1.5"><UsersIcon /> {t.categories.masculine.length + t.categories.feminine.length} categorías</div>
                        </div>
                    </div>
                     <div className="flex-shrink-0 flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-slate-700 hover:bg-slate-600 rounded-md transition-colors"><ClipboardListIcon /> Ver Inscripciones</button>
                        <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-slate-700 hover:bg-slate-600 rounded-md transition-colors"><LockClosedIcon /> Cerrar Inscripciones</button>
                    </div>
                </div>
            ))}
        </div>
      </section>

      <section>
          <h2 className="text-2xl font-semibold mb-6">Modelo de Datos</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <DataModelTable title="Tournament" description="Entidad principal para cada evento." fields={TOURNAMENT_MODEL} />
              <DataModelTable title="Player" description="Representa a un participante individual." fields={PLAYER_MODEL} />
              <DataModelTable title="Registration" description="Vincula jugadores a un torneo específico." fields={REGISTRATION_MODEL} />
          </div>
      </section>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="3xl">
        <TournamentForm 
            onSubmit={handleCreateTournament}
            onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};
