const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
const server = http.createServer(app);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/videos', express.static(uploadsDir));

// Video control endpoint
app.post('/api/video-control', express.json(), (req, res) => {
  console.log('\n=== Video Control Request ===');
  console.log('Request body:', req.body);
  
  const { action, timestamp } = req.body;
  console.log('Action:', action);
  console.log('Timestamp:', timestamp, 'Type:', typeof timestamp);
  
  if (action === 'seek') {
    // Convert timestamp to number if it's a string
    const seekTime = typeof timestamp === 'string' ? parseFloat(timestamp) : timestamp;
    console.log('Converted seek time:', seekTime);
    
    if (isNaN(seekTime)) {
      console.error('Invalid timestamp:', timestamp);
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid timestamp',
        received: timestamp
      });
    }
    
    // Open the player page with seek parameter
    const url = `http://localhost:3006/player.html?seek=${seekTime}`;
    console.log('Opening player page:', url);
    
    const command = process.platform === 'win32' 
      ? `start "" "${url}"`
      : process.platform === 'darwin'
        ? `open "${url}"`
        : `xdg-open "${url}"`;
        
    console.log('Executing command:', command);
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('Error opening browser:', error);
        console.error('stderr:', stderr);
        return res.status(500).json({ success: false, error: error.message });
      }
      
      console.log('Browser opened successfully');
      res.json({ success: true, seekTime });
    });
  } else if (action === 'play') {
    const url = 'http://localhost:3006/player.html';
    console.log('Opening player page:', url);
    
    const command = process.platform === 'win32' 
      ? `start "" "${url}"`
      : process.platform === 'darwin'
        ? `open "${url}"`
        : `xdg-open "${url}"`;
        
    console.log('Executing command:', command);
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('Error opening browser:', error);
        console.error('stderr:', stderr);
        return res.status(500).json({ success: false, error: error.message });
      }
      console.log('Browser opened successfully');
      console.log('stdout:', stdout);
      res.json({ success: true });
    });
  } else {
    res.status(400).json({ 
      success: false, 
      error: 'Invalid action or missing timestamp',
      examples: {
        play: {
          body: { action: 'play' }
        },
        seek: {
          body: { action: 'seek', timestamp: 30 }
        }
      }
    });
  }
});

const PORT = 3006;
server.listen(PORT, () => {
  console.log('=== Server Starting ===');
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Current directory:', __dirname);
  console.log('Uploads directory:', uploadsDir);
  console.log('Public directory:', path.join(__dirname, 'public'));
  
  // List contents of important directories
  console.log('\n=== Directory Contents ===');
  console.log('Public directory contents:');
  fs.readdirSync(path.join(__dirname, 'public')).forEach(file => {
    console.log('-', file);
  });
  
  console.log('\nUploads directory contents:');
  fs.readdirSync(uploadsDir).forEach(file => {
    console.log('-', file);
  });
  console.log('=== Server Started ===');
}); 