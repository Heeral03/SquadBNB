import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// BSC Testnet configuration
const bscTestnet = {
  id: 97,
  name: 'BSC Testnet',
  network: 'bsc-testnet',
  nativeCurrency: { 
    name: 'tBNB', 
    symbol: 'tBNB', 
    decimals: 18 
  },
  rpcUrls: { 
    default: { 
      http: ['https://data-seed-prebsc-1-s1.binance.org:8545'] 
    } 
  },
  blockExplorers: { 
    default: { 
      name: 'BSC Testnet Explorer', 
      url: 'https://testnet.bscscan.com' 
    } 
  },
};

const projectId = import.meta.env.VITE_PROJECT_ID;

// 👇 UPDATED METADATA WITH REDIRECT
const metadata = {
  name: 'SquadBNB',
  description: 'Book Challenges on BNB Chain',
  url: window.location.origin,
  icons: [],
  redirect: {
    native: '',  // MetaMask handle karega
    universal: window.location.origin  // https://squadbnb-4.onrender.com
  }
};

const networks = [bscTestnet];

const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true
});

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,  // 👈 Updated metadata yahan use ho raha hai
  features: {
    analytics: true  // Optional: Telegram mein analytics band bhi kar sakte ho
  }
});

const queryClient = new QueryClient();

// Beautiful Splash Screen Component
const SplashScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('Initializing');

  useEffect(() => {
    const stages = [
      { progress: 25, text: 'Loading contracts...', delay: 300 },
      { progress: 50, text: 'Connecting to BNB Chain...', delay: 500 },
      { progress: 75, text: 'Preparing your library...', delay: 400 },
      { progress: 100, text: 'Ready!', delay: 300 }
    ];

    let currentStage = 0;
    
    const runStage = () => {
      if (currentStage < stages.length) {
        const { progress, text, delay } = stages[currentStage];
        setTimeout(() => {
          setProgress(progress);
          setStage(text);
          currentStage++;
          runStage();
        }, delay);
      } else {
        setTimeout(onComplete, 500);
      }
    };

    runStage();
  }, [onComplete]);

  return (
    <div className="splash-screen">
      <div className="splash-content">
        {/* Animated Background */}
        <div className="splash-bg">
          <div className="splash-gradient"></div>
          <div className="splash-particles">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="particle" style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}></div>
            ))}
          </div>
        </div>

        {/* Logo Area */}
        <div className="splash-logo">
          <div className="logo-icon">📚</div>
          <h1 className="logo-text">SquadBNB</h1>
          <p className="logo-tagline">Read. Share. Earn.</p>
        </div>

        {/* Progress Section */}
        <div className="splash-progress-section">
          <div className="progress-bar-splash">
            <div 
              className="progress-fill-splash" 
              style={{ width: `${progress}%` }}
            >
              <div className="progress-shimmer"></div>
            </div>
          </div>
          <p className="progress-text">{stage}</p>
          <p className="progress-percent">{progress}%</p>
        </div>

        {/* Powered By */}
        <div className="splash-footer">
          <div className="powered-by">
            <span className="powered-text">Powered by</span>
            <span className="chain-badge">
              <span className="chain-icon">⚡</span>
              BNB Chain
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Wrapper
const AppWrapper = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      {!showSplash && <App />}
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <AppWrapper />
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);