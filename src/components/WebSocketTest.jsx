
import React, { useState } from 'react';

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

const WebSocketTest = ({ apiUrl }) => {
  const [testResults, setTestResults] = useState([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [testConnectionStatus, setTestConnectionStatus] = useState('Disconnected');

  const testWebSocket = () => {
    setIsConnecting(true);
    setTestResults([]);
    
    const wsUrl = apiUrl 
      ? `${apiUrl.replace('https://', 'wss://').replace('http://', 'ws://')}/ws/signals`
      : getWebSocketUrl();
    
    console.log('🧪 Testing WebSocket connection to:', wsUrl);
    const testWs = new WebSocket(wsUrl);
    
    const addResult = (message, type = 'info') => {
      setTestResults(prev => [...prev, { message, type, timestamp: new Date().toLocaleTimeString() }]);
    };
    
    addResult(`🔌 Attempting to connect to: ${wsUrl}`, 'info');
    
    testWs.onopen = () => {
      addResult('✅ WebSocket Connected!', 'success');
      setIsConnecting(false);
      setTestConnectionStatus('Connected');
      
      // Send test subscription (matching new format)
      testWs.send(JSON.stringify({
        action: 'subscribe',
        symbols: ['BTCUSD', 'ETHUSD', 'SOLUSD', 'BNBUSD']
      }));
      addResult('📤 Sent subscription message', 'info');
      
      // Send a test signal after 2 seconds
      setTimeout(() => {
        if (testWs.readyState === WebSocket.OPEN) {
          const testSignal = {
            type: 'test_signal',
            symbol: 'BTCUSD',
            environmental_pressure: 2.5,
            threshold: 1.8,
            volume: 1500000,
            price: 45000,
            timestamp: new Date().toISOString()
          };
          testWs.send(JSON.stringify(testSignal));
          addResult('📤 Sent test signal', 'info');
        }
      }, 2000);
    };

    testWs.onmessage = (event) => {
      addResult(`📨 Message received: ${event.data}`, 'success');
    };

    testWs.onerror = (error) => {
      addResult(`❌ WebSocket error: ${error.toString()}`, 'error');
      setIsConnecting(false);
      setTestConnectionStatus('Error');
    };
    
    testWs.onclose = (event) => {
      addResult(`🔌 Connection closed. Code: ${event.code}, Reason: ${event.reason}`, 'warning');
      setIsConnecting(false);
      setTestConnectionStatus('Disconnected');
    };
    
    // Auto-close after 10 seconds for testing
    setTimeout(() => {
      if (testWs.readyState === WebSocket.OPEN) {
        testWs.close();
        addResult('🕒 Test completed (10s timeout)', 'info');
      }
    }, 10000);
  };

  return (
    <div className="card">
      <div className="card-header">
        🧪 WebSocket Connection Test
      </div>
      
      <div className="connection-status" style={{
        marginBottom: '1rem',
        padding: '0.5rem',
        backgroundColor: '#111827',
        borderRadius: '0.25rem',
        fontSize: '0.875rem',
        textAlign: 'center'
      }}>
        Test WebSocket: <span id="test-connection-status" style={{
          color: testConnectionStatus === 'Connected' ? '#10b981' : 
                testConnectionStatus === 'Error' ? '#ef4444' : '#6b7280',
          fontWeight: 'bold'
        }}>
          {testConnectionStatus}
        </span>
      </div>
      
      <button 
        onClick={testWebSocket}
        disabled={isConnecting}
        style={{
          backgroundColor: isConnecting ? '#6b7280' : '#3b82f6',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '0.25rem',
          cursor: isConnecting ? 'not-allowed' : 'pointer',
          marginBottom: '1rem'
        }}
      >
        {isConnecting ? '🔄 Testing...' : '🧪 Test WebSocket Connection'}
      </button>
      
      {testResults.length > 0 && (
        <div style={{
          backgroundColor: '#111827',
          padding: '1rem',
          borderRadius: '0.375rem',
          maxHeight: '400px',
          overflowY: 'auto',
          fontSize: '0.875rem',
          fontFamily: 'monospace'
        }}>
          {testResults.map((result, index) => (
            <div 
              key={index}
              style={{
                color: result.type === 'success' ? '#10b981' :
                       result.type === 'error' ? '#ef4444' :
                       result.type === 'warning' ? '#f59e0b' :
                       '#9ca3af',
                marginBottom: '0.25rem'
              }}
            >
              <span style={{ color: '#6b7280' }}>[{result.timestamp}]</span> {result.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WebSocketTest;
