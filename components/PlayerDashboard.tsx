// Fix: Create file content for PlayerDashboard.tsx
import React, { useState } from 'react';
import { MOCK_TOURNAMENTS, MOCK_REGISTRATIONS } from '../constants';
import type { Tournament, Player, Registration } from '../types';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { Modal } from './Modal';
import { RegistrationModal } from './RegistrationModal';
import { ProfileModal } from './ProfileModal';
import { LocationIcon } from './icons/LocationIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface PlayerDashboardProps {
  onBack: () => void;
  tournaments: Tournament[];
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

export const PlayerDashboard: React.FC<PlayerDashboardProps> = ({ onBack, tournaments }) => {
  const [registrations, setRegistrations] = useState<Registration[]>(MOCK_REGISTRATIONS);
  const [activeTab, setActiveTab] = useState<'registrations' | 'search'>(
    MOCK_REGISTRATIONS.length > 0 ? 'registrations' : 'search'
  );
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [player, setPlayer] = useState<Player>({ 
      id: 'p1', 
      name: 'Alex Doe', 
      email: 'alex@example.com', 
      phone: '611223344',
      gender: 'masculine',
      category: '3ª',
      profilePicture: null
    });

  const handleRegisterClick = (tournament: Tournament) => {
    setSelectedTournament(tournament);
  };

  const handleCloseModal = () => {
    setSelectedTournament(null);
  };

  const handleRegistrationSubmit = (registrationData: any) => {
    if (!selectedTournament) return;
    
    const newRegistration: Registration = {
        id: `reg${registrations.length + 1}`,
        tournamentId: selectedTournament.id,
        player1Id: player.id,
        player2Id: registrationData.player2 ? `p_temp_${Date.now()}` : undefined, 
        category: registrationData.category,
        gender: registrationData.gender,
        registrationDate: new Date().toISOString(),
        timePreferences: registrationData.timePreferences,
    };
    
    setRegistrations(prev => [newRegistration, ...prev]);
    alert(`¡Inscripción para ${registrationData.player1.name} en ${selectedTournament.name} completada!`);
    handleCloseModal();
    setActiveTab('registrations');
  };

  const handleProfileSave = (updatedPlayer: Player) => {
    setPlayer(updatedPlayer);
    setIsProfileModalOpen(false);
  }
  
  const registeredTournamentIds = new Set(registrations.filter(r => r.player1Id === player.id).map(r => r.tournamentId));
  const registeredTournaments = tournaments.filter(t => registeredTournamentIds.has(t.id));
  const availableTournaments = tournaments.filter(t => !registeredTournamentIds.has(t.id));
  
  const tournamentsToShow = activeTab === 'registrations' ? registeredTournaments : availableTournaments;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
            <button onClick={onBack} className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
                <ArrowLeftIcon />
            </button>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-violet-500">
                Panel de Jugador
            </h1>
        </div>
        <button
          onClick={() => setIsProfileModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 font-semibold text-white bg-slate-700 rounded-lg hover:bg-slate-600 transition-all w-full sm:w-auto"
        >
          <UserCircleIcon />
          <span>Mi Perfil</span>
        </button>
      </header>

      <div className="mb-6 flex border-b border-slate-700">
        <button 
          onClick={() => setActiveTab('registrations')} 
          className={`px-4 py-2 font-semibold transition-colors ${activeTab === 'registrations' ? 'text-violet-400 border-b-2 border-violet-400' : 'text-slate-400 hover:text-white'}`}
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
              const registration = activeTab === 'registrations' ? registrations.find(r => r.tournamentId === t.id && r.player1Id === player.id) : null;
              return (
                <div key={t.id} className="bg-slate-800/50 rounded-xl shadow-lg ring-1 ring-white/10 flex flex-col transition-all duration-300 hover:scale-[1.02] hover:shadow-violet-500/10">
                  {t.posterImage ? (
                    <img src={t.posterImage} alt={`Cartel de ${t.name}`} className="rounded-t-xl h-48 w-full object-cover"/>
                  ) : (
                    <div className="rounded-t-xl h-48 w-full bg-slate-900/75 flex items-center justify-center">
                      <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-violet-500">
                        GESPADEL
                      </span>
                    </div>
                  )}
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-white pr-2">{t.name}</h3>
                        <span className={`flex-shrink-0 inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full ${statusStyles[t.status]}`}>{t.status}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-slate-400 mb-4">
                        <LocationIcon /> {t.clubName}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-slate-400 mb-4">
                        <CalendarIcon /> {formatDate(t.startDate)}
                    </div>
                     {registration && (
                         <div className="flex items-center justify-center gap-2 bg-slate-700/50 text-slate-300 text-sm font-semibold p-2 rounded-md text-center mb-4">
                            <CheckCircleIcon />
                            <span>Inscrito en {registration.category} {registration.gender === 'masculine' ? 'Masculina' : 'Femenina'}</span>
                        </div>
                      )}
                    <p className="text-sm text-slate-400 mb-4 flex-grow">{t.description}</p>
                    <button 
                      onClick={() => activeTab === 'search' && handleRegisterClick(t)}
                      disabled={(t.status !== 'OPEN' && activeTab === 'search') || activeTab === 'registrations'}
                      className={`w-full mt-auto px-4 py-2 font-semibold rounded-lg shadow-md transition-all ${
                          activeTab === 'registrations' 
                              ? 'bg-slate-700 text-slate-300 cursor-not-allowed'
                              : 'text-white bg-violet-600 hover:bg-violet-700 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:text-slate-400'
                      }`}
                    >
                      {activeTab === 'registrations' ? 'Inscrito' : (t.status === 'OPEN' ? 'Inscribirme' : 'Inscripciones cerradas')}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {selectedTournament && (
        <Modal isOpen={!!selectedTournament} onClose={handleCloseModal} size="2xl">
          <RegistrationModal 
            player={player}
            tournament={selectedTournament}
            onClose={handleCloseModal}
            onSubmit={handleRegistrationSubmit}
          />
        </Modal>
      )}

      <Modal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} size="md">
          <ProfileModal 
            player={player}
            onClose={() => setIsProfileModalOpen(false)}
            onSave={handleProfileSave}
          />
      </Modal>
    </div>
  );
};