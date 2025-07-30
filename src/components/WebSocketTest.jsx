
import React, { useState } from 'react';

const WebSocketTest = ({ apiUrl }) => {
  const [testResults, setTestResults] = useState([]);
  const [isConnecting, setIsConnecting] = useState(false);

  const testWebSocket = () => {
    setIsConnecting(true);
    setTestResults([]);
    
    const wsUrl = apiUrl 
      ? `${apiUrl.replace('https://', 'wss://').replace('http://', 'ws://')}/ws/signals`
      : 'wss://953370c5-8baa-49e6-a964-e76807498376-00-26qsx7u0809rl.pike.replit.dev/ws/signals';
    
    const testWs = new WebSocket(wsUrl);
    
    const addResult = (message, type = 'info') => {
      setTestResults(prev => [...prev, { message, type, timestamp: new Date().toLocaleTimeString() }]);
    };
    
    addResult(`🔌 Attempting to connect to: ${wsUrl}`, 'info');
    
    testWs.onopen = () => {
      addResult('✅ WebSocket Connected!', 'success');
      setIsConnecting(false);
      
      // Send test subscription
      testWs.send(JSON.stringify({
        action: 'subscribe',
        symbols: ['BTCUSD', 'ETHUSD']
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
    };
    
    testWs.onclose = (event) => {
      addResult(`🔌 Connection closed. Code: ${event.code}, Reason: ${event.reason}`, 'warning');
      setIsConnecting(false);
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
