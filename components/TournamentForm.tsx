import React, { useState } from 'react';
import type { Tournament, Category } from '../types';
import { ALL_CATEGORIES } from '../constants';

interface TournamentFormProps {
  onSubmit: (data: Omit<Tournament, 'id' | 'status'>) => void;
  onCancel: () => void;
}

export const TournamentForm: React.FC<TournamentFormProps> = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [clubName, setClubName] = useState('');
  const [description, setDescription] = useState('');
  const [inscriptionStartDate, setInscriptionStartDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [masculineCategories, setMasculineCategories] = useState<Set<Category>>(new Set());
  const [feminineCategories, setFeminineCategories] = useState<Set<Category>>(new Set());
  const [posterImage, setPosterImage] = useState<string | null>(null);

  const handleCategoryChange = (category: Category, gender: 'masculine' | 'feminine') => {
    const setCategories = gender === 'masculine' ? setMasculineCategories : setFeminineCategories;
    setCategories(prev => {
      const newCategories = new Set(prev);
      if (newCategories.has(category)) {
        newCategories.delete(category);
      } else {
        newCategories.add(category);
      }
      return newCategories;
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPosterImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && clubName && description && inscriptionStartDate && startDate && endDate && (masculineCategories.size > 0 || feminineCategories.size > 0)) {
      onSubmit({
        name,
        clubName,
        description,
        inscriptionStartDate,
        startDate,
        endDate,
        categories: {
          masculine: Array.from(masculineCategories),
          feminine: Array.from(feminineCategories),
        },
        posterImage,
      });
    } else {
      alert('Por favor, completa todos los campos requeridos (nombre, club, descripción, fechas y al menos una categoría).');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 id="modal-title" className="text-2xl font-bold text-white">
        Crear Nuevo Torneo
      </h2>
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">Nombre del Torneo</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-slate-700/50 border border-slate-600 rounded-md py-2 px-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
          placeholder="Ej: Torneo Verano 2024"
          required
        />
      </div>

      <div>
        <label htmlFor="clubName" className="block text-sm font-medium text-slate-300 mb-1">Nombre del Club</label>
        <input
          type="text"
          id="clubName"
          value={clubName}
          onChange={(e) => setClubName(e.target.value)}
          className="w-full bg-slate-700/50 border border-slate-600 rounded-md py-2 px-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
          placeholder="Ej: Padel Club Indoor"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-1">Descripción del Torneo</label>
        <textarea
          id="description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-slate-700/50 border border-slate-600 rounded-md py-2 px-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
          placeholder="Añade detalles sobre el torneo: premios, nivel, ambiente, etc."
          required
        />
      </div>
      
      <div>
        <label htmlFor="inscriptionStartDate" className="block text-sm font-medium text-slate-300 mb-1">Inicio de Inscripción</label>
        <input
          type="datetime-local"
          id="inscriptionStartDate"
          value={inscriptionStartDate}
          onChange={(e) => setInscriptionStartDate(e.target.value)}
          className="w-full bg-slate-700/50 border border-slate-600 rounded-md py-2 px-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none appearance-none"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-slate-300 mb-1">Inicio del Torneo</label>
            <input
              type="datetime-local"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-md py-2 px-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none appearance-none"
              required
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-slate-300 mb-1">Fin del Torneo</label>
            <input
              type="datetime-local"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-md py-2 px-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none appearance-none"
              required
            />
          </div>
      </div>

       <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Cartel del Torneo (Opcional)</label>
        <div className="mt-2 flex items-center gap-4">
          {posterImage ? (
            <img src={posterImage} alt="Vista previa del cartel" className="h-20 w-20 rounded-md object-cover ring-2 ring-slate-600" />
          ) : (
            <div className="h-20 w-20 rounded-md bg-slate-700/50 flex items-center justify-center text-slate-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
          )}
          <label htmlFor="poster-upload" className="cursor-pointer bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold py-2 px-4 rounded-md transition-colors">
            <span>Subir imagen</span>
            <input id="poster-upload" name="poster-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/png, image/jpeg, image/webp" />
          </label>
        </div>
      </div>

      <div>
        <span className="block text-sm font-medium text-slate-300 mb-2">Categorías</span>
        <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-slate-400 mb-2">Masculinas</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {ALL_CATEGORIES.map(cat => (
                  <label key={`m-${cat}`} className="flex items-center space-x-2 cursor-pointer bg-slate-700/50 border border-slate-600 rounded-md py-2 px-3 text-white has-[:checked]:bg-cyan-600 has-[:checked]:border-cyan-500 transition-all">
                    <input
                      type="checkbox"
                      checked={masculineCategories.has(cat)}
                      onChange={() => handleCategoryChange(cat, 'masculine')}
                      className="form-checkbox h-4 w-4 text-cyan-600 bg-slate-800 border-slate-500 rounded focus:ring-cyan-500"
                    />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
            </div>
             <div>
              <p className="text-sm font-semibold text-slate-400 mb-2">Femeninas</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {ALL_CATEGORIES.map(cat => (
                  <label key={`f-${cat}`} className="flex items-center space-x-2 cursor-pointer bg-slate-700/50 border border-slate-600 rounded-md py-2 px-3 text-white has-[:checked]:bg-cyan-600 has-[:checked]:border-cyan-500 transition-all">
                    <input
                      type="checkbox"
                      checked={feminineCategories.has(cat)}
                      onChange={() => handleCategoryChange(cat, 'feminine')}
                      className="form-checkbox h-4 w-4 text-cyan-600 bg-slate-800 border-slate-500 rounded focus:ring-cyan-500"
                    />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
            </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-4 pt-4">
        <button type="button" onClick={onCancel} className="px-6 py-2 font-semibold text-slate-300 bg-slate-700 rounded-lg hover:bg-slate-600 transition-all">
          Cancelar
        </button>
        <button type="submit" className="px-6 py-2 font-semibold text-white bg-cyan-600 rounded-lg shadow-md hover:bg-cyan-700 transition-all">
          Guardar Torneo
        </button>
      </div>
    </form>
  );
};
