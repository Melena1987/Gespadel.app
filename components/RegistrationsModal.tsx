import React from 'react';
import type { Tournament, Registration, Player, Category } from '../types';
import { UsersIcon } from './icons/UsersIcon';

interface RegistrationsModalProps {
  tournament: Tournament;
  registrations: Registration[];
  players: Player[];
  onClose: () => void;
}

type GroupedRegistrations = {
  [key in 'masculine' | 'feminine']?: {
    [key in Category]?: Registration[];
  };
};

export const RegistrationsModal: React.FC<RegistrationsModalProps> = ({ tournament, registrations, players, onClose }) => {
  const playersMap = new Map(players.map(p => [p.id, p.name]));

  const tournamentRegistrations = registrations.filter(r => r.tournamentId === tournament.id);

  const grouped: GroupedRegistrations = tournamentRegistrations.reduce((acc, reg) => {
    const { gender, category } = reg;
    if (!acc[gender]) {
      acc[gender] = {};
    }
    if (!acc[gender]![category]) {
      acc[gender]![category] = [];
    }
    acc[gender]![category]!.push(reg);
    return acc;
  }, {} as GroupedRegistrations);

  const renderCategory = (gender: 'masculine' | 'feminine', category: Category, regs: Registration[]) => (
    <div key={`${gender}-${category}`} className="mb-6 last:mb-0">
      <h4 className="text-lg font-semibold text-slate-300 mb-3 border-b border-slate-600 pb-2">{category} Categoría</h4>
      {regs.length > 0 ? (
        <ul className="space-y-3">
          {regs.map((reg, index) => {
            const player1Name = playersMap.get(reg.player1Id);
            const player2Name = reg.player2Id ? playersMap.get(reg.player2Id) : null;
            return (
              <li key={reg.id} className="flex items-center bg-slate-700/50 p-3 rounded-lg">
                <span className="text-sm font-mono text-slate-500 mr-4">{index + 1}.</span>
                <div className="flex-grow text-slate-200">
                  <p>{player1Name || 'Jugador no encontrado'}</p>
                  {player2Name && <p className="text-sm text-slate-400">{player2Name}</p>}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-slate-500 italic">No hay inscritos en esta categoría.</p>
      )}
    </div>
  );

  const renderGenderSection = (gender: 'masculine' | 'feminine', title: string, color: string) => {
    const categories = tournament.categories[gender];
    const genderRegistrations = grouped[gender];

    if (!categories || categories.length === 0) {
      return null;
    }
    
    const sortedCategories = [...categories].sort((a, b) => parseInt(a) - parseInt(b));

    return (
      <div>
        <h3 className={`text-2xl font-bold mb-4 ${color}`}>{title}</h3>
        {sortedCategories.map(cat => renderCategory(gender, cat, genderRegistrations?.[cat] || []))}
      </div>
    );
  };

  return (
    <div className="text-white">
      <h2 id="modal-title" className="text-2xl font-bold mb-2">Inscripciones para:</h2>
      <p className="text-lg text-cyan-400 font-semibold mb-6">{tournament.name}</p>

      {tournamentRegistrations.length === 0 ? (
        <div className="text-center py-10 flex flex-col items-center text-slate-400">
          <UsersIcon />
          <p className="mt-4">Aún no hay inscripciones para este torneo.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {renderGenderSection('masculine', 'Categorías Masculinas', 'text-cyan-400')}
          {renderGenderSection('feminine', 'Categorías Femeninas', 'text-pink-400')}
        </div>
      )}
    </div>
  );
};
