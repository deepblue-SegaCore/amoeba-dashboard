
import React from 'react';
import './App.css';
import Dashboard from './components/Dashboard';

function App() {
  // Configure your trading symbols here
  const symbols = ['BTCUSD', 'ETHUSD', 'SPY', 'EURUSD'];
  
  // API URL from environment variable
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL || 'https://953370c5-8baa-49e6-a964-e76807498376-00-26qsx7u0809rl.pike.replit.dev';
  
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
