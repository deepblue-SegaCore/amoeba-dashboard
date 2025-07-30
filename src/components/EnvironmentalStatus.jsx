import React from 'react';
import { Activity, TrendingUp, TrendingDown } from 'lucide-react';
import EnvironmentalPressureGauge from './EnvironmentalPressureGauge';

const EnvironmentalStatus = ({ signals, symbols }) => {
  // Get latest signal for each symbol
  const latestSignals = symbols.map(symbol => {
    return signals.find(s => s.symbol === symbol);
  }).filter(Boolean);

  return (
    <div className="card">
      <h2 className="card-header">
        <Activity size={24} />
        Environmental Status - Real-Time Sensing
      </h2>

      <div className="grid grid-cols-4">
        {symbols.map(symbol => {
          const signal = latestSignals.find(s => s?.symbol === symbol);

          return (
            <div key={symbol} className="card" style={{ backgroundColor: '#374151' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {symbol}
              </h3>

              {signal ? (
                <>
                  <EnvironmentalPressureGauge 
                    pressure={signal.environmental_pressure || 0} 
                    threshold={signal.threshold || 1.8}
                  />

                  <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span>Direction:</span>
                      <span className={
                        signal.direction === 'BULLISH' ? 'text-green' : 
                        signal.direction === 'BEARISH' ? 'text-red' : 
                        'text-gray'
                      } style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        {signal.direction === 'BULLISH' ? <TrendingUp size={16} /> : 
                         signal.direction === 'BEARISH' ? <TrendingDown size={16} /> : 
                         null} 
                        {signal.direction || '—'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span>Food Source:</span>
                      <span className={
                        signal.food_source?.quality === 'HIGH' ? 'text-green' :
                        signal.food_source?.quality === 'MEDIUM' ? 'text-yellow' :
                        'text-red'
                      } style={{ fontWeight: 'bold' }}>
                        {signal.food_source?.quantity || '—'} / {signal.food_source?.quality || '—'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span>Sustainability:</span>
                      <span className={
                        signal.food_source?.sustainability === 'EXCELLENT' ? 'text-green' :
                        signal.food_source?.sustainability === 'GOOD' ? 'text-yellow' :
                        'text-yellow'
                      } style={{ fontWeight: 'bold' }}>
                        {signal.food_source?.sustainability || '—'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Duration:</span>
                      <span className="text-blue" style={{ fontWeight: 'bold' }}>
                        {signal.food_source?.predicted_duration || '—'}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ 
                  textAlign: 'center', 
                  color: '#6b7280',
                  padding: '2rem 0'
                }}>
                  Waiting for signals...
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EnvironmentalStatus;