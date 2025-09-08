import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import type { Player } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: 'organizer' | 'player';
}

const GoogleIcon = () => (
    <svg className="w-5 h-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path fill="currentColor" d="M488 261.8C488 403.3 381.5 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-76.2 64.5C308.6 102.3 282.7 96 248 96c-88.8 0-160.1 71.1-160.1 160s71.3 160 160.1 160c97.2 0 132.8-62.4 140.8-92.2H248v-73.6h239.2c1.2 12.3 1.8 24.9 1.8 38.6z"></path>
    </svg>
);


export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, role }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setMode('login');
    setEmail('');
    setPassword('');
    setName('');
    setError(null);
    setIsLoading(false);
    onClose();
  };
  
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
        // onAuthStateChanged in App.tsx will handle the rest
        handleClose();
    } catch (err: any) {
        setError(err.message || 'Error al iniciar sesión con Google.');
    } finally {
        setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        if (!name) {
          setError('El nombre es requerido para registrarse.');
          setIsLoading(false);
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await updateProfile(user, { displayName: name });
        
        const newPlayerData: Omit<Player, 'id'> = { name: name, email: user.email!, phone: '', role: role, category: '4ª', gender: 'masculine' };
        await setDoc(doc(db, 'players', user.uid), newPlayerData);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const title = role === 'organizer' ? 'Acceso Organizador' : 'Acceso Jugador';
  const accentColor = role === 'organizer' ? 'cyan' : 'violet';

  if (!isOpen) return null;

  return (
     <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-md bg-slate-800 rounded-2xl shadow-xl ring-1 ring-white/10 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
            <h2 id="modal-title" className="text-2xl font-bold text-white text-center mb-2">{title}</h2>
            <p className="text-sm text-slate-400 text-center mb-6">
                {mode === 'login' ? 'Inicia sesión para continuar' : 'Crea una cuenta para empezar'}
            </p>

            {role === 'player' && (
                <div className="space-y-3 mb-4">
                     <button 
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 px-8 py-3 font-semibold text-slate-800 bg-white rounded-lg shadow-md hover:bg-slate-200 transition-all disabled:opacity-50">
                        <GoogleIcon />
                        Continuar con Google
                     </button>
                     <div className="flex items-center">
                        <hr className="w-full border-slate-600"/>
                        <span className="px-2 text-xs text-slate-500">O</span>
                        <hr className="w-full border-slate-600"/>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">Nombre Completo</label>
                  <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-700/50 border border-slate-600 rounded-md py-2 px-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 outline-none" required />
                </div>
              )}
               <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                  <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-700/50 border border-slate-600 rounded-md py-2 px-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 outline-none" required />
                </div>
                <div>
                  <label htmlFor="password"className="block text-sm font-medium text-slate-300 mb-1">Contraseña</label>
                  <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-700/50 border border-slate-600 rounded-md py-2 px-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 outline-none" required />
                </div>

                {error && <p className="text-sm text-red-400 text-center" role="alert">{error}</p>}

                <button type="submit" disabled={isLoading} className={`w-full px-6 py-2.5 mt-2 font-semibold text-white bg-${accentColor}-600 rounded-lg shadow-md hover:bg-${accentColor}-700 transition-all disabled:bg-slate-600 disabled:cursor-not-allowed`}>
                  {isLoading ? 'Cargando...' : (mode === 'login' ? 'Iniciar Sesión con Email' : 'Registrarse con Email')}
                </button>
            </form>
            
            <p className="text-center text-sm text-slate-400 mt-6">
              {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes una cuenta?'}
              <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null); }} className={`font-semibold text-${accentColor}-400 hover:text-${accentColor}-300 ml-2 focus:outline-none`}>
                {mode === 'login' ? 'Regístrate' : 'Inicia sesión'}
              </button>
            </p>
        </div>
      </div>
    </div>
  );
};
