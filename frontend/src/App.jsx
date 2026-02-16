import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { AppKitButton } from '@reown/appkit/react';
import { SQUAD_MANAGER_ADDRESS, SQUAD_MANAGER_ABI } from './contracts/config';
import { BADGES_CONTRACT_ADDRESS, BADGES_ABI } from './contracts/badgesConfig';
import { uploadChallengeToPinata } from './utils/pinata';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';
import './App.css';
import MonthlyChallenge from './components/MonthlyChallenge';
import Chatbot from './components/Chatbot';
// Components
import UserDashboard from './components/UserDashboard';
import SubmissionFeed from './components/SubmissionFeed';
import SquadSwitcher from './components/SquadSwitcher';
import BadgeDisplay from './components/BadgeDisplay';
import DailyChallenge from './components/DailyChallenge';
import AIQuoteGenerator from './components/AIQuoteGenerator';
import {  useDisconnect } from 'wagmi';
// Add BigInt serialization support
BigInt.prototype.toJSON = function() {
  return this.toString();
};

const TimeAgo = ({ timestamp }) => {
  const getTimeAgo = () => {
    const seconds = Math.floor((Date.now() - timestamp * 1000) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };
  
  return <span className="time-ago">{getTimeAgo()}</span>;
};

function App() {
  const { address, isConnected, chain } = useAccount();
  
  // Navigation State
  const [activeTab, setActiveTab] = useState('home');
    const { disconnect } = useDisconnect();
  // Other State
  const [squadName, setSquadName] = useState('');
  const [selectedSquad, setSelectedSquad] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [quote, setQuote] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshBadges, setRefreshBadges] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // AI Challenge State
  const [todaysChallenge, setTodaysChallenge] = useState(null);
  const [squadChallenge, setSquadChallenge] = useState(null);
  const [challengeLoading, setChallengeLoading] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  
const API_URL = (() => {
  // Check multiple ways to detect Telegram
  const isTelegram = (
    // Check for Telegram WebView
    (typeof window !== 'undefined' && window.TelegramWebview?.platform !== undefined) ||
    // Check user agent
    (typeof navigator !== 'undefined' && navigator.userAgent.includes('Telegram')) ||
    // Check for Telegram in the URL
    (typeof window !== 'undefined' && window.location.href.includes('telegram')) ||
    // Check for Telegram in the referrer
    (typeof document !== 'undefined' && document.referrer.includes('telegram'))
  );
  
  // ALWAYS use ngrok URL when on mobile/Telegram
  // For now, let's just use ngrok URL for everything to test
  console.log('📱 Environment detection:', {
    isTelegram,
    userAgent: navigator.userAgent,
    url: window.location.href
  });
  
  // FOR TESTING: Always use ngrok URL to eliminate detection issues
  return 'https://griffin-hierogrammatical-weakly.ngrok-free.dev';
  
  /* Use this once testing works:
  if (isTelegram) {
    return 'https://griffin-hierogrammatical-weakly.ngrok-free.dev';
  } else {
    return import.meta.env.VITE_API_URL || 'http://localhost:3000';
  }
  */
})();

  // Get current time for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Format address for display
  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Contract Reads
  const { data: allSquads, refetch: refetchSquads, isLoading: squadsLoading } = useReadContract({
    address: SQUAD_MANAGER_ADDRESS,
    abi: SQUAD_MANAGER_ABI,
    functionName: 'getAllSquads',
    query: { enabled: isConnected && isCorrectNetwork }
  });

  const { data: userProfile, refetch: refetchProfile } = useReadContract({
    address: SQUAD_MANAGER_ADDRESS,
    abi: SQUAD_MANAGER_ABI,
    functionName: 'getUserProfile',
    args: [address],
    query: { enabled: !!address && isConnected && isCorrectNetwork }
  });

  const { data: squadDetails, refetch: refetchSquad } = useReadContract({
    address: SQUAD_MANAGER_ADDRESS,
    abi: SQUAD_MANAGER_ABI,
    functionName: 'getSquad',
    args: [userProfile?.[0] || ''],
    query: { enabled: !!userProfile?.[0] && isConnected && isCorrectNetwork }
  });

  const { data: leaderboard, refetch: refetchLeaderboard } = useReadContract({
    address: SQUAD_MANAGER_ADDRESS,
    abi: SQUAD_MANAGER_ABI,
    functionName: 'getLeaderboard',
    query: { enabled: isConnected && isCorrectNetwork }
  });

  const { data: submissions, refetch: refetchSubmissions } = useReadContract({
    address: SQUAD_MANAGER_ADDRESS,
    abi: SQUAD_MANAGER_ABI,
    functionName: 'getSubmissions',
    args: [userProfile?.[0] || ''],
    query: { enabled: !!userProfile?.[0] && isConnected && isCorrectNetwork }
  });

  const { data: userSubmissions, refetch: refetchUserSubs } = useReadContract({
    address: SQUAD_MANAGER_ADDRESS,
    abi: SQUAD_MANAGER_ABI,
    functionName: 'getSubmissionsForUser',
    args: [address],
    query: { enabled: !!address && isConnected && isCorrectNetwork }
  });

  // Badges Reads
  const { data: userBadges, refetch: refetchBadges } = useReadContract({
    address: BADGES_CONTRACT_ADDRESS,
    abi: BADGES_ABI,
    functionName: 'getUserBadges',
    args: [address],
    query: { enabled: !!address && isConnected && isCorrectNetwork }
  });

  const { data: badgeCount } = useReadContract({
    address: BADGES_CONTRACT_ADDRESS,
    abi: BADGES_ABI,
    functionName: 'getBadgeCount',
    args: [address],
    query: { enabled: !!address && isConnected && isCorrectNetwork }
  });

  const { data: badgesTotalSupply } = useReadContract({
    address: BADGES_CONTRACT_ADDRESS,
    abi: BADGES_ABI,
    functionName: 'totalSupply',
    query: { enabled: isConnected && isCorrectNetwork }
  });

  const { data: hasFirstBadge } = useReadContract({
    address: BADGES_CONTRACT_ADDRESS,
    abi: BADGES_ABI,
    functionName: 'hasBadge',
    args: [address, 0],
    query: { enabled: !!address && isConnected && isCorrectNetwork }
  });

  // Contract Writes
  const { writeContractAsync: createSquad, isPending: isCreating } = useWriteContract();
  const { writeContractAsync: joinSquad, isPending: isJoining } = useWriteContract();
  const { writeContractAsync: submit, isPending: isSubmitting } = useWriteContract();
  const { writeContractAsync: verify, isPending: isVerifying } = useWriteContract();
  const { writeContractAsync: leaveSquad, isPending: isLeaving } = useWriteContract();

  const categories = [
    { id: 'fantasy', name: 'Fantasy', emoji: '🐉' },
    { id: 'philosophy', name: 'Philosophy', emoji: '🤔' },
    { id: 'scifi', name: 'Sci-Fi', emoji: '🚀' },
    { id: 'romance', name: 'Romance', emoji: '❤️' },
    { id: 'mystery', name: 'Mystery', emoji: '🔍' },
    { id: 'self_help', name: 'Self-Help', emoji: '🌱' }
  ];

  // Challenge Fetch Functions
  const fetchDailyChallenge = async () => {
    try {
      setChallengeLoading(true);
      const response = await fetch(`${API_URL}/api/daily-challenge/today`);
      const data = await response.json();
      
      if (data.success) {
        setTodaysChallenge(data.challenge);
      }
    } catch (error) {
      console.error('Error fetching daily challenge:', error);
    } finally {
      setChallengeLoading(false);
    }
  };

  const fetchSquadChallenge = async (squadName) => {
    if (!squadName) return;
    
    try {
      const response = await fetch(`${API_URL}/api/squad/${squadName}/challenge/today`);
      const data = await response.json();
      
      if (data.success) {
        setSquadChallenge(data.challenge);
      }
    } catch (error) {
      console.error('Error fetching squad challenge:', error);
    }
  };

  // Handlers
  const handleCreateSquad = async () => {
    if (!squadName || !selectedCategory) {
      toast.error('Please fill all fields');
      return;
    }
    
    try {
      const loadingToast = toast.loading('Creating squad...');
      
      await createSquad({
        address: SQUAD_MANAGER_ADDRESS,
        abi: SQUAD_MANAGER_ABI,
        functionName: 'createSquad',
        args: [squadName],
      });
      
      const response = await fetch(`${API_URL}/api/squad/${encodeURIComponent(squadName)}/category`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ category: selectedCategory })
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
      }
      
      toast.dismiss(loadingToast);
      toast.success('Squad created with category!');
      
      setSquadName('');
      setSelectedCategory(null);
      
      setTimeout(() => {
        refetchSquads();
        refetchProfile();
        fetchSquadChallenge(squadName);
        setActiveTab('squads');
      }, 3000);
      
    } catch (error) {
      toast.dismiss();
      toast.error(error?.shortMessage || error?.message || 'Failed to create squad');
    }
  };

  const handleJoinSquad = async (squad) => {
    setSelectedSquad(squad);
    try {
      const loadingToast = toast.loading('Joining...');
      
      await joinSquad({
        address: SQUAD_MANAGER_ADDRESS,
        abi: SQUAD_MANAGER_ABI,
        functionName: 'joinSquad',
        args: [squad],
      });
      
      toast.dismiss(loadingToast);
      toast.success('Joined squad');
      
      setTimeout(() => {
        refetchProfile();
        refetchSquad();
        setActiveTab('profile');
      }, 3000);
      
    } catch (error) {
      toast.dismiss();
      toast.error(error?.shortMessage || 'Failed');
    }
  };

  const handleLeaveSquad = async () => {
    try {
      const loadingToast = toast.loading('Leaving...');
      
      await leaveSquad({
        address: SQUAD_MANAGER_ADDRESS,
        abi: SQUAD_MANAGER_ABI,
        functionName: 'leaveSquad',
        args: [],
      });
      
      toast.dismiss(loadingToast);
      toast.success('Left squad');
      
      setTimeout(() => {
        refetchProfile();
        setActiveTab('squads');
      }, 3000);
      
    } catch (error) {
      toast.dismiss();
      toast.error(error?.shortMessage || 'Failed');
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image too large (max 5MB)');
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image');
      return;
    }
    
    setPhoto(file);
    
    const reader = new FileReader();
    reader.onload = (event) => setPhotoPreview(event.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmitChallenge = async (e) => {
    e.preventDefault();
    
    if (!photo || !quote) {
      toast.error('Add photo and quote');
      return;
    }
    if (!userProfile?.[0]) {
      toast.error('Join a squad first');
      return;
    }

    setIsUploading(true);
    
    try {
      const uploadToast = toast.loading('Uploading...');
      const hash = await uploadChallengeToPinata(photo, quote);
      toast.dismiss(uploadToast);
      
      const txToast = toast.loading('Submitting...');
      await submit({
        address: SQUAD_MANAGER_ADDRESS,
        abi: SQUAD_MANAGER_ABI,
        functionName: 'submit',
        args: [hash, quote, new Date().toISOString().split('T')[0]],
      });
      
      toast.dismiss(txToast);
      toast.success('Submitted');
      
      setPhoto(null);
      setPhotoPreview(null);
      setQuote('');
      
      setTimeout(() => {
        refetchLeaderboard();
        refetchSubmissions();
        refetchUserSubs();
        setRefreshBadges(prev => prev + 1);
        setActiveTab('feed');
      }, 3000);
      
    } catch (error) {
      toast.dismiss();
      toast.error(error?.shortMessage || 'Failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleVerify = async (squadName, index) => {
    try {
      const loadingToast = toast.loading('Verifying...');
      
      await verify({
        address: SQUAD_MANAGER_ADDRESS,
        abi: SQUAD_MANAGER_ABI,
        functionName: 'verifySubmission',
        args: [squadName, index],
      });
      
      toast.dismiss(loadingToast);
      toast.success('Verified');
      
      setTimeout(() => {
        refetchSubmissions();
        refetchLeaderboard();
        refetchSquad();
        refetchUserSubs();
        setRefreshBadges(prev => prev + 1);
      }, 3000);
      
    } catch (error) {
      toast.dismiss();
      toast.error(error?.shortMessage || 'Failed');
    }
  };

  const handleNetworkSwitch = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x61' }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x61',
              chainName: 'BSC Testnet',
              nativeCurrency: { name: 'tBNB', symbol: 'tBNB', decimals: 18 },
              rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
              blockExplorerUrls: ['https://testnet.bscscan.com']
            }],
          });
        } catch {
          toast.error('Failed to add network');
        }
      }
    }
  };

