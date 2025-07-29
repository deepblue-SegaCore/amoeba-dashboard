
import React from 'react';

export default function RiskMetrics({ risk = {} }) {
  const {
    currentDrawdown = 0,
    maxDrawdown = 0,
    sharpeRatio = 0,
    volatility = 0,
    riskScore = 0
  } = risk;

  const getRiskLevel = (score) => {
    if (score < 30) return 'low';
    if (score < 70) return 'medium';
    return 'high';
  };

  return (
    <div className="risk-metrics">
      <h3>Risk Metrics</h3>
      <div className="risk-grid">
        <div className="risk-item">
          <label>Current Drawdown</label>
          <span className="value">{currentDrawdown.toFixed(2)}%</span>
        </div>
        <div className="risk-item">
          <label>Max Drawdown</label>
          <span className="value">{maxDrawdown.toFixed(2)}%</span>
        </div>
        <div className="risk-item">
          <label>Sharpe Ratio</label>
          <span className="value">{sharpeRatio.toFixed(2)}</span>
        </div>
        <div className="risk-item">
          <label>Volatility</label>
          <span className="value">{volatility.toFixed(2)}%</span>
        </div>
        <div className="risk-item">
          <label>Risk Score</label>
          <span className={`value risk-${getRiskLevel(riskScore)}`}>
            {riskScore}/100
          </span>
        </div>
      </div>
    </div>
  );
}
