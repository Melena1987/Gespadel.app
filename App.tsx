
import React, { useState, useEffect } from 'react';
import { OrganizerDashboard } from './components/OrganizerDashboard';
import { PlayerDashboard } from './components/PlayerDashboard';
import { TournamentDetailPage } from './components/TournamentDetailPage';
import { AuthModal } from './components/AuthModal';
import { Header } from './components/Header';
// Fix: Import Modal and ProfileModal to resolve 'Cannot find name' errors.
import { Modal } from './components/Modal';
import { ProfileModal } from './components/ProfileModal';
import type { Tournament, TournamentStatus, Player, Registration } from './types';

import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { collection, getDocs, doc, setDoc, addDoc, updateDoc, query, orderBy, writeBatch, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

type View = 'player' | 'organizer' | 'tournamentDetail';
type AuthRequest = {
    role: 'player' | 'organizer';
    onSuccess?: () => void;
};

const App: React.FC = () => {
  const [view, setView] = useState<View>('player');
  const [previousView, setPreviousView] = useState<View>('player');
  const [selectedTournamentId, setSelectedTournamentId] = useState<string | null>(null);

  const [authUser, setAuthUser] = useState<User | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const [authRequest, setAuthRequest] = useState<AuthRequest | null>(null);
  
  // Fetch public data and handle auth state
  useEffect(() => {
    const fetchPublicData = async () => {
        setLoading(true);
        const tournamentsCollection = collection(db, 'tournaments');
        const tourneyQuery = query(tournamentsCollection, orderBy('startDate', 'desc'));
        const tournamentSnapshot = await getDocs(tourneyQuery);
        const tournamentList = tournamentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tournament));
        setTournaments(tournamentList);
        
        const registrationsCollection = collection(db, 'registrations');
        const registrationSnapshot = await getDocs(registrationsCollection);
        const registrationList = registrationSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Registration));
        setRegistrations(registrationList);
    };

    fetchPublicData();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setAuthUser(user);
        if (user) {
            const playersCollection = collection(db, 'players');
            const playersSnapshot = await getDocs(playersCollection);
            const playersList = playersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Player));
            setAllPlayers(playersList);

            let currentPlayer = playersList.find(p => p.id === user.uid);
            if (!currentPlayer) {
                const newPlayerData: Omit<Player, 'id'> = {
                    name: user.displayName || 'Nuevo Jugador',
                    email: user.email || '',
                    phone: user.phoneNumber || '',
                    category: '4ª',
                    gender: 'masculine',
                    role: 'player'
                };
                await setDoc(doc(db, 'players', user.uid), newPlayerData);
                currentPlayer = { id: user.uid, ...newPlayerData };
                setAllPlayers(prev => [...prev, currentPlayer!]);
            }
            setPlayer(currentPlayer);
            
            if (authRequest?.onSuccess) {
                authRequest.onSuccess();
            }
            setAuthRequest(null);
            
            if (currentPlayer.role === 'organizer') {
              setView('organizer');
            } else {
              setView('player');
            }
        } else {
            setPlayer(null);
            setView('player');
        }
        setLoading(false);
    });
    return () => unsubscribe();
  }, [authRequest?.onSuccess]);
  
  const handleLoginRequest = (role: 'player' | 'organizer', onSuccess?: () => void) => {
    setAuthRequest({ role, onSuccess });
  };

  const handleLogout = async () => {
    await signOut(auth);
    setPlayer(null);
    setView('player');
    setSelectedTournamentId(null);
  };
  
  const viewTournament = (tournamentId: string) => {
    const currentView = player?.role === 'organizer' ? 'organizer' : 'player';
    if (view !== 'tournamentDetail') {
      setPreviousView(currentView);
    }
    setSelectedTournamentId(tournamentId);
    setView('tournamentDetail');
  };

  const handleBackFromDetail = () => {
      setView(previousView);
      setSelectedTournamentId(null);
  };

  const updateTournamentStatus = async (tournamentId: string, newStatus: TournamentStatus) => {
    const tournamentRef = doc(db, 'tournaments', tournamentId);
    await updateDoc(tournamentRef, { status: newStatus });
    setTournaments(prev => prev.map(t => t.id === tournamentId ? { ...t, status: newStatus } : t));
  };

  const handleCreateTournament = async (data: Omit<Tournament, 'id' | 'status'>) => {
    const newTournamentData = { status: 'OPEN' as TournamentStatus, ...data, createdAt: serverTimestamp() };
    const docRef = await addDoc(collection(db, 'tournaments'), newTournamentData);
    const newTournament: Tournament = { id: docRef.id, status: 'OPEN', ...data };
    setTournaments(prev => [newTournament, ...prev]);
  };
  
  const handleRegistrationSubmit = async (registrationData: any, tournament: Tournament) => {
    if (!player) return;
    const batch = writeBatch(db);
    let player2Id: string | undefined = undefined;
    if (registrationData.player2?.name) {
      const newPlayerRef = doc(collection(db, 'players'));
      const newPlayerData: Omit<Player, 'id'> = { name: registrationData.player2.name, email: registrationData.player2.email, phone: '', role: 'player' };
      batch.set(newPlayerRef, newPlayerData);
      player2Id = newPlayerRef.id;
      setAllPlayers(prev => [...prev, {id: player2Id!, ...newPlayerData}]);
    }
    const newRegistrationData: Omit<Registration, 'id'> = { tournamentId: tournament.id, player1Id: player.id, player2Id: player2Id, category: registrationData.category, gender: registrationData.gender, registrationDate: new Date().toISOString(), timePreferences: registrationData.timePreferences };
    const regRef = doc(collection(db, 'registrations'));
    batch.set(regRef, newRegistrationData);
    await batch.commit();
    setRegistrations(prev => [...prev, {id: regRef.id, ...newRegistrationData}]);
    alert(`¡Inscripción para ${player.name} en ${tournament.name} completada!`);
  };

  const handleProfileSave = async (updatedPlayer: Player) => {
    const playerRef = doc(db, 'players', updatedPlayer.id);
    await setDoc(playerRef, updatedPlayer, { merge: true });
    setPlayer(updatedPlayer);
    setAllPlayers(prev => prev.map(p => p.id === updatedPlayer.id ? updatedPlayer : p));
    setIsProfileModalOpen(false);
  };
  
  const renderContent = () => {
    if (view === 'organizer' && player?.role === 'organizer') {
      return (
        <OrganizerDashboard
          onBack={handleLogout}
          tournaments={tournaments}
          registrations={registrations}
          players={allPlayers}
          onUpdateTournamentStatus={updateTournamentStatus}
          onCreateTournament={handleCreateTournament}
          onViewTournament={viewTournament}
        />
      );
    }
    
    if (view === 'tournamentDetail') {
        const tournament = tournaments.find(t => t.id === selectedTournamentId);
        if (!tournament) {
          setView(previousView);
          return null;
        }
        return (
          <TournamentDetailPage
            tournament={tournament}
            onBack={handleBackFromDetail}
            player={player}
            registrations={registrations}
            onRegister={handleRegistrationSubmit}
            onLoginRequest={() => handleLoginRequest('player')}
          />
        );
    }
    
    // Default to player view (public or logged in)
    return (
      <PlayerDashboard
        tournaments={tournaments}
        player={player}
        registrations={registrations}
        onRegister={handleRegistrationSubmit}
        onViewTournament={viewTournament}
        onLoginRequest={() => handleLoginRequest('player')}
      />
    );
  };

  if (loading && !tournaments.length) {
      return (
        <div className="min-h-screen flex items-center justify-center text-white text-xl animate-pulse">
            Cargando Gespadel...
        </div>
      );
  }

  return (
    <div className="bg-slate-900 text-white min-h-screen font-sans">
      {view !== 'organizer' && (
        <Header 
            player={player} 
            onLoginRequest={handleLoginRequest} 
            onLogout={handleLogout} 
            onProfileClick={() => setIsProfileModalOpen(true)}
        />
      )}
      <main>{renderContent()}</main>
      
      {authRequest && (
        <AuthModal 
            isOpen={!!authRequest}
            onClose={() => setAuthRequest(null)}
            role={authRequest.role}
        />
      )}

      {player && (
        <Modal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} size="md">
            <ProfileModal 
              player={player}
              onClose={() => setIsProfileModalOpen(false)}
              onSave={handleProfileSave}
            />
        </Modal>
      )}
    </div>
  );
};

export default App;
