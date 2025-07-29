
import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

const PositionManager = ({ signals = [] }) => {
  // Calculate hypothetical positions based on high-confidence signals
  const activePositions = signals
    .filter(s => (s.strength || 0) >= 0.6 && (s.confidence || 0) >= 0.7)
    .slice(0, 5)
    .map(signal => ({
      symbol: signal.symbol,
      direction: signal.direction,
      entryPrice: signal.price || 0,
      positionSize: calculatePositionSize(signal),
      stopLoss: calculateStopLoss(signal),
      takeProfit: calculateTakeProfit(signal),
      riskAmount: calculateRiskAmount(signal),
      signal
    }));
  
  function calculatePositionSize(signal) {
    const baseRisk = 0.02; // 2% base risk
    const multipliers = {
      'strong_bullish': 2.0,
      'weak_bullish': 1.2,
      'strong_bearish': 2.0,
      'weak_bearish': 1.2,
      'neutral': 0.5
    };
    
    const strength = signal.strength || 0;
    const signalClass = strength >= 0.7 ? 'strong' : 'weak';
    const type = `${signalClass}_${(signal.direction || 'neutral').toLowerCase()}`;
    const multiplier = multipliers[type] || 1.0;
    
    return baseRisk * multiplier * Math.pow(signal.confidence || 1, 2);
  }
  
  function calculateStopLoss(signal) {
    const atrMultiplier = 2.0;
    const price = signal.price || 100;
    const stopDistance = (signal.atr || price * 0.02) * atrMultiplier;
    return signal.direction === 'BULLISH' 
      ? price - stopDistance 
      : price + stopDistance;
  }
  
  function calculateTakeProfit(signal) {
    const riskRewardRatio = 2.0;
    const price = signal.price || 100;
    const stopDistance = Math.abs(price - calculateStopLoss(signal));
    return signal.direction === 'BULLISH'
      ? price + (stopDistance * riskRewardRatio)
      : price - (stopDistance * riskRewardRatio);
  }
  
  function calculateRiskAmount(signal) {
    const positionSize = calculatePositionSize(signal);
    return positionSize * 10000; // Assuming $10,000 account
  }
  
  const totalExposure = activePositions.reduce((sum, pos) => sum + pos.riskAmount, 0);
  
  return (
    <div className="card">
      <h2 className="card-header">
        <DollarSign size={24} />
        Position Manager (Hypothetical)
      </h2>
      
      {/* Risk Overview */}
      <div className="card" style={{ backgroundColor: '#374151', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#9ca3af' }}>Total Exposure:</span>
          <span className={
            totalExposure > 500 ? 'text-red' : 
            totalExposure > 300 ? 'text-yellow' : 
            'text-green'
          } style={{ fontWeight: 'bold' }}>
            ${totalExposure.toFixed(0)}
          </span>
        </div>
        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
          Max recommended: $800 (8% of capital)
        </div>
      </div>
      
      {/* Active Positions */}
      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {activePositions.length > 0 ? (
          activePositions.map((pos, index) => (
            <div key={index} className="card" style={{ backgroundColor: '#374151', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {pos.direction === 'BULLISH' ? (
                    <TrendingUp className="text-green" size={16} />
                  ) : (
                    <TrendingDown className="text-red" size={16} />
                  )}
                  <span style={{ fontWeight: 'bold' }}>{pos.symbol}</span>
                </div>
                <span className={
                  pos.signal.food_source?.quality === 'HIGH' ? 'text-green' :
                  pos.signal.food_source?.quality === 'MEDIUM' ? 'text-yellow' :
                  'text-red'
                } style={{ fontSize: '0.875rem' }}>
                  {pos.signal.food_source?.quality || 'Unknown'} Quality
                </span>
              </div>
              
              <div className="grid grid-cols-2" style={{ gap: '0.5rem', fontSize: '0.75rem' }}>
                <div>
                  <span style={{ color: '#9ca3af' }}>Entry:</span>
                  <span style={{ marginLeft: '0.25rem' }}>${pos.entryPrice.toFixed(2)}</span>
                </div>
                <div>
                  <span style={{ color: '#9ca3af' }}>Size:</span>
                  <span style={{ marginLeft: '0.25rem' }}>{(pos.positionSize * 100).toFixed(1)}%</span>
                </div>
                <div>
                  <span style={{ color: '#9ca3af' }}>Stop:</span>
                  <span className="text-red" style={{ marginLeft: '0.25rem' }}>${pos.stopLoss.toFixed(2)}</span>
                </div>
                <div>
                  <span style={{ color: '#9ca3af' }}>Target:</span>
                  <span className="text-green" style={{ marginLeft: '0.25rem' }}>${pos.takeProfit.toFixed(2)}</span>
                </div>
              </div>
              
              <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                  Risk: ${pos.riskAmount.toFixed(0)}
                </span>
                <span className="text-blue" style={{ fontSize: '0.75rem' }}>
                  {pos.signal.food_source?.predicted_duration || '—'}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
            No high-confidence signals for positioning
          </div>
        )}
      </div>
      
      {/* Risk Warning */}
      {totalExposure > 500 && (
        <div className="card" style={{ 
          backgroundColor: 'rgba(251, 191, 36, 0.1)',
          marginTop: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <AlertTriangle className="text-yellow" size={16} />
          <span className="text-yellow" style={{ fontSize: '0.875rem' }}>
            Exposure approaching limits. Consider reducing position sizes.
          </span>
        </div>
      )}
    </div>
  );
};

export default PositionManager;
