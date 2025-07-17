import React from 'react';
import { Message } from '../types';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const isAgent = message.isAgent;

  return (
    <div className={`flex mb-4 ${isAgent ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex max-w-xs lg:max-w-md ${isAgent ? 'flex-row' : 'flex-row-reverse'}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 ${isAgent ? 'mr-3' : 'ml-3'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isAgent 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-500 text-white'
          }`}>
            {isAgent ? <Bot size={16} /> : <User size={16} />}
          </div>
        </div>

        {/* Message Content */}
        <div className={`rounded-lg px-4 py-2 ${
          isAgent 
            ? 'bg-gray-100 text-gray-800' 
            : 'bg-blue-500 text-white'
        }`}>
          {isAgent && (
            <div className="text-xs font-semibold mb-1 text-blue-600">
              AI Assistant
            </div>
          )}
          <div className="text-sm">{message.content}</div>
          <div className={`text-xs mt-1 ${
            isAgent ? 'text-gray-500' : 'text-blue-100'
          }`}>
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;