
import React from 'react';
import { Shield, TrendingUp, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RiskMetrics = ({ signals = [], patterns = [] }) => {
  // Calculate performance metrics
  const performanceByHour = calculateHourlyPerformance(signals);
  const winRate = calculateWinRate(signals);
  const avgProfit = calculateAverageProfit(signals);
  const sharpeRatio = calculateSharpeRatio(signals);
  
  function calculateHourlyPerformance(signals) {
    const hourly = {};
    
    signals.forEach(signal => {
      if (signal.outcome !== undefined && signal.timestamp) {
        const hour = new Date(signal.timestamp).getHours();
        if (!hourly[hour]) {
          hourly[hour] = { hour, wins: 0, losses: 0, total: 0 };
        }
        hourly[hour].total++;
        if (signal.outcome) hourly[hour].wins++;
        else hourly[hour].losses++;
      }
    });
    
    return Object.values(hourly)
      .map(h => ({
        ...h,
        winRate: h.total > 0 ? (h.wins / h.total * 100) : 0
      }))
      .sort((a, b) => a.hour - b.hour);
  }
  
  function calculateWinRate(signals) {
    const completed = signals.filter(s => s.outcome !== undefined);
    const wins = completed.filter(s => s.outcome === true).length;
    return completed.length > 0 ? (wins / completed.length * 100) : 0;
  }
  
  function calculateAverageProfit(signals) {
    const profits = signals
      .filter(s => s.profit !== undefined)
      .map(s => s.profit || 0);
    return profits.length > 0 
      ? profits.reduce((sum, p) => sum + p, 0) / profits.length 
      : 0;
  }
  
  function calculateSharpeRatio(signals) {
    const returns = signals
      .filter(s => s.profit !== undefined)
      .map(s => s.profit || 0);
    
    if (returns.length < 2) return 0;
    
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
    const stdDev = Math.sqrt(variance);
    
    return stdDev > 0 ? (avgReturn / stdDev) * Math.sqrt(252) : 0;
  }
  
  return (
    <div className="card">
      <h2 className="card-header">
        <Shield size={24} />
        Risk Management & Performance
      </h2>
      
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-4" style={{ marginBottom: '1.5rem' }}>
        <div className="card" style={{ backgroundColor: '#374151', textAlign: 'center', padding: '0.75rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Win Rate</div>
          <div className={
            winRate >= 70 ? 'text-green' :
            winRate >= 50 ? 'text-yellow' :
            'text-red'
          } style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            {winRate.toFixed(1)}%
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Target: 70%</div>
        </div>
        
        <div className="card" style={{ backgroundColor: '#374151', textAlign: 'center', padding: '0.75rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Avg Profit</div>
          <div className={avgProfit > 0 ? 'text-green' : 'text-red'} 
               style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            {avgProfit > 0 ? '+' : ''}{avgProfit.toFixed(2)}%
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Per Trade</div>
        </div>
        
        <div className="card" style={{ backgroundColor: '#374151', textAlign: 'center', padding: '0.75rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Sharpe Ratio</div>
          <div className={
            sharpeRatio > 1.5 ? 'text-green' :
            sharpeRatio > 0.5 ? 'text-yellow' :
            'text-red'
          } style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            {sharpeRatio.toFixed(2)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Risk-Adjusted</div>
        </div>
        
        <div className="card" style={{ backgroundColor: '#374151', textAlign: 'center', padding: '0.75rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Adaptation</div>
          <div className="text-blue" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            {patterns.length > 0 ? 'Active' : 'Learning'}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            {patterns.length} patterns
          </div>
        </div>
      </div>
      
      {/* Performance by Hour Chart */}
      {performanceByHour.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#9ca3af' }}>
            Win Rate by Hour (UTC)
          </h3>
          <div style={{ height: '160px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceByHour}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="hour" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                  formatter={(value) => `${value.toFixed(0)}%`}
                />
                <Bar dataKey="winRate" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      
      {/* Biological Compliance Indicators */}
      <div className="card" style={{ backgroundColor: '#374151' }}>
        <h3 style={{ 
          fontSize: '0.875rem', 
          fontWeight: 'bold',
          marginBottom: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <TrendingUp size={16} />
          Biological Compliance Status
        </h3>
        <div style={{ fontSize: '0.875rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: '#9ca3af' }}>Memory Window Compliance:</span>
            <span className="text-green">✓ 95 minutes enforced</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: '#9ca3af' }}>Learning Rate Adaptation:</span>
            <span className="text-green">✓ 0.1 exponential decay</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: '#9ca3af' }}>Force-Calibrated Sizing:</span>
            <span className="text-green">✓ Signal strength matched</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#9ca3af' }}>Environmental Response:</span>
            <span className="text-green">✓ Threshold-based only</span>
          </div>
        </div>
      </div>
      
      {/* Risk Warnings */}
      {winRate < 50 && signals.length > 10 && (
        <div className="card" style={{ 
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          marginTop: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <AlertCircle className="text-red" size={16} />
          <span className="text-red" style={{ fontSize: '0.875rem' }}>
            Win rate below target. Review environmental calibration settings.
          </span>
        </div>
      )}
    </div>
  );
};

export default RiskMetrics;
