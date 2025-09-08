
import React, { useState, useEffect } from 'react';
import type { Tournament, Category } from '../types';
import { ALL_CATEGORIES } from '../constants';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { TrashIcon } from './icons/TrashIcon';
import { useNotification } from './notifications/NotificationContext';

interface TournamentFormProps {
  onSubmit: (data: Omit<Tournament, 'id' | 'status' | 'posterImage' | 'rulesPdfUrl'> & { posterImageFile?: File | null; rulesPdfFile?: File | null; removeRulesPdf?: boolean; }) => void;
  onCancel: () => void;
  initialData?: Tournament | null;
}

export const TournamentForm: React.FC<TournamentFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const { addNotification } = useNotification();
  const isEditing = !!initialData;
  const [name, setName] = useState('');
  const [clubName, setClubName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [inscriptionStartDate, setInscriptionStartDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [masculineCategories, setMasculineCategories] = useState<Set<Category>>(new Set());
  const [feminineCategories, setFeminineCategories] = useState<Set<Category>>(new Set());
  const [posterImagePreview, setPosterImagePreview] = useState<string | null>(null);
  const [posterImageFile, setPosterImageFile] = useState<File | null>(null);
  const [rulesPdfFile, setRulesPdfFile] = useState<File | null>(null);
  const [initialRulesPdfUrl, setInitialRulesPdfUrl] = useState<string | null>(null);
  const [removeRulesPdf, setRemoveRulesPdf] = useState(false);
  
  useEffect(() => {
    if (initialData) {
        setName(initialData.name);
        setClubName(initialData.clubName);
        setDescription(initialData.description);
        setPrice(initialData.price ? String(initialData.price) : '');
        setInscriptionStartDate(initialData.inscriptionStartDate);
        setStartDate(initialData.startDate);
        setEndDate(initialData.endDate);
        setContactPhone(initialData.contactPhone);
        setContactEmail(initialData.contactEmail);
        setMasculineCategories(new Set(initialData.categories.masculine));
        setFeminineCategories(new Set(initialData.categories.feminine));
        setPosterImagePreview(initialData.posterImage);
        setInitialRulesPdfUrl(initialData.rulesPdfUrl || null);
        setPosterImageFile(null);
        setRulesPdfFile(null);
        setRemoveRulesPdf(false);
    } else {
        // Reset form for creation
        setName('');
        setClubName('');
        setDescription('');
        setPrice('');
        setInscriptionStartDate('');
        setStartDate('');
        setEndDate('');
        setContactPhone('');
        setContactEmail('');
        setMasculineCategories(new Set());
        setFeminineCategories(new Set());
        setPosterImagePreview(null);
        setPosterImageFile(null);
        setInitialRulesPdfUrl(null);
        setRulesPdfFile(null);
        setRemoveRulesPdf(false);
    }
  }, [initialData]);

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
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        addNotification('La imagen es demasiado grande. El tamaño máximo es 10MB.', 'error');
        return;
      }
      setPosterImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPosterImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        addNotification('Por favor, sube solo archivos PDF.', 'error');
        e.target.value = '';
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        addNotification('El archivo PDF es demasiado grande. El tamaño máximo es 5MB.', 'error');
        e.target.value = '';
        return;
      }
      setRulesPdfFile(file);
      setRemoveRulesPdf(false); // A new file overrides removal
    }
  };

  const handleRemovePdf = () => {
    setRulesPdfFile(null);
    setRemoveRulesPdf(true); // Flag for removal on submit
    const input = document.getElementById('rules-upload') as HTMLInputElement;
    if (input) input.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && clubName && price && description && inscriptionStartDate && startDate && endDate && contactPhone && contactEmail && (masculineCategories.size > 0 || feminineCategories.size > 0)) {
      onSubmit({
        name,
        clubName,
        description,
        price: parseFloat(price),
        inscriptionStartDate,
        startDate,
        endDate,
        contactPhone,
        contactEmail,
        categories: {
          masculine: Array.from(masculineCategories),
          feminine: Array.from(feminineCategories),
        },
        posterImageFile,
        rulesPdfFile,
        removeRulesPdf,
      });
    } else {
      addNotification('Por favor, completa todos los campos requeridos.', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 id="modal-title" className="text-2xl font-bold text-white">
        {isEditing ? 'Editar Torneo' : 'Crear Nuevo Torneo'}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <label htmlFor="price" className="block text-sm font-medium text-slate-300 mb-1">Precio Inscripción (€)</label>
            <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full bg-slate-700/50 border border-slate-600 rounded-md py-2 px-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
            placeholder="Ej: 20"
            required
            min="0"
            step="0.01"
            />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contactPhone" className="block text-sm font-medium text-slate-300 mb-1">Teléfono de Contacto</label>
            <input
              type="tel"
              id="contactPhone"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-md py-2 px-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
              placeholder="Ej: 600123456"
              required
            />
          </div>
          <div>
            <label htmlFor="contactEmail" className="block text-sm font-medium text-slate-300 mb-1">Email de Contacto</label>
            <input
              type="email"
              id="contactEmail"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-md py-2 px-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
              placeholder="Ej: info@clubpadel.com"
              required
            />
          </div>
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
          {posterImagePreview ? (
            <img src={posterImagePreview} alt="Vista previa del cartel" className="h-20 w-20 rounded-md object-cover ring-2 ring-slate-600" />
          ) : (
            <div className="h-20 w-20 rounded-md bg-slate-700/50 flex items-center justify-center text-slate-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
          )}
          <label htmlFor="poster-upload" className="cursor-pointer bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold py-2 px-4 rounded-md transition-colors">
            <span>Subir imagen</span>
            <input id="poster-upload" name="poster-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/png, image/jpeg, image/webp, image/gif" />
          </label>
        </div>
      </div>
      
       <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Reglamento en PDF (Opcional)</label>
        <div className="mt-2 flex items-center gap-2">
            <div className="flex-grow flex items-center gap-3 h-11 px-3 bg-slate-700/50 border border-slate-600 rounded-md">
                <DocumentTextIcon />
                <span className="text-slate-400 text-sm truncate flex-grow">
                    {rulesPdfFile?.name || (initialRulesPdfUrl && !removeRulesPdf ? 'Reglamento actual cargado' : 'Ningún archivo seleccionado')}
                </span>
                 {(rulesPdfFile || (initialRulesPdfUrl && !removeRulesPdf)) && (
                    <button
                        type="button"
                        onClick={handleRemovePdf}
                        className="p-1.5 text-slate-400 hover:bg-red-500/20 hover:text-red-400 rounded-full transition-colors flex-shrink-0"
                        aria-label="Eliminar reglamento"
                    >
                        <TrashIcon />
                    </button>
                )}
            </div>
            <label htmlFor="rules-upload" className="cursor-pointer bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold py-2 px-4 rounded-md transition-colors flex-shrink-0 h-11 flex items-center">
                <span>{initialRulesPdfUrl && !removeRulesPdf || rulesPdfFile ? 'Cambiar' : 'Subir'}</span>
                <input id="rules-upload" name="rules-upload" type="file" className="sr-only" onChange={handlePdfChange} accept="application/pdf" />
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
          {isEditing ? 'Guardar Cambios' : 'Guardar Torneo'}
        </button>
      </div>
    </form>
  );
};