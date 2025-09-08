
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
import { TournamentForm } from './components/TournamentForm';
import { useNotification } from './components/notifications/NotificationContext';
import { NotificationContainer } from './components/notifications/NotificationContainer';
import { ConfirmationModal } from './components/ConfirmationModal';
import { CookieConsent } from './components/CookieConsent';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';

type AppView = 'organizer' | 'player' | 'tournamentDetail';

const App: React.FC = () => {
    const { addNotification } = useNotification();
    const [user, setUser] = useState<firebase.User | null>(null);
    const [player, setPlayer] = useState<Player | null>(null);
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [allPlayers, setAllPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);

    // Determines dashboard view for organizer_player role
    const [organizerPlayerView, setOrganizerPlayerView] = useState<'player' | 'organizer'>('player'); 

    const [currentView, setCurrentView] = useState<AppView>('player');
    const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);

    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authRole, setAuthRole] = useState<'player' | 'organizer'>('player');
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [viewingPlayer, setViewingPlayer] = useState<Player | null>(null);
    
    const [isTournamentFormOpen, setIsTournamentFormOpen] = useState(false);
    const [editingTournament, setEditingTournament] = useState<Tournament | null>(null);

    const [registrationToCancel, setRegistrationToCancel] = useState<string | null>(null);
    const [tournamentToClose, setTournamentToClose] = useState<string | null>(null);
    const [showCookieConsent, setShowCookieConsent] = useState(false);
    const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);


    useEffect(() => {
        const consent = localStorage.getItem('cookieConsent');
        if (consent !== 'true') {
            const timer = setTimeout(() => {
                setShowCookieConsent(true);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, []);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
            setLoading(true);
            if (authUser) {
                setUser(authUser);
                const playerDoc = await db.collection('players').doc(authUser.uid).get();
                if (playerDoc.exists) {
                    const playerData = { id: playerDoc.id, ...playerDoc.data() } as Player;
                    setPlayer(playerData);
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
                }
            } else {
                setUser(null);
                setPlayer(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [authRole]);

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

    // Effect for hash-based routing
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash;
            const tournamentMatch = hash.match(/^#\/tournament\/([\w-]+)$/);

            if (tournamentMatch && tournamentMatch[1]) {
                const tournamentId = tournamentMatch[1];
                // Wait until tournaments are loaded before trying to find one
                if (tournaments.length > 0) {
                    const tournament = tournaments.find(t => t.id === tournamentId);
                    if (tournament) {
                        setSelectedTournament(tournament);
                        setCurrentView('tournamentDetail');
                    } else {
                        // Tournament not found, navigate back to dashboard
                        console.warn(`Tournament with ID ${tournamentId} not found.`);
                        window.location.hash = '';
                    }
                }
            } else {
                setSelectedTournament(null);
                // Determine which dashboard to show based on role and view preference
                if (player?.role === 'organizer' || (player?.role === 'organizer_player' && organizerPlayerView === 'organizer')) {
                    setCurrentView('organizer');
                } else {
                    setCurrentView('player');
                }
            }
        };

        handleHashChange();
        window.addEventListener('hashchange', handleHashChange);
        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, [tournaments, player, organizerPlayerView]);

    const handleLoginRequest = (role: 'player' | 'organizer') => {
        setAuthRole(role);
        setIsAuthModalOpen(true);
    };

    const handleLogout = () => {
        window.location.hash = ''; // Go back to main page
        auth.signOut();
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
            addNotification('Perfil actualizado correctamente.', 'success');
        } catch (error) {
            console.error("Error al guardar el perfil:", error);
            addNotification("Error al guardar el perfil. Por favor, inténtalo de nuevo.", 'error');
        }
    };
    
    const handleCreateTournament = async (data: Omit<Tournament, 'id' | 'status' | 'posterImage' | 'rulesPdfUrl'> & { posterImageFile?: File | null; rulesPdfFile?: File | null }) => {
        if (!user || player?.role === 'player') return;
        
        try {
            let posterImageUrl: string | null = null;
            let rulesPdfUrl: string | null = null;
            const newTournamentRef = db.collection('tournaments').doc();
            
            if (data.posterImageFile) {
                const storageRef = storage.ref(`posters/${newTournamentRef.id}`);
                const snapshot = await storageRef.put(data.posterImageFile);
                posterImageUrl = await snapshot.ref.getDownloadURL();
            }

            if (data.rulesPdfFile) {
                const pdfStorageRef = storage.ref(`rulesPdfs/${newTournamentRef.id}`);
                const pdfSnapshot = await pdfStorageRef.put(data.rulesPdfFile);
                rulesPdfUrl = await pdfSnapshot.ref.getDownloadURL();
            }

            const { posterImageFile, rulesPdfFile, ...tournamentData } = data;
            
            const newTournament: Omit<Tournament, 'id'> = {
                ...tournamentData,
                status: 'OPEN',
                posterImage: posterImageUrl,
                rulesPdfUrl: rulesPdfUrl,
            };

            await newTournamentRef.set(newTournament);
            addNotification('Torneo creado con éxito.', 'success');
        } catch (error) {
            console.error("Error al crear el torneo:", error);
            addNotification("Error al crear el torneo. Por favor, inténtalo de nuevo.", 'error');
        }
    };
    
    const handleUpdateTournament = async (tournamentId: string, data: Omit<Tournament, 'id' | 'status' | 'posterImage' | 'rulesPdfUrl'> & { posterImageFile?: File | null; rulesPdfFile?: File | null; removeRulesPdf?: boolean; }) => {
        if (!user || player?.role === 'player') return;

        try {
            let posterImageUrl: string | null = editingTournament?.posterImage || null;
            let rulesPdfUrl: string | null = editingTournament?.rulesPdfUrl || null;
            const { posterImageFile, rulesPdfFile, removeRulesPdf, ...tournamentData } = data;

            if (posterImageFile) {
                const storageRef = storage.ref(`posters/${tournamentId}`);
                const snapshot = await storageRef.put(posterImageFile);
                posterImageUrl = await snapshot.ref.getDownloadURL();
            }
            
            const pdfStorageRef = storage.ref(`rulesPdfs/${tournamentId}`);
            if (rulesPdfFile) {
                const pdfSnapshot = await pdfStorageRef.put(rulesPdfFile);
                rulesPdfUrl = await pdfSnapshot.ref.getDownloadURL();
            } else if (removeRulesPdf && rulesPdfUrl) {
                try {
                    await pdfStorageRef.delete();
                } catch (error: any) {
                    if (error.code !== 'storage/object-not-found') throw error;
                }
                rulesPdfUrl = null;
            }

            const updatedTournament = {
                ...tournamentData,
                posterImage: posterImageUrl,
                rulesPdfUrl: rulesPdfUrl,
            };

            await db.collection('tournaments').doc(tournamentId).update(updatedTournament);
            addNotification('Torneo actualizado con éxito.', 'success');
        } catch (error) {
            console.error("Error al actualizar el torneo:", error);
            addNotification("Error al actualizar el torneo. Por favor, inténtalo de nuevo.", 'error');
        }
    };
    
    const handleOpenCreateForm = () => {
        setEditingTournament(null);
        setIsTournamentFormOpen(true);
    };

    const handleOpenEditForm = (tournament: Tournament) => {
        setEditingTournament(tournament);
        setIsTournamentFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsTournamentFormOpen(false);
        setEditingTournament(null);
    };
    
    const handleTournamentFormSubmit = async (data: Omit<Tournament, 'id' | 'status' | 'posterImage' | 'rulesPdfUrl'> & { posterImageFile?: File | null; rulesPdfFile?: File | null; removeRulesPdf?: boolean; }) => {
        if (editingTournament) {
            await handleUpdateTournament(editingTournament.id, data);
        } else {
            await handleCreateTournament(data);
        }
        handleCloseForm();
    };

    const handleUpdateTournamentStatus = async (tournamentId: string, newStatus: TournamentStatus) => {
        try {
            await db.collection('tournaments').doc(tournamentId).update({ status: newStatus });
            addNotification('Inscripciones cerradas correctamente.', 'success');
        } catch (error) {
             console.error("Error updating tournament status:", error);
            addNotification("Error al cerrar inscripciones. Por favor, inténtalo de nuevo.", 'error');
        }
    }
    
    const handleRegister = async (registrationData: any, tournament: Tournament) => {
        if (!player) {
            addNotification("Debes iniciar sesión para inscribirte.", 'info');
            return;
        }
    
        try {
            const { player2, ...restOfData } = registrationData;
    
            const newRegistrationData: Omit<Registration, 'id'> = {
                ...restOfData,
                tournamentId: tournament.id,
                player1Id: player.id,
                registrationDate: new Date().toISOString(),
                status: 'ACTIVE',
            };
    
            // Handle player 2
            if (player2 && player2.name) {
                // If email is provided, create/find player and add player2Id
                if (player2.email) {
                    if (player2.email === player.email) {
                        addNotification("No puedes inscribirte a ti mismo como tu compañero/a.", 'error');
                        return;
                    }
    
                    let player2Id: string | undefined = undefined;
                    const player2Query = await db.collection('players').where('email', '==', player2.email).limit(1).get();
                    if (!player2Query.empty) {
                        player2Id = player2Query.docs[0].id;
                    } else {
                        // Create new player for player 2
                        const newPlayer2Ref = await db.collection('players').add({
                            name: player2.name,
                            email: player2.email,
                            phone: player2.phone || '',
                            role: 'player',
                        });
                        player2Id = newPlayer2Ref.id;
                    }
                    newRegistrationData.player2Id = player2Id;
                } else {
                    // If no email, just store the name and phone in the registration document
                    newRegistrationData.player2Name = player2.name;
                    if (player2.phone) {
                        newRegistrationData.player2Phone = player2.phone;
                    }
                }
            }
    
            await db.collection('registrations').add(newRegistrationData);
            addNotification('¡Inscripción realizada con éxito!', 'success');
        } catch (error) {
            console.error("Error al realizar la inscripción:", error);
            addNotification("Ha ocurrido un error al guardar la inscripción. Por favor, inténtalo de nuevo.", 'error');
        }
    };
    
    const handleCancelRegistrationRequest = (registrationId: string) => {
        setRegistrationToCancel(registrationId);
    };

    const confirmCancelRegistration = async () => {
        if (!registrationToCancel) return;

        try {
            await db.collection('registrations').doc(registrationToCancel).update({ status: 'CANCELLED' });
            addNotification('Inscripción anulada correctamente.', 'success');
        } catch (error) {
            console.error("Error al anular la inscripción:", error);
            addNotification("Error al anular la inscripción. Por favor, inténtalo de nuevo.", 'error');
        } finally {
            setRegistrationToCancel(null);
        }
    };

    const requestCloseRegistrations = (tournamentId: string) => {
        setTournamentToClose(tournamentId);
    };

    const confirmCloseRegistrations = async () => {
        if (!tournamentToClose) return;
        await handleUpdateTournamentStatus(tournamentToClose, 'CLOSED');
        setTournamentToClose(null);
    };

    const handleViewTournament = (tournamentId: string) => {
        window.location.hash = `#/tournament/${tournamentId}`;
    };
    
    const handleViewPlayerProfile = (playerId: string) => {
        const playerToShow = allPlayers.find(p => p.id === playerId);
        if (playerToShow) {
            setViewingPlayer(playerToShow);
        }
    };

    const navigateBack = () => {
        window.location.hash = '';
    }

    const handleViewChange = (view: 'player' | 'organizer') => {
        if (window.location.hash) {
            window.location.hash = '';
        }
        setOrganizerPlayerView(view);
    }

    const handleAcceptCookies = () => {
        localStorage.setItem('cookieConsent', 'true');
        setShowCookieConsent(false);
    };

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
                    onCancelRegistration={handleCancelRegistrationRequest}
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
                    onCloseRegistrationsRequest={requestCloseRegistrations}
                    onCreateTournamentRequest={handleOpenCreateForm}
                    onEditTournament={handleOpenEditForm}
                    onViewTournament={handleViewTournament}
                    onViewPlayer={handleViewPlayerProfile}
                    onCancelRegistration={handleCancelRegistrationRequest}
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
                onCancelRegistration={handleCancelRegistrationRequest}
            />
        );
    }

    return (
        <div className="bg-slate-900 text-slate-200 min-h-screen font-sans">
            <NotificationContainer />
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
            
            <Modal isOpen={isTournamentFormOpen} onClose={handleCloseForm} size="3xl">
                <TournamentForm 
                    onSubmit={handleTournamentFormSubmit}
                    onCancel={handleCloseForm}
                    initialData={editingTournament}
                />
            </Modal>

            <ConfirmationModal
                isOpen={!!registrationToCancel}
                onClose={() => setRegistrationToCancel(null)}
                onConfirm={confirmCancelRegistration}
                title="Confirmar Anulación"
                message="¿Estás seguro de que quieres anular esta inscripción? Esta acción no se puede deshacer."
                confirmText="Anular Inscripción"
                confirmButtonClass="bg-red-600 hover:bg-red-700"
            />
            
            <ConfirmationModal
                isOpen={!!tournamentToClose}
                onClose={() => setTournamentToClose(null)}
                onConfirm={confirmCloseRegistrations}
                title="Confirmar Cierre de Inscripciones"
                message="¿Estás seguro de que quieres cerrar las inscripciones para este torneo? Esta acción no se puede deshacer."
                confirmText="Cerrar Inscripciones"
                confirmButtonClass="bg-orange-600 hover:bg-orange-700"
            />

            <Modal isOpen={isPrivacyModalOpen} onClose={() => setIsPrivacyModalOpen(false)} size="3xl">
                <PrivacyPolicyModal onClose={() => setIsPrivacyModalOpen(false)} />
            </Modal>
            
            {showCookieConsent && (
                <CookieConsent 
                    onAccept={handleAcceptCookies}
                    onOpenPrivacyPolicy={() => setIsPrivacyModalOpen(true)}
                />
            )}
        </div>
    );
};

export default App;
