import React, { useEffect, useState, useRef } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import EnvironmentalStatus from './EnvironmentalStatus';
import SignalHistory from './SignalHistory';
import LearningMetrics from './LearningMetrics';
import PositionManager from './PositionManager';
import RiskMetrics from './RiskMetrics';
import WebSocketTest from './WebSocketTest';

const Dashboard = ({ symbols = [], apiUrl = '' }) => {
  // Always call hooks in the same order
  const [signals, setSignals] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [environmentalData, setEnvironmentalData] = useState(null);
  const [positions, setPositions] = useState([]);
  const [riskMetrics, setRiskMetrics] = useState(null);
  const intervalRef = useRef(null);

  // Construct WebSocket URL properly
  const wsUrl = apiUrl 
    ? `${apiUrl.replace('https://', 'wss://').replace('http://', 'ws://')}/ws/signals` 
    : 'wss://953370c5-8baa-49e6-a964-e76807498376-00-26qsx7u0809rl.pike.replit.dev/ws/signals';
  const { messages, sendMessage, connected, reconnect } = useWebSocket(wsUrl);

  // Initialize with empty state - data will come from WebSocket
  useEffect(() => {
    // Component will populate data from real WebSocket messages
    // No test data initialization needed
  }, []);

  useEffect(() => {
    if (connected) {
      // Subscribe to symbols when connected (using enhanced symbol list)
      sendMessage({
        action: 'subscribe',
        symbols: ['BTCUSD', 'ETHUSD', 'SOLUSD', 'BNBUSD']
      });
    }
  }, [symbols, connected, sendMessage]);

  useEffect(() => {
    // Process incoming WebSocket messages
    if (messages.length > 0) {
      const latestMessage = messages[messages.length - 1];

      if (latestMessage.type === 'signal') {
        setSignals(prev => {
          const newSignals = [latestMessage.data, ...prev];
          // Keep only last 100 signals
          return newSignals.slice(0, 100);
        });
      } else if (latestMessage.type === 'pattern_update') {
        setPatterns(prev => {
          const updated = [...prev];
          const index = updated.findIndex(p => p.id === latestMessage.data.id);

          if (index >= 0) {
            updated[index] = latestMessage.data;
          } else {
            updated.unshift(latestMessage.data);
          }

          // Keep only last 50 patterns
          return updated.slice(0, 50);
        });
      }
    }
  }, [messages]);

  return (
    <div className="dashboard-container">
      <h1 style={{ 
        fontSize: '2rem', 
        fontWeight: 'bold', 
        marginBottom: '1.5rem',
        color: '#fbbf24',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        🦠 Amoeba Trading System - Environmental Intelligence Dashboard
      </h1>

      {/* Connection Status Display */}
      <div className="connection-status" style={{
        marginBottom: '1rem',
        padding: '0.5rem 1rem',
        backgroundColor: '#1f2937',
        borderRadius: '0.375rem',
        border: '1px solid #374151',
        fontSize: '0.875rem'
      }}>
        WebSocket: <span id="connection-status" style={{
          color: connected ? '#10b981' : '#ef4444',
          fontWeight: 'bold'
        }}>
          {connected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      {/* WebSocket Test Component */}
      <div style={{ marginBottom: '1rem' }}>
        <WebSocketTest apiUrl={apiUrl} />
      </div>

      {/* Environmental Status - Full Width */}
      <div style={{ marginBottom: '1rem' }}>
        <EnvironmentalStatus signals={signals} symbols={symbols} />
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
        {/* Signal History - Takes 2/3 width on large screens */}
        <div style={{ gridColumn: 'span 2' }}>
          <SignalHistory signals={signals} />
        </div>

        {/* Learning Metrics */}
        <div>
          <LearningMetrics patterns={patterns} />
        </div>

        {/* Position Manager */}
        <div>
          <PositionManager signals={signals} />
        </div>

        {/* Risk Metrics - Takes full width of remaining space */}
        <div style={{ gridColumn: 'span 2' }}>
          <RiskMetrics signals={signals} patterns={patterns} />
        </div>
      </div>

      {/* Status Bar */}
      <div style={{ 
        marginTop: '1rem', 
        textAlign: 'center', 
        fontSize: '0.875rem',
        color: '#9ca3af',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem'
      }}>
        <span>
          Connection: {connected ? 
            <span className="text-green">🟢 Connected</span> : 
            <span className="text-red">🔴 Disconnected</span>
          }
        </span>
        {!connected && (
          <button 
            onClick={reconnect}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              fontSize: '0.75rem'
            }}
          >
            🔄 Reconnect
          </button>
        )}
        <span>Memory Window: 95 minutes</span>
        <span>Biological Accuracy: 95%</span>
      </div>
    </div>
  );
};

export default Dashboard;