import React, { useState } from 'react';
import { User } from 'lucide-react';

interface UsernameModalProps {
  currentUsername: string;
  onUsernameChange: (username: string) => void;
  onClose: () => void;
}

const UsernameModal: React.FC<UsernameModalProps> = ({ 
  currentUsername, 
  onUsernameChange, 
  onClose 
}) => {
  const [username, setUsername] = useState(currentUsername);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && username.trim() !== currentUsername) {
      onUsernameChange(username.trim());
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center mb-4">
          <User className="mr-2 text-blue-500" size={24} />
          <h2 className="text-xl font-semibold">Change Username</h2>
        </div>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
          />
          
          <div className="flex justify-end mt-4 space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsernameModal;