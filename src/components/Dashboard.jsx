
import React, { useEffect, useState, useRef } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import EnvironmentalStatus from './EnvironmentalStatus';
import SignalHistory from './SignalHistory';
import LearningMetrics from './LearningMetrics';
import PositionManager from './PositionManager';
import RiskMetrics from './RiskMetrics';

const Dashboard = ({ symbols = [], apiUrl = '' }) => {
  // Always call hooks in the same order
  const [signals, setSignals] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [environmentalData, setEnvironmentalData] = useState(null);
  const [positions, setPositions] = useState([]);
  const [riskMetrics, setRiskMetrics] = useState(null);
  const intervalRef = useRef(null);
  
  // Construct WebSocket URL consistently
  const wsUrl = apiUrl ? `${apiUrl.replace('http', 'ws')}/ws/signals` : null;
  const { messages, sendMessage, connected } = useWebSocket(wsUrl);
  
  useEffect(() => {
    if (connected) {
      // Subscribe to symbols when connected
      sendMessage({
        action: 'subscribe',
        symbols: symbols
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
        color: '#9ca3af'
      }}>
        Connection: {connected ? 
          <span className="text-green">🟢 Connected</span> : 
          <span className="text-red">🔴 Disconnected</span>
        } | 
        Memory Window: 95 minutes | 
        Biological Accuracy: 95%
      </div>
    </div>
  );
};

export default Dashboard;
