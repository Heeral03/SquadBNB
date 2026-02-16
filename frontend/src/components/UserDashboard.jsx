import React, { useState, useEffect } from 'react';
import './UserDashboard.css';

const UserDashboard = ({ userProfile, squadDetails, submissions }) => {
  const [animateStats, setAnimateStats] = useState(false);
  const [prevSubmissions, setPrevSubmissions] = useState(0);

  // Helper function to safely convert any value to number
  const toNumber = (value) => {
    if (value === null || value === undefined) return 0;
    if (typeof value === 'bigint') return Number(value);
    if (typeof value === 'string') return parseInt(value, 10) || 0;
    return Number(value) || 0;
  };

  // Safely process submissions
  const submissionsArray = Array.isArray(submissions) ? submissions : [];
  
  // Calculate detailed stats
  const stats = {
    submissions: submissionsArray.length,
    verified: submissionsArray.filter(s => s?.verified).length,
    pending: submissionsArray.filter(s => !s?.verified).length,
    points: squadDetails?.[2] ? toNumber(squadDetails[2]) : 0,
    // Calculate streak
    streak: (() => {
      if (!submissionsArray.length) return 0;
      const sorted = [...submissionsArray]
        .filter(s => s?.timestamp)
        .sort((a, b) => toNumber(b.timestamp) - toNumber(a.timestamp));
      
      let streak = 1;
      const oneDay = 86400; // seconds in a day
      
      for (let i = 1; i < sorted.length; i++) {
        const diff = toNumber(sorted[i-1].timestamp) - toNumber(sorted[i].timestamp);
        if (diff <= oneDay * 1.5) streak++;
        else break;
      }
      return streak;
    })(),
    // First submission time
    firstActive: submissionsArray.length > 0 
      ? Math.min(...submissionsArray.map(s => toNumber(s.timestamp)))
      : null,
  };

  // Calculate derived stats
  const completionRate = stats.submissions > 0 
    ? Math.round((stats.verified / stats.submissions) * 100) 
    : 0;

  const avgPoints = stats.submissions > 0 
    ? Math.round((stats.points / stats.submissions) * 10) / 10 
    : 0;

  const efficiency = stats.submissions > 0
    ? Math.round((stats.verified / stats.submissions) * stats.streak * 10) / 10
    : 0;

  // Trigger animation on new submissions
  useEffect(() => {
    if (prevSubmissions > 0 && stats.submissions > prevSubmissions) {
      setAnimateStats(true);
      setTimeout(() => setAnimateStats(false), 1000);
    }
    setPrevSubmissions(stats.submissions);
  }, [stats.submissions]);

  // Format date
  const memberSince = stats.firstActive 
    ? new Date(stats.firstActive * 1000).toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric' 
      })
    : 'Just joined';

  return (
    <div className="user-dashboard">
      {/* Hero Card with Dynamic Background */}
      <div className="hero-card">
        <div className="hero-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="hero-particle" 
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
        <div className="hero-background"></div>
        <div className="hero-content">
          <div className="user-avatar">
            <span className="avatar-emoji">📖</span>
            <div className="avatar-glow"></div>
            {stats.streak > 0 && (
              <div className="streak-badge">
                <span className="streak-fire">🔥</span>
                <span className="streak-count">{stats.streak}</span>
              </div>
            )}
          </div>
          <div className="user-info">
            <h2 className="user-title">Reader Stats</h2>
            <p className="user-address">
              {userProfile?.[0] ? 
                `${userProfile[0].slice(0, 15)}...` : 
                'Anonymous Reader'}
            </p>
            <div className="user-meta">
              <span className="member-since">📅 Member since {memberSince}</span>
            </div>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-value">{stats.streak}</span>
              <span className="hero-stat-label">Day Streak</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">{stats.points}</span>
              <span className="hero-stat-label">Total Points</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid with Micro-interactions */}
      <div className="stats-container">
        <div className={`stat-card-premium stat-submissions ${animateStats ? 'pulse' : ''}`}>
          <div className="stat-bg"></div>
          <div className="stat-content">
            <div className="stat-icon-wrapper">
              <span className="stat-icon">📚</span>
            </div>
            <div className="stat-details">
              <span className="stat-value">{stats.submissions}</span>
              <span className="stat-label">Submissions</span>
            </div>
          </div>
          <div className="stat-trend">
            <span className="trend-icon">📈</span>
            <span className="trend-value">{stats.submissions > 0 ? '+12%' : '0%'}</span>
          </div>
        </div>

        <div className={`stat-card-premium stat-verified ${stats.verified > 0 ? 'glow' : ''}`}>
          <div className="stat-bg"></div>
          <div className="stat-content">
            <div className="stat-icon-wrapper">
              <span className="stat-icon">✨</span>
            </div>
            <div className="stat-details">
              <span className="stat-value">{stats.verified}</span>
              <span className="stat-label">Verified</span>
            </div>
          </div>
          <div className="stat-badge">
            <span className="badge-icon">✓</span>
            <span className="badge-text">{completionRate}%</span>
          </div>
        </div>

        <div className="stat-card-premium stat-pending">
          <div className="stat-bg"></div>
          <div className="stat-content">
            <div className="stat-icon-wrapper">
              <span className="stat-icon">⏳</span>
            </div>
            <div className="stat-details">
              <span className="stat-value">{stats.pending}</span>
              <span className="stat-label">Pending</span>
            </div>
          </div>
        </div>

        <div className="stat-card-premium stat-points">
          <div className="stat-bg"></div>
          <div className="stat-content">
            <div className="stat-icon-wrapper">
              <span className="stat-icon">💎</span>
            </div>
            <div className="stat-details">
              <span className="stat-value">{stats.points}</span>
              <span className="stat-label">Points</span>
            </div>
          </div>
          <div className="stat-points-breakdown">
            <span className="breakdown-item">⚡ {avgPoints}/sub</span>
          </div>
        </div>
      </div>

      {/* Progress Section with Multiple Metrics */}
      <div className="progress-section">
        <div className="progress-header">
          <span className="progress-title">Reading Journey</span>
          <div className="progress-metrics">
            <span className="metric">
              <span className="metric-label">Efficiency</span>
              <span className="metric-value">{efficiency}</span>
            </span>
            <span className="metric">
              <span className="metric-label">Completion</span>
              <span className="metric-value">{completionRate}%</span>
            </span>
          </div>
        </div>
        
        <div className="progress-bar-container">
          <div className="progress-bar-wrapper">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${completionRate}%` }}
            >
              <div className="progress-shimmer"></div>
            </div>
          </div>
          <div className="progress-markers">
            <span className="marker" style={{ left: '25%' }}>25%</span>
            <span className="marker" style={{ left: '50%' }}>50%</span>
            <span className="marker" style={{ left: '75%' }}>75%</span>
          </div>
        </div>

        {/* Achievement Milestones */}
        <div className="achievement-grid">
          <div className={`achievement-card ${stats.submissions >= 1 ? 'unlocked' : 'locked'}`}>
            <div className="achievement-icon">🌱</div>
            <div className="achievement-info">
              <span className="achievement-name">First Steps</span>
              <span className="achievement-desc">1 submission</span>
            </div>
            {stats.submissions >= 1 && (
              <span className="achievement-check">✓</span>
            )}
          </div>

          <div className={`achievement-card ${stats.verified >= 1 ? 'unlocked' : 'locked'}`}>
            <div className="achievement-icon">✅</div>
            <div className="achievement-info">
              <span className="achievement-name">Verified Reader</span>
              <span className="achievement-desc">1 verification</span>
            </div>
            {stats.verified >= 1 && (
              <span className="achievement-check">✓</span>
            )}
          </div>

          <div className={`achievement-card ${stats.streak >= 3 ? 'unlocked' : 'locked'}`}>
            <div className="achievement-icon">🔥</div>
            <div className="achievement-info">
              <span className="achievement-name">On Fire</span>
              <span className="achievement-desc">3 day streak</span>
            </div>
            {stats.streak >= 3 && (
              <span className="achievement-check">✓</span>
            )}
          </div>

          <div className={`achievement-card ${stats.points >= 10 ? 'unlocked' : 'locked'}`}>
            <div className="achievement-icon">💎</div>
            <div className="achievement-info">
              <span className="achievement-name">Point Collector</span>
              <span className="achievement-desc">10 points</span>
            </div>
            {stats.points >= 10 && (
              <span className="achievement-check">✓</span>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats with Visual Indicators */}
      <div className="quick-stats">
        <div className="quick-stat-item">
          <div className="quick-stat-icon">🔥</div>
          <div className="quick-stat-content">
            <span className="quick-stat-value">{stats.streak}</span>
            <span className="quick-stat-label">Current Streak</span>
          </div>
          <div className="quick-stat-progress">
            <div className="streak-indicator">
              {[1,2,3,4,5].map(day => (
                <div 
                  key={day}
                  className={`streak-day ${stats.streak >= day ? 'active' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="quick-stat-divider"></div>

        <div className="quick-stat-item">
          <div className="quick-stat-icon">⚡</div>
          <div className="quick-stat-content">
            <span className="quick-stat-value">{avgPoints}</span>
            <span className="quick-stat-label">Avg Points</span>
          </div>
          <div className="quick-stat-progress">
            <div className="points-meter">
              <div 
                className="points-fill"
                style={{ width: `${(avgPoints / 10) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Next Milestone Card */}
      <div className="next-milestone">
        <div className="milestone-tracker">
          <span className="tracker-label">Next Milestone</span>
          <span className="tracker-value">
            {stats.submissions < 5 ? '🌿 5 Submissions' :
             stats.submissions < 10 ? '🌳 10 Submissions' :
             stats.submissions < 25 ? '👑 25 Submissions' :
             '✨ Master Reader'}
          </span>
        </div>
        <div className="milestone-progress">
          <div className="milestone-bar">
            <div 
              className="milestone-fill"
              style={{ 
                width: `${
                  stats.submissions < 5 ? (stats.submissions / 5) * 100 :
                  stats.submissions < 10 ? ((stats.submissions - 5) / 5) * 100 :
                  stats.submissions < 25 ? ((stats.submissions - 10) / 15) * 100 :
                  100
                }%`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;