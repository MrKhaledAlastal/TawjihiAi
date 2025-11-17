import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { Theme, Language } from '../App';
import { User } from '../types';

interface LayoutProps {
  children: ReactNode;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  translations: any;
  currentUser: User | null;
  onLogout: () => void;
  activeChatId: string | null;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  theme, 
  setTheme, 
  language, 
  setLanguage, 
  onNewChat, 
  onSelectChat,
  translations,
  currentUser,
  onLogout,
  activeChatId
}) => {
  const gridBackground = {
    backgroundImage:
      'linear-gradient(var(--border-color) 1px, transparent 1px), linear-gradient(90deg, var(--border-color) 1px, transparent 1px)',
    backgroundSize: '1.5rem 1.5rem',
  };

  return (
    <div className="flex h-screen w-full bg-[var(--background)]">
      <Sidebar 
        theme={theme} 
        setTheme={setTheme}
        language={language}
        setLanguage={setLanguage}
        onNewChat={onNewChat}
        onSelectChat={onSelectChat}
        translations={translations}
        currentUser={currentUser}
        onLogout={onLogout}
        activeChatId={activeChatId}
      />
      <main className="flex-1 h-full" style={gridBackground}>
        {children}
      </main>
    </div>
  );
};

export default Layout;