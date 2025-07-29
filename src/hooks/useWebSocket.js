
import { useState, useEffect, useRef } from 'react';

export function useWebSocket(url) {
  const [data, setData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [connected, setConnected] = useState(false);
  const ws = useRef(null);

  useEffect(() => {
    const connectWebSocket = () => {
      try {
        ws.current = new WebSocket(url);
        
        ws.current.onopen = () => {
          setConnectionStatus('connected');
          setConnected(true);
          console.log('WebSocket connected');
        };

        ws.current.onmessage = (event) => {
          try {
            const parsedData = JSON.parse(event.data);
            setData(parsedData);
            setMessages(prev => [...prev, parsedData]);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        ws.current.onclose = () => {
          setConnectionStatus('disconnected');
          setConnected(false);
          console.log('WebSocket disconnected');
          // Attempt to reconnect after 5 seconds
          setTimeout(connectWebSocket, 5000);
        };

        ws.current.onerror = (error) => {
          console.error('WebSocket error:', error);
          setConnectionStatus('error');
          setConnected(false);
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

  return { data, messages, connectionStatus, connected, sendMessage };
}
