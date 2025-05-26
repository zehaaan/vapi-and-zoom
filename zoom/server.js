const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Proxy endpoint for the webhook
app.post('/proxy-webhook', async (req, res) => {
  try {
    console.log('Proxying webhook request...');
    const response = await axios.post('http://localhost:5678/webhook/38640538-2d44-486f-910f-8405e8cde7fc', req.body);
    console.log('Webhook sent successfully:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error sending webhook:', error.message);
    res.status(500).json({ error: 'Failed to send webhook' });
  }
});

const PORT = 3005;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
}); 