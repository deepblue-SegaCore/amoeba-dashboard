
import React from 'react';

export default function PositionManager({ positions = [] }) {
  const totalValue = positions.reduce((sum, pos) => sum + pos.value, 0);
  const totalPnL = positions.reduce((sum, pos) => sum + pos.pnl, 0);

  return (
    <div className="position-manager">
      <h3>Position Manager</h3>
      <div className="position-summary">
        <div className="summary-item">
          <label>Total Value</label>
          <span className="value">${totalValue.toLocaleString()}</span>
        </div>
        <div className="summary-item">
          <label>Total P&L</label>
          <span className={`value ${totalPnL >= 0 ? 'positive' : 'negative'}`}>
            ${totalPnL.toLocaleString()}
          </span>
        </div>
      </div>
      <div className="positions-list">
        {positions.length === 0 ? (
          <p>No active positions</p>
        ) : (
          positions.map((position, index) => (
            <div key={index} className="position-item">
              <span className="symbol">{position.symbol}</span>
              <span className="size">{position.size}</span>
              <span className="side">{position.side}</span>
              <span className={`pnl ${position.pnl >= 0 ? 'positive' : 'negative'}`}>
                ${position.pnl.toFixed(2)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
