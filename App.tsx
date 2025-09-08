import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import { auth, db, storage } from './firebase';
import type { Tournament, Player, Registration, TournamentStatus, Category } from './types';

import { OrganizerDashboard } from './components/OrganizerDashboard';
import { PlayerDashboard } from './components/PlayerDashboard';
import { TournamentDetailPage } from './components/TournamentDetailPage';
import { Header } from './components/Header';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { Modal } from './components/Modal';

type View = 'organizer' | 'player';
type AuthRole = 'player' | 'organizer';

const App: React.FC = () => {
    const [view, setView] = useState<View>('player');
    const [selectedTournamentId, setSelectedTournamentId] = useState<string | null>(null);
    
    const [authUser, setAuthUser] = useState<firebase.User | null>(null);
    const [playerProfile, setPlayerProfile] = useState<Player | null>(null);
    const [loading, setLoading] = useState(true);

    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);

    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authModalRole, setAuthModalRole] = useState<AuthRole>('player');
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            setAuthUser(user);
            if (user) {
                const playerDocRef = db.collection('players').doc(user.uid);
                const playerDocSnap = await playerDocRef.get();
                if (playerDocSnap.exists) {
                    const playerData = { id: playerDocSnap.id, ...playerDocSnap.data() } as Player;
                    setPlayerProfile(playerData);
                    if (playerData.role === 'organizer' || playerData.role === 'organizer_player') {
                        setView('organizer');
                    } else {
                        setView('player');
                    }
                } else {
                    const newPlayer: Player = {
                        id: user.uid,
                        name: user.displayName || 'Nuevo Jugador',
                        email: user.email || '',
                        phone: user.phoneNumber || '',
                        role: 'player',
                    };
                    await playerDocRef.set(newPlayer);
                    setPlayerProfile(newPlayer);
                    setView('player');
                }
            } else {
                setPlayerProfile(null);
                setView('player'); // Reset to player view on logout
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const unsubTournaments = db.collection('tournaments').onSnapshot((snapshot) => {
            const tournamentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tournament));
            setTournaments(tournamentsData);
        });
        const unsubRegistrations = db.collection('registrations').onSnapshot((snapshot) => {
            const registrationsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Registration));
            setRegistrations(registrationsData);
        });
         const unsubPlayers = db.collection('players').onSnapshot((snapshot) => {
            const playersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Player));
            setPlayers(playersData);
        });

        return () => {
            unsubTournaments();
            unsubRegistrations();
            unsubPlayers();
        };
    }, []);

    const handleLoginRequest = (role: AuthRole) => {
        setAuthModalRole(role);
        setIsAuthModalOpen(true);
    };

    const handleAuthSuccess = () => {
        setIsAuthModalOpen(false);
    };
    
    const handleLogout = async () => {
        await auth.signOut();
    };

    const handleSaveProfile = async (updatedPlayer: Player, profilePictureFile?: File | null) => {
        if (!playerProfile) return;

        let playerToSave = { ...updatedPlayer };

        if (profilePictureFile) {
            try {
                const filePath = `players/${playerProfile.id}/profilePicture_${Date.now()}`;
                const fileRef = storage.ref().child(filePath);
                await fileRef.put(profilePictureFile);
                const imageUrl = await fileRef.getDownloadURL();
                playerToSave.profilePicture = imageUrl;
            } catch (error) {
                console.error("Error uploading profile picture: ", error);
                alert("Hubo un error al subir la foto de perfil.");
                return;
            }
        }
        
        await db.collection('players').doc(playerProfile.id).set(playerToSave, { merge: true });
        setPlayerProfile(playerToSave);
        setIsProfileModalOpen(false);
    };

    const handleCreateTournament = async (data: Omit<Tournament, 'id' | 'status' | 'posterImage'> & { posterImageFile?: File | null }) => {
        let imageUrl: string | null = null;
        const tournamentRef = db.collection('tournaments').doc();

        if (data.posterImageFile) {
            try {
                const file = data.posterImageFile;
                const filePath = `tournaments/${tournamentRef.id}/${file.name}`;
                const fileRef = storage.ref().child(filePath);
                await fileRef.put(file);
                imageUrl = await fileRef.getDownloadURL();
            } catch (error) {
                console.error("Error uploading tournament poster: ", error);
                alert("Hubo un error al subir el cartel del torneo.");
                return;
            }
        }

        const { posterImageFile, ...tournamentData } = data;

        await tournamentRef.set({ 
            ...tournamentData, 
            posterImage: imageUrl, 
            status: 'OPEN' 
        });
    };

    const handleUpdateTournamentStatus = async (tournamentId: string, newStatus: TournamentStatus) => {
        await db.collection('tournaments').doc(tournamentId).update({ status: newStatus });
    };

    const findOrCreatePlayer = async (playerData: Partial<Player>): Promise<string> => {
        const playersRef = db.collection('players');
        const querySnapshot = await playersRef.where("email", "==", playerData.email).get();
        if (!querySnapshot.empty) {
            return querySnapshot.docs[0].id;
        } else {
            const newPlayerRef = await playersRef.add({
                name: playerData.name,
                email: playerData.email,
                phone: '',
                role: 'player',
            });
            return newPlayerRef.id;
        }
    };

    const handleRegister = async (registrationData: any, tournament: Tournament) => {
        const player1Id = await findOrCreatePlayer({name: registrationData.player1.name, email: registrationData.player1.email});
        let player2Id: string | undefined = undefined;
        if (registrationData.player2) {
            player2Id = await findOrCreatePlayer({name: registrationData.player2.name, email: registrationData.player2.email});
        }

        const newRegistration: Omit<Registration, 'id'> = {
            tournamentId: tournament.id,
            player1Id: player1Id,
            player2Id: player2Id,
            category: registrationData.category as Category,
            gender: registrationData.gender,
            registrationDate: new Date().toISOString(),
            timePreferences: registrationData.timePreferences,
        };

        await db.collection('registrations').add(newRegistration);
    };

    const handleViewTournament = (tournamentId: string) => {
        setSelectedTournamentId(tournamentId);
    };
    
    const handleBack = () => {
        setSelectedTournamentId(null);
    };

    const handleViewChange = (newView: View) => {
        setView(newView);
    }

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">Cargando...</div>;
    }
    
    const selectedTournament = tournaments.find(t => t.id === selectedTournamentId);

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans">
            <Header 
                player={playerProfile}
                onLoginRequest={handleLoginRequest}
                onLogout={handleLogout}
                onProfileClick={() => setIsProfileModalOpen(true)}
                view={view}
                onViewChange={handleViewChange}
            />

            <main className="container mx-auto">
                {selectedTournament ? (
                    <TournamentDetailPage
                        tournament={selectedTournament}
                        onBack={handleBack}
                        player={playerProfile}
                        registrations={registrations}
                        onRegister={handleRegister}
                        onLoginRequest={() => handleLoginRequest('player')}
                    />
                ) : view === 'organizer' && ['organizer', 'organizer_player'].includes(playerProfile?.role || '') ? (
                     <OrganizerDashboard 
                        onBack={() => setView('player')}
                        tournaments={tournaments}
                        registrations={registrations}
                        players={players}
                        onUpdateTournamentStatus={handleUpdateTournamentStatus}
                        onCreateTournament={handleCreateTournament}
                        onViewTournament={handleViewTournament}
                    />
                ) : (
                    <PlayerDashboard 
                        tournaments={tournaments}
                        player={playerProfile}
                        registrations={registrations}
                        onRegister={handleRegister}
                        onViewTournament={handleViewTournament}
                        onLoginRequest={() => handleLoginRequest('player')}
                    />
                )}
            </main>

            {isAuthModalOpen && (
                <AuthModal
                    isOpen={isAuthModalOpen}
                    onClose={() => setIsAuthModalOpen(false)}
                    role={authModalRole}
                    onAuthSuccess={handleAuthSuccess}
                />
            )}
            {isProfileModalOpen && playerProfile && (
                <Modal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} size="lg">
                    <ProfileModal 
                        player={playerProfile}
                        onClose={() => setIsProfileModalOpen(false)}
                        onSave={handleSaveProfile}
                    />
                </Modal>
            )}
        </div>
    );
}

export default App;