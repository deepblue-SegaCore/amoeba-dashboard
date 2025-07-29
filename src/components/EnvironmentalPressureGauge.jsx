
import React from 'react';
import { ResponsiveContainer, RadialBarChart, RadialBar, Cell } from 'recharts';

const EnvironmentalPressureGauge = ({ pressure, threshold }) => {
  const percentage = Math.min((pressure / threshold) * 100, 150);
  
  const data = [
    { name: 'background', value: 100, fill: '#374151' },
    { name: 'pressure', value: percentage, fill: getPressureColor(pressure, threshold) }
  ];
  
  function getPressureColor(p, t) {
    const ratio = p / t;
    if (ratio >= 1.5) return '#ef4444';  // red - Extreme
    if (ratio >= 1.0) return '#f97316';  // orange - Active
    if (ratio >= 0.8) return '#f59e0b';  // amber - Building
    if (ratio >= 0.6) return '#eab308';  // yellow - Watching
    return '#10b981';  // green - Dormant
  }
  
  function getPressureState(p, t) {
    const ratio = p / t;
    if (ratio >= 1.5) return 'EXTREME';
    if (ratio >= 1.0) return 'ACTIVE';
    if (ratio >= 0.8) return 'BUILDING';
    if (ratio >= 0.6) return 'WATCHING';
    return 'DORMANT';
  }
  
  return (
    <div style={{ position: 'relative', height: '120px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart 
          cx="50%" 
          cy="50%" 
          innerRadius="60%" 
          outerRadius="90%" 
          data={data} 
          startAngle={180} 
          endAngle={0}
        >
          <RadialBar dataKey="value" cornerRadius={10}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </RadialBar>
        </RadialBarChart>
      </ResponsiveContainer>
      
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        marginTop: '20px'
      }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          {pressure.toFixed(2)}
        </div>
        <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
          {getPressureState(pressure, threshold)}
        </div>
      </div>
    </div>
  );
};

export default EnvironmentalPressureGauge;