const handleDisconnect = async () => {
  try {
    // Use wagmi's disconnect function
    disconnect();
    
    // Optional: Clear any app-specific storage
    localStorage.removeItem('wagmi.wallet');
    localStorage.removeItem('wagmi.connected');
    localStorage.removeItem('wagmi.store');
    
    // No need to reload - wagmi's state will update automatically
    // and your UI will re-render to show the welcome screen
    
    toast.success('Disconnected successfully');
  } catch (error) {
    console.error('Error disconnecting:', error);
    toast.error('Failed to disconnect');
  }
};

  const filteredSquads = allSquads?.filter(squad => 
    squad.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Effects
  useEffect(() => {
    if (isConnected && chain) {
      setIsCorrectNetwork(chain.id === 97);
      if (chain.id !== 97) toast.error('Switch to BSC Testnet');
    }
  }, [isConnected, chain]);

  useEffect(() => {
    if (isConnected && isCorrectNetwork) {
      const interval = setInterval(() => {
        refetchLeaderboard();
        refetchSquad();
        refetchSubmissions();
        refetchUserSubs();
        setRefreshBadges(prev => prev + 1);
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [isConnected, isCorrectNetwork, refetchLeaderboard, refetchSquad, refetchSubmissions, refetchUserSubs]);

  useEffect(() => {
    fetchDailyChallenge();
    const interval = setInterval(fetchDailyChallenge, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (userProfile?.[0]) {
      fetchSquadChallenge(userProfile[0]);
    }
  }, [userProfile?.[0]]);

  const renderContent = () => {
    switch(activeTab) {
      case 'home':
        return (
          <div className="home-content">
            {/* Wallet Info Bar */}
            <div className="wallet-info-bar">
              <div className="wallet-address">
                <span className="wallet-label">Connected:</span>
                <span className="wallet-value">{formatAddress(address)}</span>
              </div>
              <button className="disconnect-btn" onClick={handleDisconnect}>
                Disconnect
              </button>
            </div>

            {/* Greeting Section */}
            <div className="greeting-section">
              <h1 className="greeting">{getGreeting()}, Reader! 👋</h1>
              <p className="sub-greeting">Ready for today's reading challenge?</p>
            </div>

            {/* User Dashboard - Compact */}
            <div className="compact-dashboard">
              <div className="dashboard-card">
                <div className="dashboard-header">
                  <span className="squad-badge">{userProfile?.[0] || 'No Squad'}</span>
                  <span className="points-badge">{userProfile?.[1]?.toString() || '0'} pts</span>
                </div>
                <div className="dashboard-stats">
                  <div className="stat-item">
                    <span className="stat-value">{userProfile?.[3]?.toString() || '0'}</span>
                    <span className="stat-label">Submissions</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{badgeCount || '0'}</span>
                    <span className="stat-label">Badges</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{leaderboard?.[0]?.length || '0'}</span>
                    <span className="stat-label">Squads</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions-grid">
              <button className="quick-action-card squads" onClick={() => setActiveTab('squads')}>
                <span className="action-icon">👥</span>
                <span className="action-title">Browse Squads</span>
                <span className="action-subtitle">Find your community</span>
              </button>
              
              <button className="quick-action-card daily" onClick={() => setActiveTab('daily')}>
                <span className="action-icon">🗓️</span>
                <span className="action-title">Daily Challenge</span>
                <span className="action-subtitle">Complete today's task</span>
              </button>
              
              <button className="quick-action-card monthly" onClick={() => setActiveTab('monthly')}>
                <span className="action-icon">📚</span>
                <span className="action-title">Monthly Book</span>
                <span className="action-subtitle">Join & win prizes</span>
              </button>
              
              <button className="quick-action-card feed" onClick={() => setActiveTab('feed')}>
                <span className="action-icon">📱</span>
                <span className="action-title">Activity Feed</span>
                <span className="action-subtitle">See what's new</span>
              </button>
              
              <button className="quick-action-card profile" onClick={() => setActiveTab('profile')}>
                <span className="action-icon">👤</span>
                <span className="action-title">Your Profile</span>
                <span className="action-subtitle">View achievements</span>
              </button>
            </div>

            {/* Recent Activity Preview */}
            {userSubmissions && userSubmissions.length > 0 && (
              <div className="recent-preview">
                <h3>Recent Activity</h3>
                {userSubmissions.slice(0, 2).map((sub, i) => (
                  <div key={i} className="preview-item">
                    <TimeAgo timestamp={Number(sub.timestamp)} />
                    <p className="preview-quote">"{sub.quote.substring(0, 40)}..."</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'squads':
        return (
          <div className="screen-content">
            {/* Wallet Info Bar */}
            <div className="wallet-info-bar">
              <div className="wallet-address">
                <span className="wallet-label">Connected:</span>
                <span className="wallet-value">{formatAddress(address)}</span>
              </div>
              <button className="disconnect-btn" onClick={handleDisconnect}>
                Disconnect
              </button>
            </div>

            <div className="screen-header">
              <h2>👥 All Squads</h2>
              <p className="header-subtitle">Find your reading community</p>
            </div>
            
            {/* Create Squad Card - Only show if user has no squad */}
            {!userProfile?.[0] && (
              <div className="create-squad-card">
                <h3>✨ Create Your Own Squad</h3>
                <p>Start your reading journey with like-minded people</p>
                <button 
                  className="button primary"
                  onClick={() => {
                    document.querySelector('.squad-setup')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Create Squad
                </button>
              </div>
            )}

            {/* Search Bar */}
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="🔍 Search squads by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Squads List */}
            <div className="squads-list">
              {squadsLoading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Loading squads...</p>
                </div>
              ) : filteredSquads && filteredSquads.length > 0 ? (
                filteredSquads.map((squad, index) => {
                  const isCurrentUserSquad = userProfile?.[0] === squad;
                  
                  return (
                    <div key={index} className="squad-card">
                      <div className="squad-card-header">
                        <div className="squad-avatar">
                          {squad.charAt(0).toUpperCase()}
                        </div>
                        <div className="squad-info">
                          <h3 className="squad-name">{squad}</h3>
                          {isCurrentUserSquad && (
                            <span className="current-badge">Your Squad</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="squad-card-footer">
                        {isCurrentUserSquad ? (
                          <button 
                            className="button secondary small"
                            onClick={() => setActiveTab('profile')}
                          >
                            View Your Squad
                          </button>
                        ) : (
                          <button 
                            className="button primary small"
                            onClick={() => handleJoinSquad(squad)}
                            disabled={isJoining}
                          >
                            {isJoining && selectedSquad === squad ? 'Joining...' : 'Join Squad'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="empty-state">
                  <p>No squads found matching "{searchTerm}"</p>
                  <button 
                    className="button secondary"
                    onClick={() => setSearchTerm('')}
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </div>

            {/* Create Squad Section (if no squad) */}
            {!userProfile?.[0] && (
              <div className="squad-setup" id="squad-setup">
                <h3>✨ Create New Squad</h3>
                <input
                  type="text"
                  className="input"
                  value={squadName}
                  onChange={(e) => setSquadName(e.target.value)}
                  placeholder="Squad name (3-32 chars)"
                  maxLength={32}
                />
                
                <div className="category-grid">
                  {categories.map(cat => (
                    <div
                      key={cat.id}
                      className={`category-item ${selectedCategory === cat.id ? 'selected' : ''}`}
                      onClick={() => setSelectedCategory(cat.id)}
                    >
                      <span>{cat.emoji}</span>
                      <span>{cat.name}</span>
                    </div>
                  ))}
                </div>
                
                <button 
                  className="button primary"
                  onClick={handleCreateSquad}
                  disabled={isCreating || !squadName || !selectedCategory}
                >
                  {isCreating ? 'Creating...' : 'Create Squad'}
                </button>
              </div>
            )}
          </div>
        );

      case 'daily':
        return (
          <div className="screen-content">
            {/* Wallet Info Bar */}
            <div className="wallet-info-bar">
              <div className="wallet-address">
                <span className="wallet-label">Connected:</span>
                <span className="wallet-value">{formatAddress(address)}</span>
              </div>
              <button className="disconnect-btn" onClick={handleDisconnect}>
                Disconnect
              </button>
            </div>

            <div className="screen-header">
              <h2>🗓️Daily Challenge</h2>
            </div>
            
            {showAIGenerator && (
              <AIQuoteGenerator 
                onQuoteGenerated={(aiQuote) => {
                  setQuote(aiQuote);
                  toast.success('✨ AI quote added!');
                  setShowAIGenerator(false);
                }}
              />
            )}
  
            <DailyChallenge 
              challenge={squadChallenge || todaysChallenge}
              loading={challengeLoading}
              onRefresh={() => {
                if (userProfile?.[0]) {
                  fetchSquadChallenge(userProfile[0]);
                } else {
                  fetchDailyChallenge();
                }
              }}
              squadName={userProfile?.[0]}
              onSubmit={handleSubmitChallenge}
              photo={photo}
              setPhoto={setPhoto}
              quote={quote}
              setQuote={setQuote}
              photoPreview={photoPreview}
              setPhotoPreview={setPhotoPreview}
              isUploading={isUploading}
              isSubmitting={isSubmitting}
            />
          </div>
        );

      case 'monthly':
        return (
          <div className="screen-content">
            {/* Wallet Info Bar */}
            <div className="wallet-info-bar">
              <div className="wallet-address">
                <span className="wallet-label">Connected:</span>
                <span className="wallet-value">{formatAddress(address)}</span>
              </div>
              <button className="disconnect-btn" onClick={handleDisconnect}>
                Disconnect
              </button>
            </div>

            <div className="screen-header">
              <h2>📚 Monthly Challenge</h2>
            </div>
            <MonthlyChallenge />
          </div>
        );

      case 'feed':
        return (
          <div className="screen-content">
            {/* Wallet Info Bar */}
            <div className="wallet-info-bar">
              <div className="wallet-address">
                <span className="wallet-label">Connected:</span>
                <span className="wallet-value">{formatAddress(address)}</span>
              </div>
              <button className="disconnect-btn" onClick={handleDisconnect}>
                Disconnect
              </button>
            </div>

            <div className="screen-header">
              <h2>📱 Activity Feed</h2>
            </div>
            <SubmissionFeed 
              squadName={userProfile[0]}
              submissions={submissions}
              onVerify={handleVerify}
              currentUser={address}
            />
          </div>
        );

      case 'profile':
        return (
          <div className="screen-content">
            {/* Wallet Info Bar */}
            <div className="wallet-info-bar">
              <div className="wallet-address">
                <span className="wallet-label">Connected:</span>
                <span className="wallet-value">{formatAddress(address)}</span>
              </div>
              <button className="disconnect-btn" onClick={handleDisconnect}>
                Disconnect
              </button>
            </div>

            <div className="screen-header">
              <h2>👤 Your Profile</h2>
            </div>
            
            <div className="profile-section">
              <SquadSwitcher 
                currentSquad={userProfile?.[0]}
                allSquads={allSquads}
                onJoinSquad={handleJoinSquad}
                onLeaveSquad={handleLeaveSquad}
                squadDetails={squadDetails}
              />
              
              <UserDashboard 
                userProfile={userProfile}
                squadDetails={squadDetails}
                submissions={userSubmissions}
              />
              
              <BadgeDisplay 
                userBadges={userBadges}
                badgeCount={badgeCount}
                totalSupply={badgesTotalSupply}
                hasFirstBadge={hasFirstBadge}
                refreshTrigger={refreshBadges}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

 // ─────────────────────────────────────────────────────────────────────────────
// DROP-IN REPLACEMENT for the  if (!isConnected)  block in App.js
// (everything between  if (!isConnected) {  and the closing  }  )
// ─────────────────────────────────────────────────────────────────────────────

if (!isConnected) {
  return (
    <div className="app-container">
      <div className="welcome-screen">

        {/* ── Decorative grid overlay ── */}
        <div className="welcome-grid" aria-hidden="true" />

        {/* ── Floating particles ── */}
        <div className="welcome-particles" aria-hidden="true">
          {Array.from({ length: 12 }).map((_, i) => <span key={i} />)}
        </div>

        {/* ── Main card ── */}
        <div className="welcome-card">

          {/* Logo icon with orbiting ring */}
          <div className="welcome-logo" aria-hidden="true">📚</div>

          {/* Live / chain tag */}
          <div className="welcome-tag">Live on BNB Chain Testnet</div>

          {/* Title */}
          <h1 className="app-title">SquadBNB</h1>

          {/* Subtitle */}
          <p className="app-subtitle">
            Read together. Earn rewards.<br />
            <strong>On-chain book challenges</strong> for curious minds.
          </p>

          {/* Quick-glance stats */}
          <div className="welcome-stats">
            <div className="welcome-stat">
              <span className="welcome-stat-value">100+</span>
              <span className="welcome-stat-label">Readers</span>
            </div>
            <div className="welcome-stat-divider" />
            <div className="welcome-stat">
              <span className="welcome-stat-value">6</span>
              <span className="welcome-stat-label">Genres</span>
            </div>
            <div className="welcome-stat-divider" />
            <div className="welcome-stat">
              <span className="welcome-stat-value">NFT</span>
              <span className="welcome-stat-label">Badges</span>
            </div>
          </div>

          {/* Feature pills */}
          <div className="welcome-features">
            <div className="feature-pill"><span>📅</span> Daily Challenges</div>
            <div className="feature-pill"><span>🏆</span> Leaderboard</div>
            <div className="feature-pill"><span>🎖️</span> NFT Badges</div>
            <div className="feature-pill"><span>🤖</span> AI Quotes</div>
          </div>

          {/* Connect button — glow wrapper keeps the original AppKitButton untouched */}
          <div className="connect-wrapper">
            <AppKitButton />
          </div>

          {/* Footer note */}
          <p className="welcome-footer">
            Powered by BNB Smart Chain · IPFS storage via Pinata<br />
            No accounts. No passwords. Just your wallet.
          </p>

        </div>{/* /welcome-card */}
      </div>
    </div>
  );
}

  if (!isCorrectNetwork) {
    return (
      <div className="app-container">
        <div className="network-warning">
          <h2>⚠️ Wrong Network</h2>
          <p>Current: {chain?.name} (ID: {chain?.id})</p>
          <p>Please switch to BSC Testnet</p>
          <button className="button primary" onClick={handleNetworkSwitch}>
            Switch Network
          </button>
        </div>
      </div>
    );
  }

  // ============ MAIN APP WITH BOTTOM NAV ============
  return (
    <div className="app-with-bottom-nav">
      {/* CHATBOT - ALWAYS VISIBLE ON ALL TABS */}
      {userProfile?.[0] && (
        <>
          <button 
            className="chatbot-floating-btn"
            onClick={() => setShowChatbot(!showChatbot)}
          >
            {showChatbot ? '✕' : '💬'}
          </button>
          
          {showChatbot && (
            <Chatbot onClose={() => setShowChatbot(false)} />
          )}
        </>
      )}

      {/* Main Content Area */}
      <main className="main-content">
        {renderContent()}
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="bottom-nav six-tabs">
        <button 
          className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          <span className="nav-icon">🏠</span>
          <span className="nav-label">Home</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'squads' ? 'active' : ''}`}
          onClick={() => setActiveTab('squads')}
        >
          <span className="nav-icon">👥</span>
          <span className="nav-label">Squads</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'daily' ? 'active' : ''}`}
          onClick={() => setActiveTab('daily')}
        >
          <span className="nav-icon">🗓️</span>
          <span className="nav-label">Daily</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'monthly' ? 'active' : ''}`}
          onClick={() => setActiveTab('monthly')}
        >
          <span className="nav-icon">📚</span>
          <span className="nav-label">Monthly</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'feed' ? 'active' : ''}`}
          onClick={() => setActiveTab('feed')}
        >
          <span className="nav-icon">📱</span>
          <span className="nav-label">Feed</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <span className="nav-icon">👤</span>
          <span className="nav-label">Profile</span>
        </button>
      </nav>
    </div>
  );
}

export default App;