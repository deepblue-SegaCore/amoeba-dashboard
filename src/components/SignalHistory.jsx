
import React, { useState } from 'react';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown, CheckCircle, XCircle, Clock, Activity } from 'lucide-react';

const SignalHistory = ({ signals = [] }) => {
  const [filter, setFilter] = useState('all');
  
  const filteredSignals = signals.filter(signal => {
    if (filter === 'all') return true;
    if (filter === 'pending') return signal.outcome === undefined;
    if (filter === 'correct') return signal.outcome === true;
    if (filter === 'incorrect') return signal.outcome === false;
    return true;
  });
  
  const stats = {
    total: signals.length,
    correct: signals.filter(s => s.outcome === true).length,
    incorrect: signals.filter(s => s.outcome === false).length,
    pending: signals.filter(s => s.outcome === undefined).length,
  };
  
  const accuracy = stats.total > 0 && (stats.correct + stats.incorrect) > 0
    ? ((stats.correct / (stats.correct + stats.incorrect)) * 100).toFixed(1)
    : '0';
  
  return (
    <div className="card">
      <h2 className="card-header">Signal History & Validation</h2>
      
      {/* Stats Bar */}
      <div className="grid grid-cols-5" style={{ marginBottom: '1rem' }}>
        <div className="card" style={{ backgroundColor: '#374151', textAlign: 'center', padding: '0.75rem' }}>
          <div style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Total</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.total}</div>
        </div>
        <div className="card" style={{ backgroundColor: '#374151', textAlign: 'center', padding: '0.75rem' }}>
          <div style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Correct</div>
          <div className="text-green" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.correct}</div>
        </div>
        <div className="card" style={{ backgroundColor: '#374151', textAlign: 'center', padding: '0.75rem' }}>
          <div style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Incorrect</div>
          <div className="text-red" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.incorrect}</div>
        </div>
        <div className="card" style={{ backgroundColor: '#374151', textAlign: 'center', padding: '0.75rem' }}>
          <div style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Pending</div>
          <div className="text-yellow" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.pending}</div>
        </div>
        <div className="card" style={{ backgroundColor: '#374151', textAlign: 'center', padding: '0.75rem' }}>
          <div style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Accuracy</div>
          <div className="text-blue" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{accuracy}%</div>
        </div>
      </div>
      
      {/* Filter Buttons */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {['all', 'correct', 'incorrect', 'pending'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`btn ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      
      {/* Signal List */}
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {filteredSignals.map((signal, index) => (
          <div 
            key={signal.id || index} 
            className="card animate-slide-in"
            style={{ 
              backgroundColor: '#374151',
              padding: '0.75rem',
              marginBottom: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {/* Direction Icon */}
              {signal.direction === 'BULLISH' ? (
                <TrendingUp className="text-green" size={20} />
              ) : signal.direction === 'BEARISH' ? (
                <TrendingDown className="text-red" size={20} />
              ) : (
                <Activity className="text-gray" size={20} />
              )}
              
              {/* Signal Info */}
              <div>
                <div style={{ fontWeight: 'bold' }}>{signal.symbol}</div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                  {signal.timestamp ? format(new Date(signal.timestamp), 'MMM dd HH:mm:ss') : 'Now'}
                </div>
              </div>
              
              {/* Strength & Confidence */}
              <div style={{ fontSize: '0.875rem' }}>
                <div>Strength: {((signal.strength || 0) * 100).toFixed(0)}%</div>
                <div>Confidence: {((signal.confidence || 0) * 100).toFixed(0)}%</div>
              </div>
              
              {/* Food Source */}
              <div style={{ fontSize: '0.875rem' }}>
                <div className={
                  signal.food_source?.quality === 'HIGH' ? 'text-green' :
                  signal.food_source?.quality === 'MEDIUM' ? 'text-yellow' :
                  'text-red'
                }>
                  {signal.food_source?.quantity || '—'} / {signal.food_source?.quality || '—'}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                  {signal.food_source?.predicted_duration || '—'}
                </div>
              </div>
            </div>
            
            {/* Outcome */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {signal.outcome === true ? (
                <>
                  <CheckCircle className="text-green" size={24} />
                  <span className="text-green" style={{ fontWeight: 'bold' }}>
                    +{signal.profit || 0}%
                  </span>
                </>
              ) : signal.outcome === false ? (
                <>
                  <XCircle className="text-red" size={24} />
                  <span className="text-red" style={{ fontWeight: 'bold' }}>
                    {signal.profit || 0}%
                  </span>
                </>
              ) : (
                <>
                  <Clock className="text-yellow animate-pulse" size={24} />
                  <span className="text-yellow">Pending</span>
                </>
              )}
            </div>
          </div>
        ))}
        
        {filteredSignals.length === 0 && (
          <div style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
            No signals to display
          </div>
        )}
      </div>
    </div>
  );
};

export default SignalHistory;
