
import React, { useState } from 'react';
import { auth } from '../firebase';
import firebase from 'firebase/compat/app';
import { Modal } from './Modal';
import { MailIcon } from './icons/MailIcon';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: 'player' | 'organizer';
  onAuthSuccess: () => void;
  onOpenTerms: () => void;
}

const GoogleIcon = () => (
    <svg className="w-5 h-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path fill="currentColor" d="M488 261.8C488 403.3 381.5 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-76.2 64.5C308.6 102.3 282.7 96 248 96c-88.8 0-160.1 71.1-160.1 160s71.3 160 160.1 160c97.2 0 132.8-62.4 140.8-92.2H248v-73.6h239.2c1.2 12.3 1.8 24.9 1.8 38.6z"></path>
    </svg>
);

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, role, onAuthSuccess, onOpenTerms }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setError(null);
    setLoading(false);
    setIsLoginView(true);
    setTermsAccepted(false);
    onClose();
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (role === 'player') {
        if (!termsAccepted) {
            setError('Debes aceptar los términos y condiciones para continuar.');
            return;
        }
        setLoading(true);
        try {
            const methods = await auth.fetchSignInMethodsForEmail(email);
            if (methods.includes('password')) {
                await auth.signInWithEmailAndPassword(email, password);
            } else {
                await auth.createUserWithEmailAndPassword(email, password);
            }
            onAuthSuccess();
            handleClose();
        } catch (err: any) {
            let friendlyMessage: string;
            switch (err.code) {
                case 'auth/wrong-password':
                    friendlyMessage = 'La contraseña es incorrecta. Por favor, inténtalo de nuevo.';
                    break;
                case 'auth/weak-password':
                    friendlyMessage = 'La contraseña es demasiado débil. Debe tener al menos 6 caracteres.';
                    break;
                case 'auth/invalid-email':
                    friendlyMessage = 'El formato del email no es válido.';
                    break;
                case 'auth/network-request-failed':
                    friendlyMessage = 'Error de red. Comprueba tu conexión a internet.';
                    break;
                default:
                    friendlyMessage = 'Ha ocurrido un error. Por favor, inténtalo de nuevo.';
                    console.error("Firebase auth error:", err);
            }
            setError(friendlyMessage);
        } finally {
            setLoading(false);
        }
    } else { // Organizer logic
        try {
          if (isLoginView) {
            await auth.signInWithEmailAndPassword(email, password);
          } else {
            throw new Error("El registro de organizador debe solicitarse por correo.");
          }
          onAuthSuccess();
          handleClose();
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    if (!termsAccepted) {
        setError('Debes aceptar los términos y condiciones para continuar.');
        return;
    }
    setLoading(true);
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
        await auth.signInWithPopup(provider);
        onAuthSuccess();
        handleClose();
    } catch (err: any) {
        setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderPlayerAuth = () => (
    <>
      <h2 className="text-2xl font-bold text-center mb-6">
        Acceder como Jugador
      </h2>

      {error && <p className="bg-red-900/50 border border-red-500/30 text-red-300 p-3 rounded-md mb-4 text-sm">{error}</p>}

      <form onSubmit={handleAuth} className="space-y-4">
          <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading || !termsAccepted}
              className="w-full flex items-center justify-center gap-3 px-8 py-3 font-semibold text-slate-800 bg-white rounded-lg shadow-md hover:bg-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
              <GoogleIcon />
              Continuar con Google
          </button>

          <div className="relative my-4">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-slate-700" />
              </div>
              <div className="relative flex justify-center">
                  <span className="bg-slate-800 px-2 text-sm text-slate-400">o</span>
              </div>
          </div>
          
          <div>
              <label htmlFor="email-player" className="sr-only">Email</label>
              <input
                  type="email"
                  id="email-player"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-md py-2 px-3 placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 outline-none"
                  placeholder="Email"
                  required
              />
          </div>
           <div>
              <label htmlFor="password-player" className="sr-only">Contraseña</label>
              <input
                  type="password"
                  id="password-player"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-md py-2 px-3 placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 outline-none"
                  placeholder="Contraseña"
                  required
              />
          </div>

          <div className="flex items-start pt-2">
            <input
                id="terms-checkbox"
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="form-checkbox h-4 w-4 text-cyan-600 bg-slate-800 border-slate-500 rounded focus:ring-cyan-500 mt-1"
            />
            <label htmlFor="terms-checkbox" className="ml-3 text-sm text-slate-400">
                He leído y acepto los{' '}
                <button
                    type="button"
                    onClick={onOpenTerms}
                    className="font-semibold text-cyan-400 hover:underline focus:outline-none focus:underline"
                >
                    términos y condiciones
                </button>.
            </label>
          </div>

          <button
              type="submit"
              disabled={loading || !termsAccepted}
              className="w-full flex items-center justify-center gap-3 px-8 py-3 font-semibold text-white bg-cyan-600 rounded-lg shadow-md hover:bg-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
              <MailIcon />
              {loading ? 'Procesando...' : 'Continuar con Email'}
          </button>
      </form>
    </>
  );

  const renderOrganizerAuth = () => (
     <>
        <h2 className="text-2xl font-bold text-center mb-4">
          {isLoginView ? 'Iniciar Sesión' : 'Registrarse'} como Organizador
        </h2>
        
        <div className="flex justify-center border-b border-slate-700 mb-6">
          <button onClick={() => setIsLoginView(true)} className={`px-4 py-2 font-semibold transition-colors ${isLoginView ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-white'}`}>Iniciar Sesión</button>
          <button onClick={() => setIsLoginView(false)} className={`px-4 py-2 font-semibold transition-colors ${!isLoginView ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-white'}`}>Registrarse</button>
        </div>

        {error && <p className="bg-red-900/50 border border-red-500/30 text-red-300 p-3 rounded-md mb-4 text-sm">{error}</p>}
        
        {isLoginView ? (
          <form onSubmit={handleAuth} className="space-y-4">
              <div>
                  <label htmlFor="email-organizer" className="sr-only">Email</label>
                  <input
                      type="email"
                      id="email-organizer"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-md py-2 px-3 placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 outline-none"
                      placeholder="Email"
                      required
                  />
              </div>
               <div>
                  <label htmlFor="password-organizer" className="sr-only">Contraseña</label>
                  <input
                      type="password"
                      id="password-organizer"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-md py-2 px-3 placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 outline-none"
                      placeholder="Contraseña"
                      required
                  />
              </div>
              <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 px-8 py-3 font-semibold text-white bg-cyan-600 rounded-lg shadow-md hover:bg-cyan-700 transition-all disabled:opacity-50"
              >
                  <MailIcon />
                  {loading ? 'Procesando...' : 'Iniciar Sesión'}
              </button>
          </form>
        ) : (
          <div className="text-center text-slate-300 p-4">
            <p className="mb-4">¿Quieres darte de alta como Organizador?</p>
            <a 
              href="mailto:info@melenamarketing.com"
              className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Solicítalo aquí
            </a>
          </div>
        )}
     </>
  );

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <div className="text-white">
        {role === 'player' ? renderPlayerAuth() : renderOrganizerAuth()}
      </div>
    </Modal>
  );
};
