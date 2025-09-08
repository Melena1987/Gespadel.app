import React, { useState, useMemo } from 'react';
import type { Tournament, Player, Category, TimeSlot } from '../types';
import { TimePreferences } from './TimePreferences';

interface RegistrationModalProps {
    player: Player;
    tournament: Tournament;
    onClose: () => void;
    onSubmit: (data: {
        gender: 'masculine' | 'feminine';
        category: Category;
        player2Id?: string;
        timePreferences?: TimeSlot[];
    }) => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({ player, tournament, onClose, onSubmit }) => {
    const [gender, setGender] = useState<'masculine' | 'feminine' | ''>(player.gender || '');
    const [category, setCategory] = useState<Category | ''>(player.category || '');
    const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>([]);
    const [error, setError] = useState('');

    const availableCategories = useMemo(() => {
        if (!gender) return [];
        return tournament.categories[gender] || [];
    }, [gender, tournament.categories]);
    
    // Reset category if gender changes and category is no longer valid
    React.useEffect(() => {
        if (gender && category && !availableCategories.includes(category)) {
            setCategory('');
        }
    }, [gender, category, availableCategories]);


    const handleSlotToggle = (slot: TimeSlot) => {
        setSelectedSlots(prev => {
            const index = prev.findIndex(s => s.date === slot.date && s.hour === slot.hour);
            if (index > -1) {
                return prev.filter((_, i) => i !== index);
            }
            return [...prev, slot];
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!gender || !category) {
            setError('Debes seleccionar un género y una categoría.');
            return;
        }
        setError('');
        onSubmit({
            gender,
            category,
            timePreferences: selectedSlots,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 text-white">
            <div>
                <h2 id="modal-title" className="text-2xl font-bold">Inscripción: {tournament.name}</h2>
                <p className="text-sm text-slate-400">Club: {tournament.clubName}</p>
            </div>

            {error && (
                <div className="bg-red-900/50 border border-red-500/30 text-red-300 p-3 rounded-md text-sm">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Género</label>
                    <div className="flex flex-wrap gap-4">
                        {tournament.categories.masculine.length > 0 && (
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input type="radio" name="gender" value="masculine" checked={gender === 'masculine'} onChange={e => setGender(e.target.value as 'masculine' | 'feminine')} className="form-radio text-cyan-500 bg-slate-700 border-slate-600 focus:ring-cyan-500"/>
                                <span>Masculino</span>
                            </label>
                        )}
                        {tournament.categories.feminine.length > 0 && (
                             <label className="flex items-center space-x-2 cursor-pointer">
                                <input type="radio" name="gender" value="feminine" checked={gender === 'feminine'} onChange={e => setGender(e.target.value as 'masculine' | 'feminine')} className="form-radio text-pink-500 bg-slate-700 border-slate-600 focus:ring-pink-500"/>
                                <span>Femenino</span>
                            </label>
                        )}
                    </div>
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-slate-300 mb-2">Categoría</label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value as Category)}
                        disabled={!gender}
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-md py-2 px-3 focus:ring-2 focus:ring-cyan-500 outline-none disabled:bg-slate-800 disabled:cursor-not-allowed"
                        required
                    >
                        <option value="" disabled>Selecciona una categoría</option>
                        {availableCategories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>
            
            <div>
                <h3 className="text-lg font-semibold text-slate-200 mb-2">Preferencia Horaria (Opcional)</h3>
                <p className="text-sm text-slate-400 mb-4">Selecciona los bloques horarios en los que <span className="font-bold text-red-400">NO</span> puedes jugar. La organización lo tendrá en cuenta si es posible.</p>
                 <TimePreferences
                    startDate={tournament.startDate}
                    endDate={tournament.endDate}
                    selectedSlots={selectedSlots}
                    onSlotToggle={handleSlotToggle}
                />
            </div>

            <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={onClose} className="px-6 py-2 font-semibold text-slate-300 bg-slate-700 rounded-lg hover:bg-slate-600 transition-all">
                    Cancelar
                </button>
                <button type="submit" className="px-6 py-2 font-semibold text-white bg-violet-600 rounded-lg shadow-md hover:bg-violet-700 transition-all">
                    Confirmar Inscripción
                </button>
            </div>
        </form>
    );
};
