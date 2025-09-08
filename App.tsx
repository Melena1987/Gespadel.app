import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { OrganizerDashboard } from './components/OrganizerDashboard';
import { PlayerDashboard } from './components/PlayerDashboard';
import { TournamentDetailPage } from './components/TournamentDetailPage';
import type { Tournament, TournamentStatus, Player, Registration } from './types';

import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { collection, getDocs, doc, setDoc, addDoc, updateDoc, query, orderBy, getDoc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';


type View = 'landing' | 'organizer' | 'player' | 'tournamentDetail';

const App: React.FC = () => {
  const [view, setView] = useState<View>('landing');
  const [previousView, setPreviousView] = useState<View>('landing');
  const [selectedTournamentId, setSelectedTournamentId] = useState<string | null>(null);

  const [authUser, setAuthUser] = useState<User | null>(auth.currentUser);
  const [player, setPlayer] = useState<Player | null>(null);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setLoading(true);
        if (user) {
            setAuthUser(user);

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
                    gender: 'masculine'
                };
                await setDoc(doc(db, 'players', user.uid), newPlayerData);
                currentPlayer = { id: user.uid, ...newPlayerData };
                setAllPlayers(prev => [...prev, currentPlayer!]);
            }
            setPlayer(currentPlayer);

            const tournamentsCollection = collection(db, 'tournaments');
            const tourneyQuery = query(tournamentsCollection, orderBy('startDate', 'desc'));
            const tournamentSnapshot = await getDocs(tourneyQuery);
            const tournamentList = tournamentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tournament));
            setTournaments(tournamentList);
            
            const registrationsCollection = collection(db, 'registrations');
            const registrationSnapshot = await getDocs(registrationsCollection);
            const registrationList = registrationSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Registration));
            setRegistrations(registrationList);

        } else {
            setAuthUser(null);
            setPlayer(null);
            setTournaments([]);
            setRegistrations([]);
            setAllPlayers([]);
            setView('landing');
        }
        setLoading(false);
    });
    return () => unsubscribe();
  }, []);


  const handleLoginAndNavigate = async (targetView: 'organizer' | 'player') => {
      const googleProvider = new GoogleAuthProvider();
      try {
          await signInWithPopup(auth, googleProvider);
          setView(targetView);
      } catch (error) {
          console.error("Authentication failed", error);
          alert("Error al iniciar sesión. Por favor, inténtalo de nuevo.");
      }
  };

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

  const updateTournamentStatus = async (tournamentId: string, newStatus: TournamentStatus) => {
    const tournamentRef = doc(db, 'tournaments', tournamentId);
    await updateDoc(tournamentRef, { status: newStatus });
    setTournaments(prevTournaments =>
      prevTournaments.map(t =>
        t.id === tournamentId ? { ...t, status: newStatus } : t
      )
    );
  };

  const handleCreateTournament = async (data: Omit<Tournament, 'id' | 'status'>) => {
    const newTournamentData = {
      status: 'OPEN' as TournamentStatus,
      ...data,
      createdAt: serverTimestamp(),
    };
    const docRef = await addDoc(collection(db, 'tournaments'), newTournamentData);
    const newTournament: Tournament = {
      id: docRef.id,
      status: 'OPEN',
      ...data,
    };
    setTournaments(prev => [newTournament, ...prev]);
  };
  
  const handleRegistrationSubmit = async (registrationData: any, tournament: Tournament) => {
    if (!player) return;

    const batch = writeBatch(db);
    let player2Id: string | undefined = undefined;

    if (registrationData.player2?.name) {
      const newPlayerRef = doc(collection(db, 'players'));
      const newPlayerData = {
        name: registrationData.player2.name,
        email: registrationData.player2.email,
        phone: '',
      };
      batch.set(newPlayerRef, newPlayerData);
      player2Id = newPlayerRef.id;
      setAllPlayers(prev => [...prev, {id: player2Id!, ...newPlayerData}]);
    }

    const newRegistrationData: Omit<Registration, 'id'> = {
        tournamentId: tournament.id,
        player1Id: player.id,
        player2Id: player2Id,
        category: registrationData.category,
        gender: registrationData.gender,
        registrationDate: new Date().toISOString(),
        timePreferences: registrationData.timePreferences,
    };

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
  };


  const renderView = () => {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center text-white text-xl animate-pulse">
            Cargando Gespadel...
        </div>
      );
    }
    
    if (!authUser || !player) {
      return <LandingPage onNavigate={handleLoginAndNavigate} />;
    }


    switch (view) {
      case 'organizer':
        return (
          <OrganizerDashboard
            onBack={() => navigateTo('landing')}
            tournaments={tournaments}
            registrations={registrations}
            players={allPlayers}
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
          setView(previousView);
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
        // After login, default to player dashboard if landing is chosen
        return (
            <PlayerDashboard
                onBack={() => signOut(auth)}
                tournaments={tournaments}
                player={player}
                registrations={registrations}
                onSaveProfile={handleProfileSave}
                onRegister={handleRegistrationSubmit}
                onViewTournament={viewTournament}
            />
        );
    }
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen font-sans">
      <main>{renderView()}</main>
    </div>
  );
};

export default App;
