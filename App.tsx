import React, { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import BranchSelector from './components/BranchSelector';
import Layout from './components/Layout';
import AuthPage from './components/AuthPage';
import { Branch, User, ChatSession } from './types';
import { translations } from './translations';
import { auth, db } from './firebaseConfig';
import { LoadingSpinner } from './components/icons';

export type Theme = 'light' | 'dark';
export type Language = 'ar' | 'en';

async function sendMessageToAI(message: string) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  const data = await res.json();
  return data.text;
}


const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [language, setLanguage] = useState<Language>('ar');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // This handles the redirect result from Google Sign-In
    auth.getRedirectResult().catch((error) => {
      console.error("Error processing redirect result:", error);
    });

    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setCurrentUser({
          uid: user.uid,
          name: user.displayName,
          email: user.email,
        });
      } else {
        setCurrentUser(null);
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
    setSelectedBranch(null);
  };

  const handleSelectBranch = (branch: Branch) => {
    setSelectedBranch(branch);
  };
  
  const handleNewChat = () => {
    setActiveChatId(null);
    setSelectedBranch(null);
    setIsSidebarOpen(false); // Close sidebar on mobile
  };

  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
    setSelectedBranch(null); // Will be loaded from chat session data
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
  
  if (!currentUser) {
    return <AuthPage translations={currentTranslations.auth} />;
  }

  const renderContent = () => {
    if (activeChatId) {
        return <ChatInterface 
                    key={activeChatId}
                    chatId={activeChatId} 
                    currentUser={currentUser} 
                    translations={currentTranslations.chat} 
                    onChatEnd={() => setActiveChatId(null)}
                />;
    }
    if (selectedBranch) {
        return <ChatInterface 
                    key={'new-chat'}
                    chatId={null} 
                    branch={selectedBranch}
                    currentUser={currentUser} 
                    translations={currentTranslations.chat} 
                    onChatCreated={setActiveChatId}
                    onChatEnd={() => setSelectedBranch(null)}
                />;
    }
    return <BranchSelector onSelectBranch={handleSelectBranch} translations={currentTranslations.branchSelector} />;
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
        currentUser={currentUser}
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
