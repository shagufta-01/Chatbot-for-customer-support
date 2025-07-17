import React from 'react';
import { Bot } from 'lucide-react';

interface AgentTypingIndicatorProps {
  isTyping: boolean;
}

const AgentTypingIndicator: React.FC<AgentTypingIndicatorProps> = ({ isTyping }) => {
  if (!isTyping) return null;

  return (
    <div className="flex items-center mb-4">
      <div className="flex-shrink-0 mr-3">
        <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
          <Bot size={16} />
        </div>
      </div>
      <div className="bg-gray-100 rounded-lg px-4 py-2">
        <div className="text-xs font-semibold mb-1 text-blue-600">
          AI Assistant
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <span className="text-sm text-gray-500 ml-2">AI is typing...</span>
        </div>
      </div>
    </div>
  );
};

export default AgentTypingIndicator;