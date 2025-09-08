import React, { useState, useEffect } from 'react';
// Fix: Import firebase to provide type for 'user' state.
import firebase from 'firebase/compat/app';
import { db, auth, storage } from './firebase';
import type { Tournament, Player, Registration, TournamentStatus } from './types';
import { OrganizerDashboard } from './components/OrganizerDashboard';
import { PlayerDashboard } from './components/PlayerDashboard';
import { TournamentDetailPage } from './components/TournamentDetailPage';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { Header } from './components/Header';
import { Modal } from './components/Modal';
import { PlayerProfileDetailModal } from './components/PlayerProfileDetailModal';

type AppView = 'organizer' | 'player' | 'tournamentDetail';

const App: React.FC = () => {
    const [user, setUser] = useState<firebase.User | null>(null);
    const [player, setPlayer] = useState<Player | null>(null);
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [allPlayers, setAllPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);

    // Determines dashboard view for organizer_player role
    const [organizerPlayerView, setOrganizerPlayerView] = useState<'player' | 'organizer'>('player'); 

    const [currentView, setCurrentView] = useState<AppView>('player'); // start with player view to show tournaments
    const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);

    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authRole, setAuthRole] = useState<'player' | 'organizer'>('player');
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [viewingPlayer, setViewingPlayer] = useState<Player | null>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
            setLoading(true);
            if (authUser) {
                setUser(authUser);
                const playerDoc = await db.collection('players').doc(authUser.uid).get();
                if (playerDoc.exists) {
                    const playerData = { id: playerDoc.id, ...playerDoc.data() } as Player;
                    setPlayer(playerData);
                    // if user is organizer or organizer_player default to organizer view
                    if (playerData.role === 'organizer') {
                        setCurrentView('organizer');
                    } else if (playerData.role === 'organizer_player') {
                        setCurrentView(organizerPlayerView);
                    }
                    else {
                        setCurrentView('player');
                    }
                } else {
                    // First login, create a profile
                    const newPlayer: Player = {
                        id: authUser.uid,
                        name: authUser.displayName || 'Nuevo Jugador',
                        email: authUser.email || '',
                        phone: authUser.phoneNumber || '',
                        role: authRole === 'organizer' ? 'organizer' : 'player', // Assign role based on login intent
                    };
                    await db.collection('players').doc(authUser.uid).set(newPlayer);
                    setPlayer(newPlayer);
                    setIsProfileModalOpen(true); // Prompt user to complete profile
                    setCurrentView('player');
                }
            } else {
                setUser(null);
                setPlayer(null);
                setCurrentView('player'); // Show player dashboard with public tournaments for guests
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [authRole, organizerPlayerView]);

    useEffect(() => {
        const unsubTournaments = db.collection('tournaments').orderBy('startDate', 'desc').onSnapshot(snapshot => {
            setTournaments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tournament)));
        });
        const unsubRegistrations = db.collection('registrations').onSnapshot(snapshot => {
            setRegistrations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Registration)));
        });
         const unsubPlayers = db.collection('players').onSnapshot(snapshot => {
            setAllPlayers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Player)));
        });

        return () => {
            unsubTournaments();
            unsubRegistrations();
            unsubPlayers();
        };
    }, []);

    const handleLoginRequest = (role: 'player' | 'organizer') => {
        setAuthRole(role);
        setIsAuthModalOpen(true);
    };

    const handleLogout = () => {
        auth.signOut();
        setSelectedTournament(null);
    };
    
    const handleAuthSuccess = () => {
        setIsAuthModalOpen(false);
    }
    
    const handleProfileSave = async (updatedPlayer: Player, profilePictureFile?: File | null) => {
        if (!user) return;
        
        try {
            let profilePictureUrl = updatedPlayer.profilePicture;
            if (profilePictureFile) {
                const storageRef = storage.ref(`profilePictures/${user.uid}`);
                const snapshot = await storageRef.put(profilePictureFile);
                profilePictureUrl = await snapshot.ref.getDownloadURL();
            }

            const finalPlayer = { ...updatedPlayer, profilePicture: profilePictureUrl };
            await db.collection('players').doc(user.uid).set(finalPlayer, { merge: true });
            setPlayer(finalPlayer);
            setIsProfileModalOpen(false);
            alert('Perfil actualizado correctamente.');
        } catch (error) {
            console.error("Error al guardar el perfil:", error);
            alert("Error al guardar el perfil. Por favor, inténtalo de nuevo.");
        }
    };
    
    const handleCreateTournament = async (data: Omit<Tournament, 'id' | 'status' | 'posterImage'> & { posterImageFile?: File | null }) => {
        if (!user || player?.role === 'player') return;
        
        try {
            let posterImageUrl: string | null = null;
            const newTournamentRef = db.collection('tournaments').doc();
            if (data.posterImageFile) {
                const storageRef = storage.ref(`posters/${newTournamentRef.id}`);
                const snapshot = await storageRef.put(data.posterImageFile);
                posterImageUrl = await snapshot.ref.getDownloadURL();
            }

            const { posterImageFile, ...tournamentData } = data;
            
            const newTournament: Omit<Tournament, 'id'> = {
                ...tournamentData,
                status: 'OPEN',
                posterImage: posterImageUrl,
            };

            await newTournamentRef.set(newTournament);
            alert('Torneo creado con éxito.');
        } catch (error) {
            console.error("Error al crear el torneo:", error);
            alert("Error al crear el torneo. Por favor, inténtalo de nuevo.");
        }
    };
    
    const handleUpdateTournamentStatus = async (tournamentId: string, newStatus: TournamentStatus) => {
        await db.collection('tournaments').doc(tournamentId).update({ status: newStatus });
    }
    
    const handleRegister = async (registrationData: any, tournament: Tournament) => {
        if (!player) {
            alert("Debes iniciar sesión para inscribirte.");
            return;
        }
        
        try {
            let player2Id: string | undefined = undefined;

            // Handle player 2 creation/lookup
            if (registrationData.player2 && registrationData.player2.email) {
                 // Prevent registering yourself as player 2
                if (registrationData.player2.email === player.email) {
                    alert("No puedes inscribirte a ti mismo como tu compañero/a.");
                    return;
                }
                
                // Check if player 2 already exists
                const player2Query = await db.collection('players').where('email', '==', registrationData.player2.email).limit(1).get();
                if (!player2Query.empty) {
                    player2Id = player2Query.docs[0].id;
                } else {
                    // Create new player for player 2
                    const newPlayer2Ref = await db.collection('players').add({
                        name: registrationData.player2.name,
                        email: registrationData.player2.email,
                        phone: registrationData.player2.phone,
                        role: 'player', // Partners are always created with 'player' role
                    });
                    player2Id = newPlayer2Ref.id;
                }
            }

            const { player2, ...restOfData } = registrationData;

            const newRegistrationData = {
                ...restOfData,
                tournamentId: tournament.id,
                player1Id: player.id,
                registrationDate: new Date().toISOString(),
            };

            // Add player2Id only if it exists
            if (player2Id) {
                (newRegistrationData as any).player2Id = player2Id;
            }

            await db.collection('registrations').add(newRegistrationData);
            alert('¡Inscripción realizada con éxito!');
        } catch (error) {
            console.error("Error al realizar la inscripción:", error);
            alert("Ha ocurrido un error al guardar la inscripción. Por favor, inténtalo de nuevo.");
        }
    };

    const handleViewTournament = (tournamentId: string) => {
        const tournament = tournaments.find(t => t.id === tournamentId);
        if(tournament) {
            setSelectedTournament(tournament);
            setCurrentView('tournamentDetail');
        }
    };
    
    const handleViewPlayerProfile = (playerId: string) => {
        const playerToShow = allPlayers.find(p => p.id === playerId);
        if (playerToShow) {
            setViewingPlayer(playerToShow);
        }
    };

    const navigateBack = () => {
        setSelectedTournament(null);
        // Determine where to go back to
        if(player?.role === 'organizer' || (player?.role === 'organizer_player' && organizerPlayerView === 'organizer')) {
            setCurrentView('organizer');
        } else {
            setCurrentView('player');
        }
    }

    const handleViewChange = (view: 'player' | 'organizer') => {
        setOrganizerPlayerView(view);
        setCurrentView(view);
        setSelectedTournament(null);
    }

    const renderContent = () => {
        if (loading) {
            return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">Cargando...</div>;
        }
        
        if (currentView === 'tournamentDetail' && selectedTournament) {
            return (
                <TournamentDetailPage
                    tournament={selectedTournament}
                    onBack={navigateBack}
                    player={player}
                    registrations={registrations}
                    onRegister={handleRegister}
                    onLoginRequest={() => handleLoginRequest('player')}
                />
            );
        }

        if (currentView === 'organizer' && player && ['organizer', 'organizer_player'].includes(player.role)) {
            return (
                <OrganizerDashboard
                    onBack={() => {}} // Not used in this layout
                    tournaments={tournaments}
                    registrations={registrations}
                    players={allPlayers}
                    onUpdateTournamentStatus={handleUpdateTournamentStatus}
                    onCreateTournament={handleCreateTournament}
                    onViewTournament={handleViewTournament}
                    onViewPlayer={handleViewPlayerProfile}
                />
            );
        }

        // Default view is player dashboard (for guests, players, and organizer_players in player view)
        return (
             <PlayerDashboard
                tournaments={tournaments}
                player={player}
                registrations={registrations}
                onRegister={handleRegister}
                onViewTournament={handleViewTournament}
                onLoginRequest={() => handleLoginRequest('player')}
            />
        );
    }

    return (
        <div className="bg-slate-900 text-slate-200 min-h-screen font-sans">
            <Header
                player={player}
                onLoginRequest={handleLoginRequest}
                onLogout={handleLogout}
                onProfileClick={() => setIsProfileModalOpen(true)}
                view={currentView === 'organizer' ? 'organizer' : 'player'}
                onViewChange={handleViewChange}
            />

            <main className="flex-grow">
                {renderContent()}
            </main>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                role={authRole}
                onAuthSuccess={handleAuthSuccess}
            />

            {player && (
                 <Modal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)}>
                    <ProfileModal
                        player={player}
                        onClose={() => setIsProfileModalOpen(false)}
                        onSave={handleProfileSave}
                    />
                </Modal>
            )}
            
            {viewingPlayer && (
                <Modal isOpen={!!viewingPlayer} onClose={() => setViewingPlayer(null)} size="md">
                    <PlayerProfileDetailModal player={viewingPlayer} onClose={() => setViewingPlayer(null)} />
                </Modal>
            )}
        </div>
    );
};

export default App;
