import React, { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import BranchSelector from './components/BranchSelector';
import Layout from './components/Layout';
import AuthPage from './components/AuthPage';
import { Branch, User } from './types';
import { translations } from './translations';
import { auth, db } from './firebaseConfig';
import { LoadingSpinner } from './components/icons';
import { BRANCHES } from './constants';

export type Theme = 'light' | 'dark';
export type Language = 'ar' | 'en';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [language, setLanguage] = useState<Language>('ar');
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userRef = db.collection('users').doc(user.uid);
        const doc = await userRef.get();
        if (doc.exists) {
          setUserProfile({ uid: user.uid, ...doc.data() } as User);
        } else {
          // New user, create a profile doc
          const newUserProfile: User = {
            uid: user.uid,
            name: user.displayName,
            email: user.email,
          };
          await userRef.set(newUserProfile);
          setUserProfile(newUserProfile);
        }
      } else {
        setUserProfile(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    root.lang = language;
    root.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [theme, language]);

  const handleLogout = () => {
    auth.signOut();
    setActiveChatId(null);
  };

  const handleSelectBranch = async (branch: Branch) => {
    if (userProfile) {
      const userRef = db.collection('users').doc(userProfile.uid);
      await userRef.update({ branchId: branch.id });
      setUserProfile({ ...userProfile, branchId: branch.id });
    }
  };
  
  const handleNewChat = () => {
    setActiveChatId(null);
    setIsSidebarOpen(false); // Close sidebar on mobile
  };

  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
    setIsSidebarOpen(false); // Close sidebar on mobile
  };

  const currentTranslations = translations[language];
  
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-[var(--background)]">
        <LoadingSpinner className="w-12 h-12 text-[var(--accent)]" />
      </div>
    );
  }
  
  if (!userProfile) {
    return <AuthPage translations={currentTranslations.auth} />;
  }

  const renderContent = () => {
    // If user has not selected a branch yet, show the selector.
    if (!userProfile.branchId) {
        return <BranchSelector onSelectBranch={handleSelectBranch} translations={currentTranslations.branchSelector} />;
    }

    // User has a branch, so show the chat interface.
    // We pass a key that only depends on the user, so it doesn't remount on new chat.
    const branch = BRANCHES.find(b => b.id === userProfile.branchId);
    return <ChatInterface 
              key={userProfile.uid} // Stable key to prevent unmounting
              chatId={activeChatId} 
              branch={branch} // Pass the user's default branch
              currentUser={userProfile} 
              translations={currentTranslations.chat} 
              onChatCreated={setActiveChatId} // This will now just update the prop
              onChatEnd={() => setActiveChatId(null)}
            />;
  };

  return (
    <Layout 
        theme={theme} 
        setTheme={setTheme}
        language={language}
        setLanguage={setLanguage}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        translations={currentTranslations.sidebar}
        currentUser={userProfile}
        onLogout={handleLogout}
        activeChatId={activeChatId}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;