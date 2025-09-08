import React, { useState } from 'react';
import type { Tournament, Registration, Player, Category } from '../types';
import { UsersIcon } from './icons/UsersIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface RegistrationsModalProps {
  tournament: Tournament;
  registrations: Registration[];
  players: Player[];
  onClose: () => void;
  onViewPlayer: (playerId: string) => void;
}

type GroupedRegistrations = {
  [key in 'masculine' | 'feminine']?: {
    [key in Category]?: Registration[];
  };
};

export const RegistrationsModal: React.FC<RegistrationsModalProps> = ({ tournament, registrations, players, onClose, onViewPlayer }) => {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (key: string) => {
    setExpandedCategories(prev => ({ ...prev, [key]: !prev[key] }));
  };

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

  const renderCategory = (gender: 'masculine' | 'feminine', category: Category, regs: Registration[]) => {
    const key = `${gender}-${category}`;
    const isExpanded = !!expandedCategories[key];

    return (
      <div key={key} className="mb-2 last:mb-0 border-b border-slate-700 last:border-b-0 pb-2">
        <button
          onClick={() => toggleCategory(key)}
          className="w-full flex justify-between items-center text-left py-2 px-2 rounded-md hover:bg-slate-700/50 transition-colors"
          aria-expanded={isExpanded}
        >
          <div className="flex items-center">
            <h4 className="text-lg font-semibold text-slate-300">{category} Categoría</h4>
            <span className="ml-3 bg-slate-700 text-slate-300 text-xs font-bold px-2 py-0.5 rounded-full">{regs.length}</span>
          </div>
          <ChevronDownIcon className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
        {isExpanded && (
          <div className="pt-2 pl-2">
            {regs.length > 0 ? (
              <ul className="space-y-2">
                {regs.map((reg, index) => {
                  const player1 = players.find(p => p.id === reg.player1Id);
                  const player2 = reg.player2Id ? players.find(p => p.id === reg.player2Id) : null;
                  return (
                    <li key={reg.id} className="flex items-center bg-slate-700/50 p-2 rounded-lg">
                      <span className="text-sm font-mono text-slate-500 mr-3">{index + 1}.</span>
                      <div className="flex-grow text-slate-200 text-sm">
                        {player1 ? (
                          <button onClick={() => onViewPlayer(player1.id)} className="hover:underline hover:text-cyan-400 transition-colors text-left">
                            {player1.name}
                          </button>
                        ) : 'Jugador no encontrado'}
                        {player2 && (
                          <>
                            <span className="text-slate-500 mx-1">/</span>
                            <button onClick={() => onViewPlayer(player2.id)} className="hover:underline hover:text-cyan-400 transition-colors text-left">
                              {player2.name}
                            </button>
                          </>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-slate-500 italic px-2 py-2">No hay inscritos en esta categoría.</p>
            )}
          </div>
        )}
      </div>
    );
  };

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
