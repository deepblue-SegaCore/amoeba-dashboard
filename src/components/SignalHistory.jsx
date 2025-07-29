
import React from 'react';

export default function SignalHistory({ signals = [] }) {
  const recentSignals = signals.slice(-10);

  return (
    <div className="signal-history">
      <h3>Signal History</h3>
      <div className="signals-container">
        {recentSignals.length === 0 ? (
          <p>No signals recorded</p>
        ) : (
          <ul className="signals-list">
            {recentSignals.map((signal, index) => (
              <li key={index} className={`signal-item ${signal.type}`}>
                <span className="signal-time">{signal.timestamp}</span>
                <span className="signal-type">{signal.type.toUpperCase()}</span>
                <span className="signal-strength">{signal.strength}%</span>
                <span className="signal-direction">{signal.direction}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
