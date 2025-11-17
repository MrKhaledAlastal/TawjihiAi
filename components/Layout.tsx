import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { Theme, Language } from '../App';
import { User } from '../types';
import { MenuIcon } from './icons';

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
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
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
  activeChatId,
  isSidebarOpen,
  setIsSidebarOpen
}) => {
  const gridBackground = {
    backgroundImage:
      'linear-gradient(var(--border-color) 1px, transparent 1px), linear-gradient(90deg, var(--border-color) 1px, transparent 1px)',
    backgroundSize: '4rem 4rem',
  };

  return (
    <div className="flex h-screen w-full bg-[var(--background)] overflow-hidden">
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
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <main className="flex-1 h-full relative" style={gridBackground}>
        <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden absolute top-4 ltr:left-4 rtl:right-4 z-20 p-2 rounded-md bg-[var(--sidebar-bg)]/80 backdrop-blur-sm text-[var(--text-primary)] border border-[var(--border-color)]"
            aria-label="Open menu"
          >
          <MenuIcon className="w-6 h-6" />
        </button>
        {isSidebarOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black/50 z-30"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
          ></div>
        )}
        {children}
      </main>
    </div>
  );
};

export default Layout;