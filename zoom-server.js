const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Store the current meeting URL
let currentMeetingUrl = 'https://us05web.zoom.us/j/84607020620?pwd=65jTi6VNkk6ar0oaKmZ0cGscWNbIYw.1';

// Function to simulate Left Shift + F keyboard shortcut
const simulateShiftF = () => {
  console.log('\n=== Attempting to trigger Left Shift + F shortcut ===');
  console.log('Current platform:', process.platform);
  
  // For Windows
  if (process.platform === 'win32') {
    console.log('Executing PowerShell command for Left Shift + F...');
    // Using the working SendKeys method
    const command = 'powershell -command "$wshell = New-Object -ComObject wscript.shell; $wshell.SendKeys(\'+f\')"';
    console.log('Command:', command);
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('Error simulating keyboard shortcut:', error);
        console.error('Error details:', {
          message: error.message,
          code: error.code,
          signal: error.signal
        });
      } else {
        console.log('Successfully triggered Left Shift + F shortcut');
        if (stdout) console.log('Command output:', stdout);
        if (stderr) console.log('Command stderr:', stderr);
      }
    });
  } else {
    console.log('Platform not supported for keyboard simulation');
  }
  console.log('=== End of shortcut trigger attempt ===\n');
};

// Function to simulate Left Shift + D keyboard shortcut
const simulateShiftD = () => {
  console.log('\n=== Attempting to trigger Left Shift + D shortcut ===');
  console.log('Current platform:', process.platform);
  
  // For Windows
  if (process.platform === 'win32') {
    console.log('Executing PowerShell command for Left Shift + D...');
    const command = 'powershell -command "$wshell = New-Object -ComObject wscript.shell; $wshell.SendKeys(\'+d\')"';
    console.log('Command:', command);
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('Error simulating Shift + D:', error);
        console.error('Error details:', {
          message: error.message,
          code: error.code,
          signal: error.signal
        });
      } else {
        console.log('Successfully triggered Shift + D shortcut');
        if (stdout) console.log('Command output:', stdout);
        if (stderr) console.log('Command stderr:', stderr);
      }
    });
  } else {
    console.log('Platform not supported for keyboard simulation');
  }
  console.log('=== End of Shift + D trigger attempt ===\n');
};

// Function to simulate Left Shift + Q keyboard shortcut
const simulateShiftQ = () => {
  console.log('\n=== Attempting to trigger Left Shift + Q shortcut ===');
  console.log('Current platform:', process.platform);
  
  // For Windows
  if (process.platform === 'win32') {
    console.log('Executing PowerShell command for Left Shift + Q...');
    const command = 'powershell -command "$wshell = New-Object -ComObject wscript.shell; $wshell.SendKeys(\'+q\')"';
    console.log('Command:', command);
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('Error simulating Shift + Q:', error);
        console.error('Error details:', {
          message: error.message,
          code: error.code,
          signal: error.signal
        });
      } else {
        console.log('Successfully triggered Shift + Q shortcut');
        if (stdout) console.log('Command output:', stdout);
        if (stderr) console.log('Command stderr:', stderr);
      }
    });
  } else {
    console.log('Platform not supported for keyboard simulation');
  }
  console.log('=== End of Shift + Q trigger attempt ===\n');
};

