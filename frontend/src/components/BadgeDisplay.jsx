import React, { useState } from 'react';
import './BadgeDisplay.css';

const BadgeDisplay = ({ userBadges, badgeCount, totalSupply, hasFirstBadge, refreshTrigger }) => {
  const [copiedId, setCopiedId] = useState(null);
  const CONTRACT_ADDRESS = '0x5Fb509c6bEdf3a5dB0c63ac8E0f44dd79998D2Bf';

  // Parse userBadges if it's a string
  let parsedUserBadges = userBadges;
  if (typeof userBadges === 'string') {
    try {
      parsedUserBadges = JSON.parse(userBadges);
    } catch (e) {
      console.error('Failed to parse userBadges:', e);
    }
  }

  const badges = [
    {
      id: 0,
      name: 'First Steps',
      icon: '📖',
      description: 'Complete your first submission',
      threshold: 1,
      color: 'bronze',
      gradient: 'linear-gradient(135deg, #cd7f32 0%, #b87333 100%)',
      glowColor: 'rgba(205, 127, 50, 0.4)'
    },
    {
      id: 1,
      name: 'Book Worm',
      icon: '🐛',
      description: 'Complete 5 submissions',
      threshold: 5,
      color: 'silver',
      gradient: 'linear-gradient(135deg, #c0c0c0 0%, #a8a8a8 100%)',
      glowColor: 'rgba(192, 192, 192, 0.4)'
    },
    {
      id: 2,
      name: 'Scholar',
      icon: '🎓',
      description: 'Complete 10 submissions',
      threshold: 10,
      color: 'gold',
      gradient: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%)',
      glowColor: 'rgba(255, 215, 0, 0.5)'
    },
    {
      id: 3,
      name: 'Sage',
      icon: '🧙',
      description: 'Complete 25 submissions',
      threshold: 25,
      color: 'platinum',
      gradient: 'linear-gradient(135deg, #e5e4e2 0%, #d4d4d4 50%, #e5e4e2 100%)',
      glowColor: 'rgba(229, 228, 226, 0.4)'
    },
    {
      id: 4,
      name: 'Master Reader',
      icon: '👑',
      description: 'Complete 50 submissions',
      threshold: 50,
      color: 'diamond',
      gradient: 'linear-gradient(135deg, #b9f2ff 0%, #89f7fe 50%, #66a6ff 100%)',
      glowColor: 'rgba(102, 166, 255, 0.5)'
    },
    {
      id: 5,
      name: 'Legend',
      icon: '⭐',
      description: 'Complete 100 submissions',
      threshold: 100,
      color: 'legendary',
      gradient: 'linear-gradient(135deg, #ffd700 0%, #ff6b6b 50%, #a855f7 100%)',
      glowColor: 'rgba(168, 85, 247, 0.6)'
    }
  ];

  const submissionCount = badgeCount ? Number(badgeCount) : 0;

  const isBadgeEarned = (threshold) => {
    return submissionCount >= threshold;
  };

  const getProgressPercentage = (threshold) => {
    if (submissionCount >= threshold) return 100;
    const prevThreshold = badges.find(b => b.threshold < threshold)?.threshold || 0;
    const progress = ((submissionCount - prevThreshold) / (threshold - prevThreshold)) * 100;
    return Math.max(0, Math.min(100, progress));
  };

  const getTokenIdForBadge = (badgeId) => {
    if (parsedUserBadges && Array.isArray(parsedUserBadges) && parsedUserBadges.length > 0) {
      const expectedTokenId = badgeId + 1;
      const matchingToken = parsedUserBadges.find(id => Number(id) === expectedTokenId);
      
      if (matchingToken) {
        return matchingToken.toString();
      }
      
      if (badgeId === 0 && parsedUserBadges.length > 0) {
        return parsedUserBadges[0].toString();
      }
    }
    
    if (badgeId === 0 && hasFirstBadge) {
      return "1";
    }
    
    if (submissionCount >= badges[badgeId].threshold) {
      return (badgeId + 1).toString();
    }
    
    return null;
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const earnedBadges = badges.filter(badge => isBadgeEarned(badge.threshold)).length;
  const overallProgress = Math.min(100, (submissionCount / 100) * 100);

  return (
    <div className="badge-display">
      <div className="badge-background-pattern"></div>
      
      {/* Header Section */}
      <div className="badge-header">
        <div className="badge-header-left">
          <div className="badge-icon-large">
            <span className="trophy-icon">🏆</span>
            <div className="trophy-glow"></div>
          </div>
          <div className="badge-header-text">
            <h2 className="badge-main-title">Achievement Badges</h2>
            <p className="badge-subtitle">Track your reading journey</p>
          </div>
        </div>
        <div className="badge-stats-card">
          <div className="stats-number">
            <span className="stats-earned">{earnedBadges}</span>
            <span className="stats-divider">/</span>
            <span className="stats-total">{badges.length}</span>
          </div>
          <div className="stats-label">Unlocked</div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="progress-section">
        <div className="progress-header">
          <div className="progress-info">
            <span className="progress-title">Overall Progress</span>
            <span className="progress-submissions">{submissionCount} submissions</span>
          </div>
          <div className="progress-percent">{Math.round(overallProgress)}%</div>
        </div>
        <div className="progress-bar-wrapper">
          <div className="progress-bar-track">
            <div 
              className="progress-bar-fill"
              style={{ width: `${overallProgress}%` }}
            >
              <div className="progress-shimmer"></div>
            </div>
          </div>
          <div className="progress-milestones">
            {[25, 50, 75, 100].map(milestone => (
              <div 
                key={milestone}
                className={`milestone ${submissionCount >= milestone ? 'reached' : ''}`}
                style={{ left: `${milestone}%` }}
              >
                <div className="milestone-marker"></div>
                <span className="milestone-label">{milestone}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="badges-container">
        <div className="section-header">
          <h3 className="section-title">Your Badges</h3>
          <span className="section-count">{earnedBadges} earned</span>
        </div>
        
        <div className="badge-grid">
          {badges.map((badge) => {
            const earned = isBadgeEarned(badge.threshold);
            const progress = getProgressPercentage(badge.threshold);
            const tokenId = getTokenIdForBadge(badge.id);
            
            return (
              <div 
                key={badge.id} 
                className={`badge-card ${earned ? 'earned' : 'locked'}`}
                data-tier={badge.color}
              >
                {/* Badge Glow Effects */}
                <div className="badge-glow-bg" style={earned ? { 
                  background: `radial-gradient(circle at 50% 0%, ${badge.glowColor}, transparent 70%)`
                } : {}}></div>
                
                {/* Badge Icon */}
                <div className="badge-icon-wrapper">
                  <div 
                    className="badge-icon-circle"
                    style={earned ? { 
                      background: badge.gradient,
                      boxShadow: `0 8px 32px ${badge.glowColor}, 0 0 0 3px rgba(255, 255, 255, 0.1)`
                    } : {}}
                  >
                    <span className="badge-emoji">{badge.icon}</span>
                  </div>
                  {earned && (
                    <div className="badge-checkmark">
                      <svg viewBox="0 0 16 16" fill="none">
                        <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                  {!earned && progress > 0 && (
                    <div className="badge-progress-ring">
                      <svg viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8"/>
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="45" 
                          fill="none" 
                          stroke="url(#gradient)" 
                          strokeWidth="8"
                          strokeDasharray={`${progress * 2.827} 283`}
                          strokeLinecap="round"
                          transform="rotate(-90 50 50)"
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#8b5cf6"/>
                            <stop offset="100%" stopColor="#d4af37"/>
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  )}
                </div>

                {/* Badge Content */}
                <div className="badge-content">
                  <h4 className="badge-name">{badge.name}</h4>
                  <p className="badge-description">{badge.description}</p>
                  
                  {/* Progress Bar for Locked Badges */}
                  {!earned && (
                    <div className="badge-progress-section">
                      <div className="progress-mini-bar">
                        <div 
                          className="progress-mini-fill"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <div className="progress-mini-text">
                        <span className="progress-current">{submissionCount}</span>
                        <span className="progress-separator">/</span>
                        <span className="progress-goal">{badge.threshold}</span>
                      </div>
                    </div>
                  )}

                  {/* Earned Badge Info */}
                  {earned && (
                    <div className="badge-earned-section">
                      <div className="earned-badge-indicator">
                        <span className="sparkle-left">✨</span>
                        <span className="unlocked-text">Unlocked!</span>
                        <span className="sparkle-right">✨</span>
                      </div>
                      
                      {/* NFT Info Card */}
                      {tokenId && (
                        <div className="nft-info-card">
                          <div className="nft-row">
                            <span className="nft-label">
                              <svg className="nft-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="18" height="18" rx="2"/>
                                <circle cx="8.5" cy="8.5" r="1.5"/>
                                <path d="M21 15l-5-5L5 21"/>
                              </svg>
                              Token ID
                            </span>
                            <div className="nft-value-group">
                              <code className="nft-value">#{tokenId}</code>
                              <button 
                                className={`copy-button ${copiedId === `token-${badge.id}` ? 'copied' : ''}`}
                                onClick={() => copyToClipboard(tokenId, `token-${badge.id}`)}
                                aria-label="Copy token ID"
                              >
                                {copiedId === `token-${badge.id}` ? (
                                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M13.5 4.5L6 12L2.5 8.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                ) : (
                                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <rect x="5" y="5" width="9" height="9" rx="1.5"/>
                                    <path d="M3 11V3a2 2 0 0 1 2-2h8"/>
                                  </svg>
                                )}
                              </button>
                            </div>
                          </div>
                          
                          <div className="nft-contract-row">
                            <span className="contract-label">Contract:</span>
                            <code className="contract-address">
                              {CONTRACT_ADDRESS.slice(0, 6)}...{CONTRACT_ADDRESS.slice(-4)}
                            </code>
                            <button 
                              className={`copy-button ${copiedId === `contract-${badge.id}` ? 'copied' : ''}`}
                              onClick={() => copyToClipboard(CONTRACT_ADDRESS, `contract-${badge.id}`)}
                              aria-label="Copy contract address"
                            >
                              {copiedId === `contract-${badge.id}` ? (
                                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M13.5 4.5L6 12L2.5 8.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              ) : (
                                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                                  <rect x="5" y="5" width="9" height="9" rx="1.5"/>
                                  <path d="M3 11V3a2 2 0 0 1 2-2h8"/>
                                </svg>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="badge-footer">
        <div className="footer-decoration">
          <span className="footer-icon">📚</span>
          <div className="footer-sparkles">
            <span className="sparkle">✨</span>
            <span className="sparkle">✨</span>
            <span className="sparkle">✨</span>
          </div>
        </div>
        <p className="footer-message">
          Keep reading and verifying to unlock all badges and build your collection!
        </p>
      </div>
    </div>
  );
};

export default BadgeDisplay;