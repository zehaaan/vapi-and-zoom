import React, { useState, useEffect, useRef } from 'react';
import './ZoomApp.css';

function ZoomApp() {
  const [wsConnected, setWsConnected] = useState(false);
  const [zoomStatus, setZoomStatus] = useState('disconnected');
  const wsRef = useRef(null);

  useEffect(() => {
    // Load Zoom SDK
    const script = document.createElement('script');
    script.src = 'https://source.zoom.us/2.9.5/lib/vendor/react.min.js';
    script.async = true;
    document.body.appendChild(script);

    const connectWebSocket = () => {
      const ws = new WebSocket('ws://localhost:3005');
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('Zoom WebSocket Connected');
        setWsConnected(true);
      };

      ws.onclose = () => {
        console.log('Zoom WebSocket Disconnected');
        setWsConnected(false);
        // Attempt to reconnect after 5 seconds
        setTimeout(connectWebSocket, 5000);
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('Received message:', message);
          
          if (message.type === 'ZOOM_STARTED') {
            setZoomStatus('meeting_started');
          }
        } catch (error) {
          console.error('Error handling WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      document.body.removeChild(script);
    };
  }, []);

  const joinZoomMeeting = () => {
    // Open Zoom meeting in the default Zoom client with screen sharing parameters
    const zoomUrl = 'zoommtg://us05web.zoom.us/join?confno=82803334853&pwd=EncGvo3IG1XdpHmRTFdjPPRmsvY2IK.1&uname=User&screen=1';
    
    // Try to open with the Zoom protocol first
    window.location.href = zoomUrl;
    
    // Fallback to web URL if protocol handler fails
    setTimeout(() => {
      window.location.href = 'https://us05web.zoom.us/j/82803334853?pwd=EncGvo3IG1XdpHmRTFdjPPRmsvY2IK.1';
    }, 1000);
    
    // Notify the server that Zoom meeting has started
    fetch('http://localhost:3005/zoom-started', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        timestamp: new Date().toISOString()
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Zoom started notification sent:', data);
      setZoomStatus('joining');
    })
    .catch(error => {
      console.error('Error sending zoom started notification:', error);
    });
  };

  return (
    <div className="ZoomApp">
      <header className="ZoomApp-header">
        <h1>Zoom Meeting Integration</h1>
        <div className="status">
          WebSocket Status: {wsConnected ? 'Connected' : 'Disconnected'}
        </div>
        <div className="zoom-status">
          Zoom Status: {zoomStatus}
        </div>
        <div className="controls">
          <button 
            onClick={joinZoomMeeting}
            disabled={!wsConnected || zoomStatus === 'joining'}
          >
            Join Meeting
          </button>
        </div>
      </header>
    </div>
  );
}

export default ZoomApp; 