// Function to simulate Control + W keyboard shortcut
const simulateControlW = () => {
  console.log('\n=== Attempting to trigger Control + W shortcut ===');
  console.log('Current platform:', process.platform);
  
  // For Windows
  if (process.platform === 'win32') {
    console.log('Executing PowerShell command for Control + W...');
    const command = 'powershell -command "$wshell = New-Object -ComObject wscript.shell; $wshell.SendKeys(\'^w\')"';
    console.log('Command:', command);
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('Error simulating Control + W:', error);
        console.error('Error details:', {
          message: error.message,
          code: error.code,
          signal: error.signal
        });
      } else {
        console.log('Successfully triggered Control + W shortcut');
        if (stdout) console.log('Command output:', stdout);
        if (stderr) console.log('Command stderr:', stderr);
      }
    });
  } else {
    console.log('Platform not supported for keyboard simulation');
  }
  console.log('=== End of Control + W trigger attempt ===\n');
};

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('New WebSocket connection established');

  // Send current meeting URL to new connections
  ws.send(JSON.stringify({
    type: 'MEETING_URL_UPDATE',
    url: currentMeetingUrl
  }));

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Received WebSocket message:', data);
      
      // Broadcast the message to all connected clients
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      });
    } catch (error) {
      console.error('Error handling WebSocket message:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Endpoint to update meeting URL
app.post('/update-meeting-url', express.json(), (req, res) => {
  console.log('\n=== Received URL Update Request ===');
  console.log('Request body:', req.body);
  
  const { url } = req.body;
  if (!url) {
    console.log('Error: No URL provided in request');
    return res.status(400).json({ error: 'URL is required' });
  }

  console.log('Previous URL:', currentMeetingUrl);
  currentMeetingUrl = url;
  console.log('New URL set:', currentMeetingUrl);

  // Trigger the Shift+F shortcut when URL is updated
  console.log('Triggering keyboard shortcut...');
  simulateShiftF();

  // Broadcast the new URL to all connected clients
  console.log('Broadcasting new URL to WebSocket clients...');
  let broadcastCount = 0;
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: 'MEETING_URL_UPDATE',
        url: currentMeetingUrl
      }));
      broadcastCount++;
    }
  });
  console.log(`Broadcast complete. Sent to ${broadcastCount} clients`);

  console.log('=== URL Update Request Complete ===\n');
  res.json({ success: true, url: currentMeetingUrl });
});

// New endpoint to trigger Shift + D
app.post('/trigger-shift-d', express.json(), (req, res) => {
  console.log('\n=== /trigger-shift-d endpoint hit ===');
  console.log('Request body:', req.body);
  
  // Trigger the Shift+D shortcut
  console.log('Triggering Shift + D shortcut...');
  simulateShiftD();
  
  res.json({ 
    success: true, 
    message: 'Shift + D triggered',
    timestamp: new Date().toISOString()
  });
});

// New endpoint to trigger Shift + Q
app.post('/trigger-shift-q', express.json(), (req, res) => {
  console.log('\n=== /trigger-shift-q endpoint hit ===');
  console.log('Request body:', req.body);
  
  // Trigger the Shift+Q shortcut
  console.log('Triggering Shift + Q shortcut...');
  simulateShiftQ();
  
  res.json({ 
    success: true, 
    message: 'Shift + Q triggered',
    timestamp: new Date().toISOString()
  });
});

// New endpoint to trigger Control + W
app.post('/trigger-control-w', express.json(), (req, res) => {
  console.log('\n=== /trigger-control-w endpoint hit ===');
  console.log('Request body:', req.body);
  
  // Trigger the Control+W shortcut
  console.log('Triggering Control + W shortcut...');
  simulateControlW();
  
  res.json({ 
    success: true, 
    message: 'Control + W triggered',
    timestamp: new Date().toISOString()
  });
});

// Endpoint to get current meeting URL
app.get('/current-meeting-url', (req, res) => {
  console.log('Current meeting URL requested:', currentMeetingUrl);
  res.json({ url: currentMeetingUrl });
});

// HTTP endpoint for Zoom meeting started notification
app.post('/zoom-started', express.json(), (req, res) => {
  console.log('Zoom meeting started:', req.body);
  
  // Broadcast to all WebSocket clients
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: 'ZOOM_STARTED',
        timestamp: req.body.timestamp
      }));
    }
  });

  res.json({ status: 'success' });
});

const PORT = 3005;
server.listen(PORT, () => {
  console.log(`\n=== Server Starting ===`);
  console.log(`Zoom server running on port ${PORT}`);
  console.log('WebSocket server is ready for connections');
  console.log('Current meeting URL:', currentMeetingUrl);
  console.log('=== Server Started ===\n');
}); 