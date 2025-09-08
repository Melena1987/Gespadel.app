// Fix: Create file content for ProfileModal.tsx
import React, { useState } from 'react';
import type { Player, Category } from '../types';
import { ALL_CATEGORIES } from '../constants';
import { ProfilePicturePlaceholder } from './icons/ProfilePicturePlaceholder';

interface ProfileModalProps {
  player: Player;
  onClose: () => void;
  onSave: (player: Player, profilePictureFile?: File | null) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ player, onClose, onSave }) => {
  const [name, setName] = useState(player.name);
  const [email, setEmail] = useState(player.email);
  const [phone, setPhone] = useState(player.phone);
  const [gender, setGender] = useState(player.gender);
  const [category, setCategory] = useState(player.category);
  const [profilePicturePreview, setProfilePicturePreview] = useState(player.profilePicture);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
          alert('La imagen es demasiado grande. El tamaño máximo es 5MB.');
          return;
      }
      setProfilePictureFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...player, name, email, phone, gender, category }, profilePictureFile);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-white">
      <h2 className="text-2xl font-bold text-center">Mi Perfil</h2>
      
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
            {profilePicturePreview ? (
                 <img src={profilePicturePreview} alt="Foto de perfil" className="h-24 w-24 rounded-full object-cover ring-2 ring-slate-600" />
            ) : (
                <div className="h-24 w-24 rounded-full bg-slate-700 flex items-center justify-center ring-1 ring-slate-600">
                    <ProfilePicturePlaceholder />
                </div>
            )}
        </div>
        <label htmlFor="picture-upload" className="cursor-pointer bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold py-2 px-4 rounded-md text-sm transition-colors">
            <span>Cambiar foto</span>
            <input id="picture-upload" name="picture-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/png, image/jpeg, image/webp, image/gif" />
        </label>
      </div>

      <div>
        <label htmlFor="profile-name" className="block text-sm font-medium text-slate-300 mb-1">Nombre Completo</label>
        <input
          type="text"
          id="profile-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-slate-700/50 border border-slate-600 rounded-md py-2 px-3 focus:ring-2 focus:ring-cyan-500 outline-none"
          required
        />
      </div>

      <div>
        <label htmlFor="profile-email" className="block text-sm font-medium text-slate-300 mb-1">Email</label>
        <input
          type="email"
          id="profile-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-slate-700/50 border border-slate-600 rounded-md py-2 px-3 focus:ring-2 focus:ring-cyan-500 outline-none"
          required
        />
      </div>
      
       <div>
        <label htmlFor="profile-phone" className="block text-sm font-medium text-slate-300 mb-1">Teléfono</label>
        <input
          type="tel"
          id="profile-phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full bg-slate-700/50 border border-slate-600 rounded-md py-2 px-3 focus:ring-2 focus:ring-cyan-500 outline-none"
          required
        />
      </div>

       <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Género</label>
        <div className="flex flex-wrap gap-4">
            <label className="flex items-center space-x-2 cursor-pointer">
                <input type="radio" name="gender" value="masculine" checked={gender === 'masculine'} onChange={e => setGender(e.target.value as Player['gender'])} className="form-radio text-cyan-500 bg-slate-700 border-slate-600 focus:ring-cyan-500"/>
                <span>Masculino</span>
            </label>
             <label className="flex items-center space-x-2 cursor-pointer">
                <input type="radio" name="gender" value="feminine" checked={gender === 'feminine'} onChange={e => setGender(e.target.value as Player['gender'])} className="form-radio text-pink-500 bg-slate-700 border-slate-600 focus:ring-pink-500"/>
                <span>Femenino</span>
            </label>
        </div>
      </div>

       <div>
            <label htmlFor="profile-category" className="block text-sm font-medium text-slate-300 mb-1">Categoría Habitual</label>
            <select id="profile-category" value={category || ''} onChange={e => setCategory(e.target.value as Category)} required className="w-full bg-slate-700/50 border border-slate-600 rounded-md py-2 px-3 focus:ring-2 focus:ring-cyan-500 outline-none">
                <option value="" disabled>Selecciona tu categoría</option>
                {ALL_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
        </div>


      <div className="flex justify-end gap-4 pt-4">
        <button type="button" onClick={onClose} className="px-6 py-2 font-semibold text-slate-300 bg-slate-700 rounded-lg hover:bg-slate-600 transition-all">
          Cancelar
        </button>
        <button type="submit" className="px-6 py-2 font-semibold text-white bg-cyan-600 rounded-lg shadow-md hover:bg-cyan-700 transition-all">
          Guardar Cambios
        </button>
      </div>
    </form>
  );
};