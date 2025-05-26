# Vapi and Zoom Integration Demo

This project demonstrates the integration between Vapi AI and Zoom, showcasing how to build voice agents that can interact with users through video calls.

## Features

- Real-time voice agent integration with Vapi AI
- WebSocket communication for call control
- Video call management with Zoom
- Volume level monitoring
- Mute/unmute functionality

## Prerequisites

- Node.js (v14 or higher)
- Vapi AI API key
 - n8n.io and automate from microsoft
 - zooom desktop 

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd vapi-and-zoom
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your API keys:
```
VAPI_API_KEY=your_vapi_key_here

```

## Usage

1. Start the development server:
```bash
npm start
```

2. Open your browser and navigate to `http://localhost:3000`

3. Use the interface to:
   - Start/end calls
   - Mute/unmute audio
   - Monitor volume levels
   - Control video playback

## Project Structure

- `src/App.js` - Main application component
- `src/App.css` - Application styles
- `server.js` - WebSocket server for call control
- `zoom-server.js` - Zoom integration server

## License

MIT 
