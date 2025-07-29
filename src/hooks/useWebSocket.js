
import { useState, useEffect, useRef } from 'react';

export function useWebSocket(url) {
  const [data, setData] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const ws = useRef(null);

  useEffect(() => {
    const connectWebSocket = () => {
      try {
        ws.current = new WebSocket(url);
        
        ws.current.onopen = () => {
          setConnectionStatus('connected');
          console.log('WebSocket connected');
        };

        ws.current.onmessage = (event) => {
          try {
            const parsedData = JSON.parse(event.data);
            setData(parsedData);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        ws.current.onclose = () => {
          setConnectionStatus('disconnected');
          console.log('WebSocket disconnected');
          // Attempt to reconnect after 5 seconds
          setTimeout(connectWebSocket, 5000);
        };

        ws.current.onerror = (error) => {
          console.error('WebSocket error:', error);
          setConnectionStatus('error');
        };
      } catch (error) {
        console.error('Error creating WebSocket:', error);
        setConnectionStatus('error');
        // Attempt to reconnect after 5 seconds
        setTimeout(connectWebSocket, 5000);
      }
    };

    connectWebSocket();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [url]);

  const sendMessage = (message) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  };

  return { data, connectionStatus, sendMessage };
}
