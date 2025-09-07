import React, { useState } from 'react';
import type { Tournament, Category, Player } from '../types';

interface RegistrationModalProps {
  tournament: Tournament;
  onClose: () => void;
  onSubmit: (registrationData: any) => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({ tournament, onClose, onSubmit }) => {
  const [player1, setPlayer1] = useState<Partial<Player>>({ name: '', email: '', phone: '' });
  const [player2, setPlayer2] = useState<Partial<Player>>({ name: '', email: '', phone: '' });
  const [category, setCategory] = useState<Category | ''>('');
  const [gender, setGender] = useState<'masculine' | 'feminine' | ''>('');
  const [isPair, setIsPair] = useState(true);

  const availableCategories = gender ? tournament.categories[gender] : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!player1.name || !player1.email || !category || !gender || (isPair && (!player2.name || !player2.email))) {
        alert('Por favor, completa todos los campos requeridos.');
        return;
    }
    
    onSubmit({
        tournamentId: tournament.id,
        player1,
        player2: isPair ? player2 : undefined,
        category,
        gender,
    });
  };

  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-1">Inscripción: {tournament.name}</h2>
      <p className="text-sm text-slate-400 mb-6">en {tournament.clubName}</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Género de la Categoría</label>
            <div className="flex gap-4">
                {tournament.categories.masculine.length > 0 && (
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="radio" name="gender" value="masculine" checked={gender === 'masculine'} onChange={() => { setGender('masculine'); setCategory(''); }} className="form-radio text-cyan-500 bg-slate-700 border-slate-600"/>
                        <span>Masculina</span>
                    </label>
                )}
                {tournament.categories.feminine.length > 0 && (
                     <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="radio" name="gender" value="feminine" checked={gender === 'feminine'} onChange={() => { setGender('feminine'); setCategory(''); }} className="form-radio text-pink-500 bg-slate-700 border-slate-600"/>
                        <span>Femenina</span>
                    </label>
                )}
            </div>
        </div>

        {gender && (
             <div>
                <label htmlFor="category" className="block text-sm font-medium text-slate-300 mb-1">Categoría</label>
                <select id="category" value={category} onChange={e => setCategory(e.target.value as Category)} required className="w-full bg-slate-700/50 border border-slate-600 rounded-md py-2 px-3">
                    <option value="" disabled>Selecciona una categoría</option>
                    {availableCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
            </div>
        )}

        <div className="border-t border-slate-700 pt-4">
            <h3 className="font-semibold text-lg mb-2">Jugador 1</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <input type="text" placeholder="Nombre completo" value={player1.name || ''} onChange={e => setPlayer1(p => ({...p, name: e.target.value}))} required className="w-full bg-slate-700/50 border border-slate-600 rounded-md py-2 px-3" />
                 <input type="email" placeholder="Email" value={player1.email || ''} onChange={e => setPlayer1(p => ({...p, email: e.target.value}))} required className="w-full bg-slate-700/50 border border-slate-600 rounded-md py-2 px-3" />
            </div>
        </div>
        
        <div className="border-t border-slate-700 pt-4">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-lg">Jugador 2</h3>
                <label className="flex items-center gap-2 text-sm">
                    <span>¿Juegas solo?</span>
                    <input type="checkbox" checked={!isPair} onChange={() => setIsPair(p => !p)} className="form-checkbox text-cyan-500 bg-slate-700 border-slate-600 rounded" />
                </label>
            </div>
            {isPair && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input type="text" placeholder="Nombre completo" value={player2.name || ''} onChange={e => setPlayer2(p => ({...p, name: e.target.value}))} required={isPair} className="w-full bg-slate-700/50 border border-slate-600 rounded-md py-2 px-3" />
                    <input type="email" placeholder="Email" value={player2.email || ''} onChange={e => setPlayer2(p => ({...p, email: e.target.value}))} required={isPair} className="w-full bg-slate-700/50 border border-slate-600 rounded-md py-2 px-3" />
                </div>
            )}
        </div>

        <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2 font-semibold text-slate-300 bg-slate-700 rounded-lg hover:bg-slate-600">Cancelar</button>
            <button type="submit" className="px-6 py-2 font-semibold text-white bg-cyan-600 rounded-lg shadow-md hover:bg-cyan-700">Confirmar Inscripción</button>
        </div>
      </form>
    </div>
  );
};
