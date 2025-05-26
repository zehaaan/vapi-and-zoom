import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [meetingUrl, setMeetingUrl] = useState('');

  // Function to simulate Left Shift + F keyboard shortcut
  const simulateShiftF = () => {
    // Create and dispatch keydown events
    const shiftKeyEvent = new KeyboardEvent('keydown', {
      key: 'Shift',
      code: 'ShiftLeft',
      keyCode: 16,
      which: 16,
      shiftKey: true,
      bubbles: true
    });

    const fKeyEvent = new KeyboardEvent('keydown', {
      key: 'f',
      code: 'KeyF',
      keyCode: 70,
      which: 70,
      shiftKey: true,
      bubbles: true
    });

    document.dispatchEvent(shiftKeyEvent);
    document.dispatchEvent(fKeyEvent);
  };

  useEffect(() => {
    // Get initial meeting URL
    fetch('http://localhost:3005/current-meeting-url')
      .then(res => res.json())
      .then(data => {
        setMeetingUrl(data.url);
        // Trigger Shift+F when initial URL is received
        simulateShiftF();
      })
      .catch(err => console.error('Error fetching meeting URL:', err));

    // Set up WebSocket connection
    const ws = new WebSocket('ws://localhost:3005');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'MEETING_URL_UPDATE') {
        setMeetingUrl(data.url);
        // Trigger Shift+F when new URL is received
        simulateShiftF();
      }
    };

    return () => ws.close();
  }, []);

  const joinZoomMeeting = async () => {
    try {
      console.log('Starting Zoom meeting process...');
      
      // Open Zoom meeting in the default Zoom client
      console.log('Opening Zoom meeting URL...');
      window.location.href = meetingUrl;
      
      // Prepare webhook data
      const webhookData = {
        event: 'zoom_started',
        timestamp: new Date().toISOString()
      };
      console.log('Sending webhook data:', webhookData);
      
      // Send webhook notification to ngrok URL
      const webhookUrl = 'https://25bf-2607-fea8-5b9e-be00-c9a7-8c9e-28a0-888a.ngrok-free.app/webhook/462974b3-a9e0-4db4-8df7-20ea78da51a6';
      console.log('Sending webhook to:', webhookUrl);
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData)
      });

      console.log('Webhook response status:', response.status);
      console.log('Webhook response headers:', Object.fromEntries(response.headers.entries()));
      
      const responseData = await response.json();
      console.log('Webhook response data:', responseData);
      
      if (!response.ok) {
        throw new Error(`Webhook failed with status ${response.status}: ${JSON.stringify(responseData)}`);
      }
      
      console.log('Webhook sent successfully!');
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      alert('Failed to send webhook. Check console for details.');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Join Zoom Meeting</h1>
        <div className="controls">
          <button onClick={joinZoomMeeting}>
            Join Meeting
          </button>
        </div>
        <div className="meeting-url">
          Current Meeting URL: {meetingUrl}
        </div>
      </header>
    </div>
  );
}

export default App; 