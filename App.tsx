import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { OrganizerDashboard } from './components/OrganizerDashboard';
import { PlayerDashboard } from './components/PlayerDashboard';
import { MOCK_TOURNAMENTS } from './constants';
import type { Tournament, TournamentStatus } from './types';

type View = 'landing' | 'organizer' | 'player';

const App: React.FC = () => {
  const [view, setView] = useState<View>('landing');
  const [tournaments, setTournaments] = useState<Tournament[]>(MOCK_TOURNAMENTS);

  const navigateTo = (newView: View) => {
    setView(newView);
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

  const renderView = () => {
    switch (view) {
      case 'organizer':
        return (
          <OrganizerDashboard
            onBack={() => navigateTo('landing')}
            tournaments={tournaments}
            onUpdateTournamentStatus={updateTournamentStatus}
            onCreateTournament={handleCreateTournament}
          />
        );
      case 'player':
        return <PlayerDashboard onBack={() => navigateTo('landing')} tournaments={tournaments} />;
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