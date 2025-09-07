import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { OrganizerDashboard } from './components/OrganizerDashboard';
import { PlayerDashboard } from './components/PlayerDashboard';

type View = 'landing' | 'organizer' | 'player';

const App: React.FC = () => {
  const [view, setView] = useState<View>('landing');

  const navigateTo = (newView: View) => {
    setView(newView);
  };

  const renderView = () => {
    switch (view) {
      case 'organizer':
        return <OrganizerDashboard onBack={() => navigateTo('landing')} />;
      case 'player':
        return <PlayerDashboard onBack={() => navigateTo('landing')} />;
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