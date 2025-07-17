import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';

interface ConnectionStatusProps {
  isConnected: boolean;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ isConnected }) => {
  return (
    <div className={`flex items-center px-3 py-1 rounded-full text-sm ${
      isConnected 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800'
    }`}>
      {isConnected ? (
        <>
          <Wifi size={16} className="mr-1" />
          Connected
        </>
      ) : (
        <>
          <WifiOff size={16} className="mr-1" />
          Disconnected
        </>
      )}
    </div>
  );
};

export default ConnectionStatus;