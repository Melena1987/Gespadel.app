import React from 'react';
import { Player } from '../types';

interface ProfileModalProps {
  player: Player;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ player, onClose }) => {
  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-4">Perfil de Jugador</h2>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-400">Nombre</label>
          <p className="text-lg">{player.name}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400">Email</label>
          <p className="text-lg">{player.email}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400">Teléfono</label>
          <p className="text-lg">{player.phone || 'No especificado'}</p>
        </div>
      </div>
      <div className="flex justify-end mt-6">
        <button onClick={onClose} className="px-6 py-2 font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-700">
          Cerrar
        </button>
      </div>
    </div>
  );
};
