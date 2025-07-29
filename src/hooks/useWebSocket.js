
import { useEffect, useState, useRef, useCallback } from 'react';

export const useWebSocket = (url) => {
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const ws = useRef(null);
  
  const sendMessage = useCallback((message) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  }, []);
  
  useEffect(() => {
    // Create WebSocket connection
    try {
      ws.current = new WebSocket(url);
      
      ws.current.onopen = () => {
        console.log('WebSocket connected');
        setConnected(true);
      };
      
      ws.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          setMessages(prev => [...prev, message]);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      };
      
      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
      
      ws.current.onclose = () => {
        console.log('WebSocket disconnected');
        setConnected(false);
        
        // Attempt to reconnect after 5 seconds
        setTimeout(() => {
          if (ws.current.readyState === WebSocket.CLOSED) {
            console.log('Attempting to reconnect...');
            ws.current = new WebSocket(url);
          }
        }, 5000);
      };
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      setConnected(false);
    }
    
    // Cleanup
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [url]);
  
  return { messages, sendMessage, connected };
};
