import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Branch, Message, MessageSender, User } from '../types';
import MessageComponent from './Message';
import PromptSuggestions from './PromptSuggestions';
import { SendIcon, LoadingSpinner, AttachmentIcon } from './icons';
import { db } from '../firebaseConfig';
import { BRANCHES } from '../constants';

// ——————————————————————————————
// 🔥 IMPORTANT: Gemini API call via Vercel backend
// ——————————————————————————————
async function askGemini(message: string) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  const data = await res.json();
  return data.text;
}

// ——————————————————————————————
// 🔥 Replacement for Part (since @google/genai removed)
// ——————————————————————————————
type Part = {
  inlineData?: { data: string; mimeType: string };
  text?: string;
};

interface ChatInterfaceProps {
  chatId: string | null;
  branch?: Branch;
  currentUser: User;
  translations: any;
  onChatCreated?: (chatId: string) => void;
  onChatEnd: () => void;
}

// ——————————————————————————————
// Image to Base64 (still works fine)
// ——————————————————————————————
const fileToGenerativePart = async (file: File): Promise<Part> => {
  const base64 = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });

  return {
    inlineData: { data: base64, mimeType: file.type },
  };
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  chatId,
  branch,
  currentUser,
  translations,
  onChatCreated,
  onChatEnd
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [useSearch, setUseSearch] = useState(false);

  const [activeChatId, setActiveChatId] = useState<string | null>(chatId);
  const [currentBranch, setCurrentBranch] = useState<Branch | undefined>(branch);

  const chatInstances = useRef<Map<string, any>>(new Map());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ——————————————————————————————
  // Load messages from Firestore
  // ——————————————————————————————
  useEffect(() => {
    if (!activeChatId) return;

    const chatRef = db.collection('chats').doc(activeChatId);

    chatRef.get().then(doc => {
      if (doc.exists) {
        const data = doc.data();
        if (data?.branchId) {
          const branch = BRANCHES.find(b => b.id === data.branchId);
          setCurrentBranch(branch);
        }
      }
    });

    const unsubscribe = chatRef
      .collection('messages')
      .orderBy('timestamp', 'asc')
      .onSnapshot(snapshot => {
        const fetched = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Message));
        setMessages(fetched);
      });

    return () => unsubscribe();
  }, [activeChatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


  // ——————————————————————————————
  // Chat instance (our fake session wrapper)
  // ——————————————————————————————
  const getChatInstance = (branchForChat: Branch): any => {
    const key = `${branchForChat.id}-${useSearch}`;

    if (!chatInstances.current.has(key)) {
      const newChat = {
        sendMessage: async (finalMessage: string) => {
          return await askGemini(finalMessage);
        }
      };
      chatInstances.current.set(key, newChat);
    }

    return chatInstances.current.get(key)!;
  };

  // ——————————————————————————————
  // Image selection
  // ——————————————————————————————
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // ——————————————————————————————
  // Send message
  // ——————————————————————————————
  const handleSendMessage = useCallback(async (prompt?: string) => {
    const currentInput = prompt || input;
    if ((!currentInput.trim() && !image) || isLoading) return;

    let tempId = activeChatId;
    let branchForChat = currentBranch;

    // Create new chat record
    if (!tempId && branchForChat) {
      setIsLoading(true);
      const newChatRef = await db.collection('chats').add({
        userId: currentUser.uid,
        title: currentInput.substring(0, 30),
        branchId: branchForChat.id,
        createdAt: new Date(),
      });

      tempId = newChatRef.id;
      setActiveChatId(tempId);
      onChatCreated?.(tempId);
    }

    if (!tempId || !branchForChat) return;

    const chatRef = getChatInstance(branchForChat);

    const userMessage: Omit<Message, 'id'> = {
      text: currentInput,
      sender: MessageSender.USER,
      image: imagePreview || undefined,
      timestamp: new Date(),
    };

    setInput('');
    setImage(null);
    setImagePreview(null);
    setIsLoading(true);

    await db.collection('chats').doc(tempId).collection('messages').add(userMessage);

    try {
      const finalMessage = `${branchForChat.systemInstruction}\n\n${currentInput}`;
      const aiText = await chatRef.sendMessage(finalMessage);

      await db.collection('chats')
        .doc(tempId)
        .collection('messages')
        .add({
          text: aiText,
          sender: MessageSender.AI,
          timestamp: new Date(),
        });

    } catch (err) {
      console.error('AI error:', err);

      await db.collection('chats')
        .doc(tempId)
        .collection('messages')
        .add({
          text: translations.error,
          sender: MessageSender.SYSTEM,
          isError: true,
          timestamp: new Date(),
        });

    } finally {
      setIsLoading(false);
    }

  }, [input, image, isLoading, currentBranch, activeChatId, currentUser, imagePreview, translations, onChatCreated]);


  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // ——————————————————————————————
  // UI
  // ——————————————————————————————
  return (
    <div className="h-full w-full flex flex-col bg-transparent overflow-hidden">
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 && !activeChatId ? (
            <PromptSuggestions onSuggestionClick={handleSendMessage} translations={translations.promptSuggestions} />
          ) : (
            messages.map(msg => <MessageComponent key={msg.id} message={msg} />)
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="p-4 bg-[var(--chat-bg)]/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          
          {imagePreview && (
            <div className="relative w-24 h-24 mb-2 p-1 border border-slate-600 rounded-md">
              <img src={imagePreview} className="w-full h-full object-cover rounded" />
              <button
                onClick={() => { setImage(null); setImagePreview(null); }}
                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
              >X</button>
            </div>
          )}

          <div className="flex items-center p-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg">
            
            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent)] disabled:text-slate-600"
            >
              <AttachmentIcon className="w-5 h-5"/>
            </button>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={translations.inputPlaceholder}
              className="flex-1 bg-transparent focus:outline-none resize-none mx-2"
              rows={1}
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || (!input.trim() && !image)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--accent)] hover:bg-green-900/50"
            >
              {isLoading ? <LoadingSpinner /> : <SendIcon className="w-5 h-5"/>}
            </button>

          </div>

          <div className="flex items-center justify-center gap-2 mt-3">
            <label className="text-sm text-[var(--text-secondary)] cursor-pointer">{translations.expandSearch}</label>
            <button
              role="switch"
              aria-checked={useSearch}
              onClick={() => setUseSearch(!useSearch)}
              className={`${useSearch ? 'bg-[var(--accent)]' : 'bg-slate-600'} relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span className={`${useSearch ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 bg-white rounded-full transform`} />
            </button>
          </div>

        </div>
      </footer>
    </div>
  );
};

export default ChatInterface;
