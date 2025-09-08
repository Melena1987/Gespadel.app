import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { OrganizerDashboard } from './components/OrganizerDashboard';
import { PlayerDashboard } from './components/PlayerDashboard';
import { TournamentDetailPage } from './components/TournamentDetailPage';
import { MOCK_TOURNAMENTS, MOCK_REGISTRATIONS, MOCK_PLAYERS } from './constants';
import type { Tournament, TournamentStatus, Player, Registration } from './types';

type View = 'landing' | 'organizer' | 'player' | 'tournamentDetail';

const App: React.FC = () => {
  const [view, setView] = useState<View>('landing');
  const [previousView, setPreviousView] = useState<View>('landing');
  const [selectedTournamentId, setSelectedTournamentId] = useState<string | null>(null);

  const [tournaments, setTournaments] = useState<Tournament[]>(MOCK_TOURNAMENTS);
  const [registrations, setRegistrations] = useState<Registration[]>(MOCK_REGISTRATIONS);
  const [player, setPlayer] = useState<Player>(MOCK_PLAYERS[0]); // Use first player as the "logged in" user

  const navigateTo = (newView: View) => {
    setView(newView);
  };
  
  const viewTournament = (tournamentId: string) => {
    if (view !== 'tournamentDetail') {
      setPreviousView(view);
    }
    setSelectedTournamentId(tournamentId);
    setView('tournamentDetail');
  };

  const updateTournamentStatus = (tournamentId: string, newStatus: TournamentStatus) => {
    setTournaments(prevTournaments =>
      prevTournaments.map(t =>
        t.id === tournamentId ? { ...t, status: newStatus } : t
      )
    );
  };

  const handleCreateTournament = (data: Omit<Tournament, 'id' | 'status'>) => {
    const newTournament: Tournament = {
      id: `t${tournaments.length + 1}`,
      status: 'OPEN',
      ...data,
    };
    setTournaments(prev => [newTournament, ...prev]);
  };
  
  const handleRegistrationSubmit = (registrationData: any, tournament: Tournament) => {
    const newRegistration: Registration = {
        id: `reg${registrations.length + 1}`,
        tournamentId: tournament.id,
        player1Id: player.id,
        player2Id: registrationData.player2 ? `p_temp_${Date.now()}` : undefined,
        category: registrationData.category,
        gender: registrationData.gender,
        registrationDate: new Date().toISOString(),
        timePreferences: registrationData.timePreferences,
    };
    setRegistrations(prev => [newRegistration, ...prev]);
    alert(`¡Inscripción para ${player.name} en ${tournament.name} completada!`);
  };

  const handleProfileSave = (updatedPlayer: Player) => {
    setPlayer(updatedPlayer);
  };


  const renderView = () => {
    switch (view) {
      case 'organizer':
        return (
          <OrganizerDashboard
            onBack={() => navigateTo('landing')}
            tournaments={tournaments}
            onUpdateTournamentStatus={updateTournamentStatus}
            onCreateTournament={handleCreateTournament}
            onViewTournament={viewTournament}
          />
        );
      case 'player':
        return (
          <PlayerDashboard
            onBack={() => navigateTo('landing')}
            tournaments={tournaments}
            player={player}
            registrations={registrations}
            onSaveProfile={handleProfileSave}
            onRegister={handleRegistrationSubmit}
            onViewTournament={viewTournament}
           />
        );
      case 'tournamentDetail':
        const tournament = tournaments.find(t => t.id === selectedTournamentId);
        if (!tournament) {
          setView(previousView); // Go back if tournament not found
          return null;
        }
        return (
          <TournamentDetailPage
            tournament={tournament}
            onBack={() => setView(previousView)}
            player={player}
            registrations={registrations}
            onRegister={handleRegistrationSubmit}
          />
        );
      case 'landing':
      default:
        return <LandingPage onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen font-sans">
      <main>{renderView()}</main>
    </div>
  );
};

export default App;