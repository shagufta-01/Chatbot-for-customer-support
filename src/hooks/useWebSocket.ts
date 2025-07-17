import { useState, useEffect, useCallback, useRef } from 'react';
import { Message, WebSocketMessage } from '../types';

const getWebSocketUrl = () => {
  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    return `${protocol}//${host}/api/chat`;
  }
  return 'ws://localhost:3001';
};

export const useWebSocket = (url: string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUser, setCurrentUser] = useState<{ id: string; username: string } | null>(null);
  const [agentTyping, setAgentTyping] = useState(false);
  const [agentStatus, setAgentStatus] = useState<'online' | 'offline' | 'busy'>('offline');
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const wsUrl = getWebSocketUrl();

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        setIsConnected(true);
        setSocket(ws);
        console.log('Connected to WebSocket server');
      };
      
      ws.onmessage = (event) => {
        const data: WebSocketMessage = JSON.parse(event.data);
        
        if (data.type === 'connected') {
          setCurrentUser({ id: data.clientId, username: data.username });
          setMessages(data.messages);
          setAgentStatus(data.agentStatus);
        } else if (data.type === 'agent_typing') {
          setAgentTyping(data.isTyping);
        } else if (data.type === 'username_updated') {
          setCurrentUser(prev => prev ? { ...prev, username: data.newUsername } : null);
        } else {
          setMessages(prev => [...prev, data as Message]);
        }
      };
      
      ws.onclose = () => {
        setIsConnected(false);
        setSocket(null);
        setAgentTyping(false);
        setAgentStatus('offline');
        console.log('Disconnected from WebSocket server');
        
        // Attempt to reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 3000);
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
      
    } catch (error) {
      console.error('Failed to connect to WebSocket server:', error);
    }
  }, [wsUrl]);

  const sendMessage = useCallback((content: string) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify({
        type: 'user_message',
        content: content
      }));
    }
  }, [socket, isConnected]);

  const changeUsername = useCallback((username: string) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify({
        type: 'username_change',
        username: username
      }));
      setCurrentUser(prev => prev ? { ...prev, username } : null);
    }
  }, [socket, isConnected]);

  useEffect(() => {
    connect();
    
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      if (socket) {
        socket.close();
      }
    };
  }, [connect]);

  return {
    isConnected,
    messages,
    currentUser,
    agentTyping,
    agentStatus,
    sendMessage,
    changeUsername
  };
};