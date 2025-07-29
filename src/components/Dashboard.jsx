
import React from 'react';
import EnvironmentalStatus from './EnvironmentalStatus';
import SignalHistory from './SignalHistory';
import LearningMetrics from './LearningMetrics';
import PositionManager from './PositionManager';
import RiskMetrics from './RiskMetrics';
import EnvironmentalPressureGauge from './EnvironmentalPressureGauge';
import { useWebSocket } from '../hooks/useWebSocket';

export default function Dashboard() {
  const { data, connectionStatus } = useWebSocket('ws://localhost:8080/ws');

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Amoeba Trading Dashboard</h1>
        <div className={`connection-status ${connectionStatus}`}>
          {connectionStatus === 'connected' ? '🟢 Connected' : '🔴 Disconnected'}
        </div>
      </header>
      
      <div className="dashboard-grid">
        <div className="dashboard-section">
          <EnvironmentalStatus data={data?.environmental} />
        </div>
        
        <div className="dashboard-section">
          <EnvironmentalPressureGauge pressure={data?.pressure || 0} />
        </div>
        
        <div className="dashboard-section">
          <SignalHistory signals={data?.signals || []} />
        </div>
        
        <div className="dashboard-section">
          <LearningMetrics metrics={data?.learning || {}} />
        </div>
        
        <div className="dashboard-section">
          <PositionManager positions={data?.positions || []} />
        </div>
        
        <div className="dashboard-section">
          <RiskMetrics risk={data?.risk || {}} />
        </div>
      </div>
    </div>
  );
}
