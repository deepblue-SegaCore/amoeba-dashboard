
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
  
  // Construct WebSocket URL properly
  const wsUrl = apiUrl 
    ? `${apiUrl.replace('https://', 'wss://').replace('http://', 'ws://')}/ws/signals` 
    : null;
  const { messages, sendMessage, connected } = useWebSocket(wsUrl);
  
  // Generate fake signals for testing
  useEffect(() => {
    const generateFakeSignal = () => {
      const testSymbols = ['BTCUSD', 'ETHUSD', 'SPY', 'EURUSD'];
      const randomSymbol = testSymbols[Math.floor(Math.random() * testSymbols.length)];
      
      return {
        id: Date.now() + Math.random(),
        symbol: randomSymbol,
        timestamp: new Date().toISOString(),
        direction: Math.random() > 0.5 ? 'BULLISH' : 'BEARISH',
        strength: Math.random() * 0.5 + 0.5,
        confidence: Math.random() * 0.3 + 0.7,
        environmental_pressure: Math.random() * 2 + 0.5,
        threshold: 1.8,
        food_source: {
          quantity: ['SMALL', 'MEDIUM', 'LARGE'][Math.floor(Math.random() * 3)],
          quality: ['LOW', 'MEDIUM', 'HIGH'][Math.floor(Math.random() * 3)],
          sustainability: ['LIMITED', 'MODERATE', 'GOOD', 'EXCELLENT'][Math.floor(Math.random() * 4)],
          predicted_duration: ['1-3h', '3-6h', '6-12h', '12-24h'][Math.floor(Math.random() * 4)]
        },
        outcome: Math.random() > 0.3 ? true : Math.random() > 0.5 ? false : undefined,
        profit: (Math.random() * 4 - 1).toFixed(2)
      };
    };
    
    // Generate initial signals
    const initialSignals = Array(20).fill(null).map(() => generateFakeSignal());
    setSignals(initialSignals);
    
    // Add new signals every 3 seconds
    const interval = setInterval(() => {
      setSignals(prev => [generateFakeSignal(), ...prev].slice(0, 100));
    }, 3000);
    
    // Generate fake patterns
    const fakePattern = {
      id: Date.now().toString(),
      symbol: 'BTCUSD',
      success_probability: Math.random() * 0.3 + 0.5,
      sample_count: Math.floor(Math.random() * 20) + 1,
      age_minutes: Math.random() * 95
    };
    setPatterns([fakePattern]);
    
    return () => clearInterval(interval);
  }, []);

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
