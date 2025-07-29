
import React from 'react';
import './App.css';
import Dashboard from './components/Dashboard';

function App() {
  // Configure your trading symbols here
  const symbols = ['BTCUSD', 'ETHUSD', 'SPY', 'EURUSD'];
  
  // API URL - update this for production
  const apiUrl = import.meta.env.REACT_APP_API_URL || 'http://localhost:5000';
  
  return (
    <div className="App">
      <Dashboard 
        symbols={symbols} 
        apiUrl={apiUrl}
      />
    </div>
  );
}

export default App;
