
import React from 'react';

export default function EnvironmentalPressureGauge({ pressure = 0 }) {
  const getGaugeColor = (value) => {
    if (value < 30) return '#4ade80';
    if (value < 70) return '#facc15';
    return '#ef4444';
  };

  const rotation = (pressure / 100) * 180;

  return (
    <div className="pressure-gauge">
      <h3>Environmental Pressure</h3>
      <div className="gauge-container">
        <svg width="200" height="120" viewBox="0 0 200 120">
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="10"
          />
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={getGaugeColor(pressure)}
            strokeWidth="10"
            strokeDasharray={`${(pressure / 100) * 251.3} 251.3`}
            strokeLinecap="round"
          />
          <circle cx="100" cy="100" r="5" fill="#374151" />
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="30"
            stroke="#374151"
            strokeWidth="3"
            strokeLinecap="round"
            transform={`rotate(${rotation - 90} 100 100)`}
          />
        </svg>
        <div className="gauge-value">
          <span className="pressure-value">{pressure.toFixed(1)}</span>
          <span className="pressure-unit">%</span>
        </div>
      </div>
    </div>
  );
}
