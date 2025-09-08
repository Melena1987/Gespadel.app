import React, { useState } from 'react';
import type { Player } from '../types';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

interface HeaderProps {
    player: Player | null;
    onLoginRequest: (role: 'player' | 'organizer') => void;
    onLogout: () => void;
    onProfileClick: () => void;
    view: 'player' | 'organizer';
    onViewChange: (view: 'player' | 'organizer') => void;
}

export const Header: React.FC<HeaderProps> = ({ player, onLoginRequest, onLogout, onProfileClick, view, onViewChange }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const canBeOrganizer = player && ['organizer', 'organizer_player'].includes(player.role);

    return (
        <header className="container mx-auto p-4 sm:p-6 lg:p-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-violet-500 logo-gradient">
                GESPADEL
            </h1>
            <div className="flex items-center gap-4">
                {!canBeOrganizer && (
                    <button 
                        onClick={() => onLoginRequest('organizer')}
                        className="hidden sm:block text-sm text-slate-400 hover:text-cyan-400 transition-colors"
                    >
                        Acceso Organizadores
                    </button>
                )}
                {player ? (
                    <div className="flex items-center gap-4">
                        {player.role === 'organizer_player' && (
                            <button
                                onClick={() => onViewChange(view === 'player' ? 'organizer' : 'player')}
                                className="px-4 py-2 text-sm font-semibold text-white bg-slate-700 rounded-lg hover:bg-slate-600 transition-all"
                            >
                                {view === 'player' ? 'Ver como Organizador' : 'Ver como Jugador'}
                            </button>
                        )}
                        <div className="relative">
                            <button 
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="flex items-center gap-2 px-4 py-2 font-semibold text-white bg-slate-700 rounded-lg hover:bg-slate-600 transition-all"
                            >
                                <UserCircleIcon />
                                <span className="hidden sm:inline">{player.name}</span>
                            </button>
                            {isMenuOpen && (
                                <div 
                                    className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-md shadow-lg ring-1 ring-white/10 z-20"
                                    onMouseLeave={() => setIsMenuOpen(false)}
                                >
                                    <div className="py-1">
                                        <button onClick={() => { onProfileClick(); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700">Mi Perfil</button>
                                        <button onClick={onLogout} className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700">Cerrar Sesión</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => onLoginRequest('player')}
                        className="flex items-center justify-center gap-2 px-4 py-2 font-semibold text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-all"
                    >
                        <span>Iniciar Sesión</span>
                    </button>
                )}
            </div>
        </header>
    );
};