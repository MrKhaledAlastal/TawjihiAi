import React, { useState, useEffect } from 'react';
import { VextronicLogo, PlusIcon, SunIcon, MoonIcon, LanguageIcon, UserIconWithCircle, LogoutIcon } from './icons';
import { Theme, Language } from '../App';
import { User, ChatSession } from '../types';
import { db } from '../firebaseConfig';

interface SidebarProps {
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

const Sidebar: React.FC<SidebarProps> = ({ theme, setTheme, language, setLanguage, onNewChat, onSelectChat, translations, currentUser, onLogout, activeChatId }) => {
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = db.collection('chats')
      .where('userId', '==', currentUser.uid)
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const history = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatSession));
        setChatHistory(history);
      });
    
    return () => unsubscribe();
  }, [currentUser]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  return (
    <aside className="w-64 bg-[var(--sidebar-bg)] p-4 flex flex-col border-l border-[var(--border-color)]">
      <div className="flex-1 overflow-y-auto">
        <VextronicLogo />
        <button 
          onClick={onNewChat}
          className="mt-6 w-full flex items-center justify-center gap-2 p-2 rounded-lg text-white bg-[var(--accent)] hover:bg-green-700 font-semibold transition-colors"
        >
          <PlusIcon className="w-5 h-5"/>
          <span>{translations.newChat}</span>
        </button>
        <div className="mt-4">
            <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase px-2">{translations.myChats}</h3>
            {chatHistory.length > 0 ? (
                <ul className="mt-2 space-y-1">
                    {chatHistory.map(chat => (
                        <li key={chat.id}>
                            <button
                                onClick={() => onSelectChat(chat.id)}
                                className={`w-full text-left text-sm px-2 py-1.5 rounded-md truncate ${activeChatId === chat.id ? 'bg-[var(--ai-bubble-bg)] text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--ai-bubble-bg)]'}`}
                            >
                                {chat.title}
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-[var(--text-secondary)] mt-2 px-2">{translations.noRecentChats}</p>
            )}
        </div>
      </div>
      <div className="flex flex-col gap-1 flex-shrink-0">
        <div className="border-t border-[var(--border-color)] pt-2 mt-2">
             <div className="flex items-center gap-2 p-2">
                 <UserIconWithCircle />
                 <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{currentUser?.name || 'User'}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{currentUser?.email || 'user@example.com'}</p>
                 </div>
             </div>
        </div>
         <button 
            onClick={toggleTheme}
            className="w-full flex items-center gap-2 p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--ai-bubble-bg)] hover:text-[var(--text-primary)] transition-colors"
          >
           {theme === 'dark' ? <SunIcon className="w-5 h-5"/> : <MoonIcon className="w-5 h-5" />}
           <span>{theme === 'dark' ? translations.lightMode : translations.darkMode}</span>
         </button>
         <button 
            onClick={toggleLanguage}
            className="w-full flex items-center gap-2 p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--ai-bubble-bg)] hover:text-[var(--text-primary)] transition-colors"
          >
           <LanguageIcon className="w-5 h-5"/>
           <span>{language === 'ar' ? 'English' : 'العربية'}</span>
         </button>
         <button 
            onClick={onLogout}
            className="w-full flex items-center gap-2 p-2 rounded-lg text-red-400 hover:bg-red-900/50 hover:text-red-300 transition-colors"
          >
           <LogoutIcon className="w-5 h-5"/>
           <span>{translations.logout}</span>
         </button>
      </div>
    </aside>
  );
};

export default Sidebar;