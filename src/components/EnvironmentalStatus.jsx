
import React from 'react';

export default function EnvironmentalStatus({ data = {} }) {
  const {
    temperature = 22.5,
    ph = 7.2,
    nutrients = 85,
    toxicity = 12,
    oxygenLevel = 98
  } = data;

  return (
    <div className="environmental-status">
      <h3>Environmental Status</h3>
      <div className="status-grid">
        <div className="status-item">
          <label>Temperature</label>
          <span className="value">{temperature}°C</span>
        </div>
        <div className="status-item">
          <label>pH Level</label>
          <span className="value">{ph}</span>
        </div>
        <div className="status-item">
          <label>Nutrients</label>
          <span className="value">{nutrients}%</span>
        </div>
        <div className="status-item">
          <label>Toxicity</label>
          <span className={`value ${toxicity > 20 ? 'warning' : ''}`}>{toxicity}%</span>
        </div>
        <div className="status-item">
          <label>Oxygen Level</label>
          <span className="value">{oxygenLevel}%</span>
        </div>
      </div>
    </div>
  );
}
