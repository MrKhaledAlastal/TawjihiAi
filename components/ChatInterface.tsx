import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Branch, Message, MessageSender, User, BranchId } from '../types';
import MessageComponent from './Message';
import PromptSuggestions from './PromptSuggestions';
import { SendIcon, LoadingSpinner, AttachmentIcon } from './icons';
import { createChatSession } from '../services/geminiService';
import type { Chat, Part, Tool } from '@google/genai';
import { db } from '../firebaseConfig';
import { BRANCHES } from '../constants';

interface ChatInterfaceProps {
  chatId: string | null;
  branch?: Branch;
  currentUser: User;
  translations: any;
  onChatCreated?: (chatId: string) => void;
  onChatEnd: () => void;
}

const fileToGenerativePart = async (file: File): Promise<Part> => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({ chatId, branch, currentUser, translations, onChatCreated, onChatEnd }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [useSearch, setUseSearch] = useState(false);
  
  const [activeChatId, setActiveChatId] = useState<string | null>(chatId);
  const [currentBranch, setCurrentBranch] = useState<Branch | undefined>(branch);

  const chatInstances = useRef<Map<string, Chat>>(new Map());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (!activeChatId) return;

    const chatRef = db.collection('chats').doc(activeChatId);
    
    // Get branch info from chat document
    chatRef.get().then(doc => {
      if(doc.exists) {
        const data = doc.data();
        if(data && data.branchId) {
            const foundBranch = BRANCHES.find(b => b.id === data.branchId);
            setCurrentBranch(foundBranch);
        }
      }
    });

    const unsubscribe = chatRef.collection('messages').orderBy('timestamp', 'asc')
      .onSnapshot(snapshot => {
        const fetchedMessages: Message[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
        setMessages(fetchedMessages);
      });

    return () => unsubscribe();
  }, [activeChatId]);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getChatInstance = (branchForChat: Branch): Chat => {
      const key = `${branchForChat.id}-${useSearch}`;
      if (!chatInstances.current.has(key)) {
          const tools: Tool[] | undefined = useSearch ? [{ googleSearch: {} }] : undefined;
          const newChat = createChatSession(branchForChat.systemInstruction, tools);
          chatInstances.current.set(key, newChat);
      }
      return chatInstances.current.get(key)!;
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSendMessage = useCallback(async (prompt?: string) => {
    const currentInput = prompt || input;
    if ((currentInput.trim() === '' && !image) || isLoading || !currentUser) return;

    let tempActiveChatId = activeChatId;
    let branchForChat = currentBranch;

    // Create a new chat session in Firestore if it's the first message
    if (!tempActiveChatId && branchForChat) {
        setIsLoading(true);
        const newChatRef = await db.collection('chats').add({
            userId: currentUser.uid,
            title: currentInput.substring(0, 30) || "New Chat",
            branchId: branchForChat.id,
            createdAt: new Date(),
        });
        tempActiveChatId = newChatRef.id;
        setActiveChatId(tempActiveChatId);
        if(onChatCreated) onChatCreated(tempActiveChatId);
    }

    if (!tempActiveChatId || !branchForChat) {
        console.error("No active chat or branch defined.");
        return;
    }

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

    // Save user message to Firestore
    await db.collection('chats').doc(tempActiveChatId).collection('messages').add(userMessage);

    try {
      const messageParts: Part[] = [];
      if (image) {
        const imagePart = await fileToGenerativePart(image);
        messageParts.push(imagePart);
      }
      if (currentInput.trim() !== '') {
        messageParts.push({ text: currentInput });
      }
      
      const stream = await chatRef.sendMessageStream({ message: messageParts });
      
      let fullResponse = '';
      const aiMessageRef = await db.collection('chats').doc(tempActiveChatId).collection('messages').add({
          text: '',
          sender: MessageSender.AI,
          timestamp: new Date(),
      });

      for await (const chunk of stream) {
        const chunkText = chunk.text;
        fullResponse += chunkText;
        await aiMessageRef.update({ text: fullResponse });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      await db.collection('chats').doc(tempActiveChatId).collection('messages').add({
          text: translations.error,
          sender: MessageSender.SYSTEM,
          isError: true,
          timestamp: new Date(),
      });
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, image, imagePreview, translations, currentUser, activeChatId, currentBranch, onChatCreated]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="h-full w-full flex flex-col bg-transparent overflow-hidden">
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 && !activeChatId ? (
            <PromptSuggestions onSuggestionClick={handleSendMessage} translations={translations.promptSuggestions} />
          ) : (
            messages.map((msg) => <MessageComponent key={msg.id} message={msg} />)
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="p-4 bg-[var(--chat-bg)]/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
           {imagePreview && (
            <div className="relative w-24 h-24 mb-2 p-1 border border-slate-600 rounded-md">
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded" />
              <button
                onClick={() => { setImage(null); setImagePreview(null); }}
                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
              >
                X
              </button>
            </div>
          )}
          <div className="flex items-center p-2 bg-[var(--input-bg)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-lg">
            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent)] disabled:text-slate-600 transition-colors"
              aria-label={translations.attachImage}
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
              disabled={isLoading}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || (!input.trim() && !image)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--accent)] hover:bg-green-900/50 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors"
              aria-label={translations.send}
            >
              {isLoading ? <LoadingSpinner /> : <SendIcon className="w-5 h-5"/>}
            </button>
          </div>
           <div className="flex items-center justify-center gap-2 mt-3">
              <label htmlFor="search-toggle" className="text-sm text-[var(--text-secondary)] cursor-pointer">{translations.expandSearch}</label>
              <button
                role="switch"
                aria-checked={useSearch}
                onClick={() => setUseSearch(!useSearch)}
                className={`${
                  useSearch ? 'bg-[var(--accent)]' : 'bg-slate-600'
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
              >
                <span
                  className={`${
                    useSearch ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </button>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default ChatInterface;