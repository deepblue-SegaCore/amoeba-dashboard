
import { useEffect, useState, useRef, useCallback } from 'react';

export const useWebSocket = (url) => {
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const ws = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectInterval = 5000; // 5 seconds
  
  const sendMessage = useCallback((message) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
      console.log('📤 Message sent:', message);
    } else {
      console.log('❌ WebSocket not connected, cannot send message');
    }
  }, []);

  const connectWebSocket = useCallback(() => {
    if (!url) {
      setConnected(false);
      return;
    }

    console.log('🔌 Connecting to WebSocket...', url);
    
    try {
      // Close existing connection if any
      if (ws.current) {
        ws.current.close();
      }

      // Create new WebSocket connection
      ws.current = new WebSocket(url);
      
      ws.current.onopen = () => {
        console.log('✅ WebSocket connected!');
        setConnected(true);
        
        // Clear any pending reconnect attempts
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
        
        // Send initial subscription message
        ws.current.send(JSON.stringify({ 
          action: 'subscribe', 
          symbols: ['BTCUSD', 'ETHUSD', 'SOLUSD', 'BNBUSD'] 
        }));
      };
      
      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📨 Received:', data);
          setMessages(prev => [...prev, data]);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      };
      
      ws.current.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
      };
      
      ws.current.onclose = (event) => {
        console.log('🔌 WebSocket disconnected. Code:', event.code, 'Reason:', event.reason);
        setConnected(false);
        
        // Only attempt to reconnect if the closure wasn't intentional
        if (event.code !== 1000) {
          console.log('🔄 Reconnecting in', reconnectInterval / 1000, 'seconds...');
          reconnectTimeoutRef.current = setTimeout(() => {
            connectWebSocket();
          }, reconnectInterval);
        }
      };
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      setConnected(false);
      
      // Attempt to reconnect on connection failure
      reconnectTimeoutRef.current = setTimeout(() => {
        connectWebSocket();
      }, reconnectInterval);
    }
  }, [url]);
  
  useEffect(() => {
    connectWebSocket();
    
    // Cleanup function
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (ws.current) {
        // Set close code to 1000 (normal closure) to prevent reconnection
        ws.current.close(1000, 'Component unmounting');
      }
    };
  }, [connectWebSocket]);
  
  // Manual reconnect function
  const reconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    connectWebSocket();
  }, [connectWebSocket]);
  
  return { messages, sendMessage, connected, reconnect };
};
