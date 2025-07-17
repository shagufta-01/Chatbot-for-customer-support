import { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';

// Store for clients and conversations (in production, use a database)
const clients = new Map();
const conversations = new Map();

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

export default function handler(req, res) {
  if (req.method === 'GET') {
    // WebSocket upgrade handling for Vercel
    if (req.headers.upgrade === 'websocket') {
      const wss = new WebSocketServer({ noServer: true });
      
      wss.handleUpgrade(req, req.socket, Buffer.alloc(0), (ws) => {
        const clientId = uuidv4();
        const clientInfo = {
          id: clientId,
          ws: ws,
          username: `User${Math.floor(Math.random() * 1000)}`,
          joinedAt: new Date().toISOString()
        };
        
        clients.set(clientId, clientInfo);
        
        if (!conversations.has(clientId)) {
          conversations.set(clientId, []);
        }
        
        ws.send(JSON.stringify({
          type: 'connected',
          clientId: clientId,
          username: clientInfo.username,
          messages: conversations.get(clientId) || [],
          agentStatus: 'online'
        }));
        
        // Send welcome message
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
                
                conversations.get(clientId).push(userMessage);
                ws.send(JSON.stringify(userMessage));
                
                ws.send(JSON.stringify({
                  type: 'agent_typing',
                  isTyping: true
                }));
                
                // Simulate agent response
                setTimeout(() => {
                  if (ws.readyState === ws.OPEN) {
                    const agentMessage = {
                      id: uuidv4(),
                      type: 'agent_message',
                      content: getRandomAgentResponse(),
                      timestamp: new Date().toISOString(),
                      isAgent: true
                    };
                    
                    conversations.get(clientId).push(agentMessage);
                    ws.send(JSON.stringify(agentMessage));
                    
                    ws.send(JSON.stringify({
                      type: 'agent_typing',
                      isTyping: false
                    }));
                  }
                }, Math.random() * 2000 + 1000);
                break;
                
              case 'username_change':
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
          clients.delete(clientId);
        });
      });
    } else {
      res.status(200).json({ message: 'WebSocket endpoint ready' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}