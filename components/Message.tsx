import React from 'react';
import { Message, MessageSender } from '../types';
import { BotIcon, UserIcon } from './icons';

interface MessageProps {
  message: Message;
}

const MessageComponent: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.sender === MessageSender.USER;

  if (message.isError) {
    return (
      <div className="flex items-center justify-center my-4">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-red-900/50 border border-red-700 text-red-300 max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 flex-shrink-0">
            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
          </svg>
          <p className="text-sm">{message.text}</p>
        </div>
      </div>
    );
  }

  const wrapperClasses = `flex items-start gap-3 my-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`;
  const messageClasses = `px-4 py-3 rounded-lg max-w-2xl shadow-sm ${isUser ? 'bg-[var(--user-bubble-bg)] text-white' : 'bg-[var(--ai-bubble-bg)] text-[var(--text-primary)]'}`;
  const iconWrapperClasses = `flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 ${isUser ? 'bg-green-200 text-green-800' : 'bg-slate-600 text-[var(--accent)]'}`;

  // Simple markdown-to-html for bold text
  const formatText = (text: string) => {
    return text.split('**').map((part, index) =>
      index % 2 === 1 ? <strong key={index}>{part}</strong> : part
    );
  };
  
  return (
    <div className={wrapperClasses}>
      <div className={iconWrapperClasses}>
        {isUser ? <UserIcon className="w-5 h-5" /> : <BotIcon className="w-5 h-5" />}
      </div>
      <div className={messageClasses}>
        {message.image && (
            <img src={message.image} alt="User upload" className="rounded-lg mb-2 max-w-xs" />
        )}
        <div className="whitespace-pre-wrap leading-relaxed">{formatText(message.text)}</div>
      </div>
    </div>
  );
};

export default MessageComponent;