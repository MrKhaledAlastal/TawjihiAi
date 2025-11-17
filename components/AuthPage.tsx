import React, { useState, useEffect } from 'react';
import { VextronicLogo, GoogleIcon } from './icons';
import { auth } from '../firebaseConfig';


interface AuthPageProps {
  translations: any;
}

const AuthPage: React.FC<AuthPageProps> = ({ translations }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isStorageEnabled, setIsStorageEnabled] = useState(true);

  useEffect(() => {
    try {
      // Firebase needs web storage to persist auth state.
      localStorage.setItem('__firebase_storage_test__', '1');
      localStorage.removeItem('__firebase_storage_test__');
      setIsStorageEnabled(true);
    } catch (e) {
      setIsStorageEnabled(false);
      setError("Web storage (cookies) is disabled. Please enable it in your browser settings to sign in.");
      console.error("Web storage check failed:", e);
    }
  }, []);

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStorageEnabled) return;
    setError('');

    try {
      if (isLogin) {
        await auth.signInWithEmailAndPassword(email, password);
      } else {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        await userCredential.user.updateProfile({ displayName: name });
      }
      // The onAuthStateChanged listener in App.tsx will handle the redirect.
    } catch (err: any) {
        if (err.code === 'auth/email-already-in-use') {
            setError(translations.emailInUse);
        } else if (err.code === 'auth/operation-not-allowed') {
            setError("Email/Password sign-in is disabled for this app.");
        }
        else {
            setError(translations.authError);
        }
      console.error("Firebase Auth Error:", err);
    }
  };
  
  const handleGoogleSignIn = async () => {
    if (!isStorageEnabled) return;
    setError('');
    const provider = new (window as any).firebase.auth.GoogleAuthProvider();
    try {
      await auth.signInWithPopup(provider);
      // The onAuthStateChanged listener in App.tsx will handle the success.
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        setError("Google Sign-In is disabled for this app. Please contact support.");
      } else if (err.code !== 'auth/popup-closed-by-user') {
          setError(translations.authError);
      }
      console.error("Google Sign-In Error:", err);
    }
  };

  const handleDeveloperLogin = async () => {
    if (!isStorageEnabled) return;
    setError('');
    try {
      await auth.signInAnonymously();
      // The onAuthStateChanged listener in App.tsx will handle the rest.
    } catch (err: any) {
      if (err.code === 'auth/admin-restricted-operation' || err.code === 'auth/operation-not-allowed') {
        setError("Developer Sign-In Failed: Please enable Anonymous sign-in in the Firebase Console (Auth > Sign-in method).");
      } else {
        setError("Developer sign-in failed. Check console for details.");
      }
      console.error("Developer Sign-In Error:", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--background)] p-4">
      <div className="w-full max-w-md">
        <VextronicLogo className="mb-8 justify-center" />
        <div className="bg-[var(--sidebar-bg)] p-8 rounded-xl border border-[var(--border-color)] shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">
              {isLogin ? translations.loginTitle : translations.registerTitle}
            </h1>
            <p className="text-[var(--text-secondary)] mt-2">
              {isLogin ? translations.loginSubtitle : translations.registerSubtitle}
            </p>
          </div>

          {error && <p className="mb-4 text-center text-red-400 bg-red-900/50 p-2 rounded-md">{error}</p>}

          <form onSubmit={handleAuthAction} className="space-y-6">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[var(--text-secondary)]">
                  {translations.nameLabel}
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={!isStorageEnabled}
                  className="mt-1 block w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-md shadow-sm py-2 px-3 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] disabled:opacity-50"
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--text-secondary)]">
                {translations.emailLabel}
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={!isStorageEnabled}
                className="mt-1 block w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-md shadow-sm py-2 px-3 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] disabled:opacity-50"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--text-secondary)]">
                {translations.passwordLabel}
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={!isStorageEnabled}
                className="mt-1 block w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-md shadow-sm py-2 px-3 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] disabled:opacity-50"
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={!isStorageEnabled}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--accent)] hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLogin ? translations.loginButton : translations.registerButton}
              </button>
            </div>
          </form>
          
          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--border-color)]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[var(--sidebar-bg)] text-[var(--text-secondary)]">{translations.orSeparator}</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleGoogleSignIn}
              disabled={!isStorageEnabled}
              className="w-full flex items-center justify-center gap-3 py-2 px-4 border border-[var(--border-color)] rounded-md shadow-sm text-sm font-medium text-[var(--text-secondary)] bg-[var(--input-bg)] hover:bg-[var(--ai-bubble-bg)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <GoogleIcon />
              <span>{translations.googleSignIn}</span>
            </button>
          </div>
          
          <div className="mt-4">
            <button
                onClick={handleDeveloperLogin}
                disabled={!isStorageEnabled}
                className="w-full flex items-center justify-center gap-3 py-2 px-4 border border-yellow-500 rounded-md shadow-sm text-sm font-medium text-yellow-400 bg-transparent hover:bg-yellow-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <span>تسجيل الدخول كمطور</span>
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-[var(--text-secondary)]">
              {isLogin ? translations.switchToRegister : translations.switchToLogin}{' '}
              <button onClick={() => {setIsLogin(!isLogin); setError('');}} className="font-medium text-[var(--accent)] hover:underline" disabled={!isStorageEnabled}>
                {isLogin ? translations.switchToRegisterLink : translations.switchToLoginLink}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;