
import { useEffect, useState, useRef, useCallback } from 'react';

// Determine the WebSocket URL based on environment
function getWebSocketUrl() {
  // For local development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'ws://localhost:5000/ws/signals';
  }
  
  // For Replit deployment - use the current window location
  // This will automatically use the same domain as your frontend
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.host; // includes port if present
  
  // If we're on Replit, use the same host but different port for WebSocket
  if (host.includes('replit.dev')) {
    // Use the same hostname but assume backend is on port 5000
    const hostname = window.location.hostname;
    return `${protocol}//${hostname}:5000/ws/signals`;
  }
  
  // Default fallback - use same host with port 5000
  return `${protocol}//${window.location.hostname}:5000/ws/signals`;
}

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
    // Use the provided URL or fall back to dynamic detection
    const wsUrl = url || getWebSocketUrl();
    
    console.log('🔌 Connecting to WebSocket...');
    console.log('WebSocket URL:', wsUrl);
    
    try {
      // Close existing connection if any
      if (ws.current) {
        ws.current.close();
      }

      // Create new WebSocket connection
      ws.current = new WebSocket(wsUrl);
      
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
