
# Amoeba Trading System Dashboard

## Overview
Real-time environmental intelligence dashboard for the Amoeba Trading System - a biologically-inspired trading system based on cellular intelligence.

## Features
- 🔬 Real-time environmental pressure monitoring
- 📊 Signal history with validation tracking
- 🧠 Associative learning metrics
- 💰 Hypothetical position management
- 📈 Risk and performance analytics

## Installation

1. Clone this repository to Replit
2. Install dependencies: `npm install`
3. Configure your trading symbols in `App.jsx`
4. Update the API URL for your backend using Replit Secrets
5. Run: Click the "Run" button or use `npm run dev`

## Deployment

This project is configured for Replit Static Deployment:
1. Configure build command: `npm run build`
2. Set environment variable `REACT_APP_API_URL` in Replit Secrets
3. Deploy using Replit's deployment feature

## Environment Variables

Set these in your Replit Secrets:
- `REACT_APP_API_URL`: Your backend API URL (e.g., `https://your-backend.replit.app`)

## Biological Compliance
- Memory Window: 95 minutes (enforced)
- Learning Rate: 0.1 exponential decay
- Force-Calibrated Sizing: Signal strength matched
- Environmental Response: Threshold-based only

## Target Performance
- Alert Accuracy: >70%
- Response Time: <2 minutes
- System Uptime: >99.5%

## Development

This project uses:
- React 18 with Vite
- Lucide React icons
- Real-time WebSocket connections
- Responsive grid layouts

## API Integration

The dashboard connects to your trading backend via:
- REST API for historical data
- WebSocket for real-time updates
- Configurable symbols and thresholds
