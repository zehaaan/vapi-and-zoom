const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Store connected clients
const clients = new Set();

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('Client connected');
  clients.add(ws);

  // Send initial connection confirmation
  ws.send(JSON.stringify({
    type: 'CONNECTION_ESTABLISHED',
    message: 'Connected to WebSocket server'
  }));

  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(ws);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// API endpoint to trigger call
app.post('/api/trigger-call', (req, res) => {
  console.log('Received trigger call request:', req.body);
  
  if (clients.size === 0) {
    console.log('No clients connected');
    return res.status(503).json({ 
      success: false, 
      error: 'No clients connected to receive the trigger' 
    });
  }

  try {
    let messageSent = false;
    // Broadcast to all connected clients
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        const message = {
          type: 'TRIGGER_CALL',
          data: req.body,
          timestamp: new Date().toISOString()
        };
        client.send(JSON.stringify(message));
        messageSent = true;
        console.log('Trigger message sent to client:', message);
      }
    });

    if (messageSent) {
      res.json({ 
        success: true, 
        message: 'Call trigger broadcasted',
        connectedClients: clients.size
      });
    } else {
      res.status(503).json({ 
        success: false, 
        error: 'No active WebSocket connections available' 
      });
    }
  } catch (error) {
    console.error('Error triggering call:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to trigger call',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    connectedClients: clients.size,
    uptime: process.uptime()
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server is ready for connections`);
});
