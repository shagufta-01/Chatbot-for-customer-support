export interface Message {
  id: string;
  type: 'user_message' | 'agent_message' | 'system_message';
  content: string;
  timestamp: string;
  isAgent: boolean;
}

export interface AgentTyping {
  type: 'agent_typing';
  isTyping: boolean;
}

export interface ConnectionStatus {
  type: 'connected';
  clientId: string;
  username: string;
  messages: Message[];
  agentStatus: 'online' | 'offline' | 'busy';
}

export interface UsernameUpdate {
  type: 'username_updated';
  newUsername: string;
  timestamp: string;
}

export type WebSocketMessage = Message | AgentTyping | ConnectionStatus | UsernameUpdate;