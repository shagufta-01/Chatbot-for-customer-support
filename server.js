import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { v4 as uuidv4 } from 'uuid';

const server = createServer();
const wss = new WebSocketServer({ server });

const clients = new Map();
const conversations = new Map(); // Store conversations by user ID
const messageQueue = []; // Queue for agent responses

// Simulated AI Agent responses
const agentResponses = [
  "Hello! I'm here to help you. How can I assist you today?",
  "I understand your concern. Let me help you with that.",
  "That's a great question! Here's what I can tell you...",
  "I'm processing your request. Please give me a moment.",
  "Thank you for providing that information. Based on what you've shared...",
  "Is there anything else I can help you with today?",
  "I hope that answers your question. Feel free to ask if you need more clarification.",
  "Let me look into that for you right away.",
  "I appreciate your patience. Here's the solution to your problem...",
  "That's all sorted out! Is there anything else you'd like to know?"
];

const getRandomAgentResponse = () => {
  return agentResponses[Math.floor(Math.random() * agentResponses.length)];
};

// Simulate agent response with delay
const simulateAgentResponse = (clientId, userMessage) => {
  setTimeout(() => {
    const client = clients.get(clientId);
    if (client && client.ws.readyState === client.ws.OPEN) {
      const agentMessage = {
        id: uuidv4(),
        type: 'agent_message',
        content: getRandomAgentResponse(),
        timestamp: new Date().toISOString(),
        isAgent: true
      };
      
      // Store in conversation
      if (!conversations.has(clientId)) {
        conversations.set(clientId, []);
      }
      conversations.get(clientId).push(agentMessage);
      
      // Send to user
      client.ws.send(JSON.stringify(agentMessage));
      
      // Send typing indicator off
      client.ws.send(JSON.stringify({
        type: 'agent_typing',
        isTyping: false
      }));
    }
  }, Math.random() * 2000 + 1000); // Random delay between 1-3 seconds
};

wss.on('connection', (ws) => {
  const clientId = uuidv4();
  const clientInfo = {
    id: clientId,
    ws: ws,
    username: `User${Math.floor(Math.random() * 1000)}`,
    joinedAt: new Date().toISOString()
  };
  
  clients.set(clientId, clientInfo);
  console.log(`Client ${clientId} connected`);
  
  // Initialize conversation for new user
  if (!conversations.has(clientId)) {
    conversations.set(clientId, []);
  }
  
  // Send connection confirmation and conversation history
  ws.send(JSON.stringify({
    type: 'connected',
    clientId: clientId,
    username: clientInfo.username,
    messages: conversations.get(clientId) || [],
    agentStatus: 'online'
  }));
  
  // Send welcome message from agent
  setTimeout(() => {
    const welcomeMessage = {
      id: uuidv4(),
      type: 'agent_message',
      content: `Hello ${clientInfo.username}! Welcome to our support chat. I'm your AI assistant. How can I help you today?`,
      timestamp: new Date().toISOString(),
      isAgent: true
    };
    
    conversations.get(clientId).push(welcomeMessage);
    ws.send(JSON.stringify(welcomeMessage));
  }, 500);
  
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      
      switch (message.type) {
        case 'user_message':
          const userMessage = {
            id: uuidv4(),
            type: 'user_message',
            content: message.content,
            timestamp: new Date().toISOString(),
            isAgent: false
          };
          
          // Store user message in conversation
          conversations.get(clientId).push(userMessage);
          
          // Echo back to user for immediate display
          ws.send(JSON.stringify(userMessage));
          
          // Show agent typing indicator
          ws.send(JSON.stringify({
            type: 'agent_typing',
            isTyping: true
          }));
          
          // Simulate agent response
          simulateAgentResponse(clientId, message.content);
          break;
          
        case 'username_change':
          const oldUsername = clientInfo.username;
          clientInfo.username = message.username;
          
          ws.send(JSON.stringify({
            type: 'username_updated',
            newUsername: message.username,
            timestamp: new Date().toISOString()
          }));
          break;
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });
  
  ws.on('close', () => {
    console.log(`Client ${clientId} disconnected`);
    clients.delete(clientId);
    // Keep conversation history for potential reconnection
  });
  
  ws.on('error', (error) => {
    console.error(`WebSocket error for client ${clientId}:`, error);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Agent Chat Server running on port ${PORT}`);
  console.log(`Supporting multiple users chatting with AI agent`);
});