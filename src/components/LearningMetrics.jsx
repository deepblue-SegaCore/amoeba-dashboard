
import React from 'react';

export default function LearningMetrics({ metrics = {} }) {
  const {
    accuracy = 0,
    adaptationRate = 0,
    experiencePoints = 0,
    learningSpeed = 0,
    memoryUtilization = 0
  } = metrics;

  return (
    <div className="learning-metrics">
      <h3>Learning Metrics</h3>
      <div className="metrics-grid">
        <div className="metric-item">
          <label>Accuracy</label>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${accuracy}%` }}
            ></div>
          </div>
          <span>{accuracy}%</span>
        </div>
        <div className="metric-item">
          <label>Adaptation Rate</label>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${adaptationRate}%` }}
            ></div>
          </div>
          <span>{adaptationRate}%</span>
        </div>
        <div className="metric-item">
          <label>Experience Points</label>
          <span className="value">{experiencePoints.toLocaleString()}</span>
        </div>
        <div className="metric-item">
          <label>Learning Speed</label>
          <span className="value">{learningSpeed}x</span>
        </div>
        <div className="metric-item">
          <label>Memory Usage</label>
          <span className="value">{memoryUtilization}%</span>
        </div>
      </div>
    </div>
  );
}
