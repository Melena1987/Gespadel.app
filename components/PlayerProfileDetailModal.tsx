import React from 'react';
import type { Player } from '../types';
import { ProfilePicturePlaceholder } from './icons/ProfilePicturePlaceholder';
import { MailIcon } from './icons/MailIcon';
import { PhoneIcon } from './icons/PhoneIcon';

interface PlayerProfileDetailModalProps {
  player: Player;
  onClose: () => void;
}

export const PlayerProfileDetailModal: React.FC<PlayerProfileDetailModalProps> = ({ player, onClose }) => {
  return (
    <div className="text-white p-2">
        <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
                {player.profilePicture ? (
                    <img src={player.profilePicture} alt={`Foto de ${player.name}`} className="h-24 w-24 rounded-full object-cover ring-2 ring-slate-600"/>
                ) : (
                    <div className="h-24 w-24 rounded-full bg-slate-700 flex items-center justify-center ring-1 ring-slate-600">
                        <ProfilePicturePlaceholder />
                    </div>
                )}
            </div>
            <h2 className="text-2xl font-bold">{player.name}</h2>
            {player.category && player.gender && (
                 <p className="text-slate-400">{player.category} Categoría {player.gender === 'masculine' ? 'Masculina' : 'Femenina'}</p>
            )}
        </div>
        
        <div className="mt-6 border-t border-slate-700 pt-6 space-y-4">
             <div className="flex items-center gap-4 text-slate-300">
                <MailIcon />
                <a href={`mailto:${player.email}`} className="hover:text-cyan-400 transition-colors">{player.email}</a>
            </div>
            <div className="flex items-center gap-4 text-slate-300">
                <PhoneIcon />
                 <a href={`tel:${player.phone}`} className="hover:text-cyan-400 transition-colors">{player.phone}</a>
            </div>
        </div>

        <div className="mt-8 flex justify-end">
             <button onClick={onClose} className="px-6 py-2 font-semibold text-slate-300 bg-slate-700 rounded-lg hover:bg-slate-600 transition-all">
                Cerrar
            </button>
        </div>
    </div>
  );
};
