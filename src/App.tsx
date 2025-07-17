import React, { useState, useEffect, useRef } from 'react';
import { Bot, Settings, Circle } from 'lucide-react';
import { useWebSocket } from './hooks/useWebSocket';
import ChatMessage from './components/ChatMessage';
import MessageInput from './components/MessageInput';
import AgentTypingIndicator from './components/AgentTypingIndicator';
import ConnectionStatus from './components/ConnectionStatus';
import UsernameModal from './components/UsernameModal';

function App() {
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    isConnected,
    messages,
    currentUser,
    agentTyping,
    agentStatus,
    sendMessage,
    changeUsername
  } = useWebSocket(''); // URL will be determined automatically

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, agentTyping]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Bot className="text-blue-500 mr-2" size={24} />
            <div>
              <h1 className="text-xl font-semibold text-gray-800">AI Assistant Chat</h1>
              <div className="flex items-center text-sm text-gray-500">
                <Circle 
                  size={8} 
                  className={`mr-1 ${
                    agentStatus === 'online' ? 'text-green-500 fill-current' : 
                    agentStatus === 'busy' ? 'text-yellow-500 fill-current' : 
                    'text-gray-400 fill-current'
                  }`} 
                />
                AI Agent is {agentStatus}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <ConnectionStatus isConnected={isConnected} />
            {currentUser && (
              <button
                onClick={() => setShowUsernameModal(true)}
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <Settings size={18} className="mr-1" />
                {currentUser.username}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <Bot size={48} className="mx-auto mb-4 text-blue-400" />
              <p className="text-lg">Welcome to AI Assistant Chat!</p>
              <p className="text-sm">Start a conversation with our AI assistant.</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
            />
          ))
        )}
        
        <AgentTypingIndicator isTyping={agentTyping} />
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput
        onSendMessage={sendMessage}
        disabled={!isConnected}
      />

      {/* Username Modal */}
      {showUsernameModal && currentUser && (
        <UsernameModal
          currentUsername={currentUser.username}
          onUsernameChange={changeUsername}
          onClose={() => setShowUsernameModal(false)}
        />
      )}
    </div>
  );
}

export default App;