// LandingPage.jsx
import React, { useState, useEffect } from 'react';
import './LandingPage.css';

const LandingPage = () => {
  const [stats, setStats] = useState({
    users: 0,
    squads: 0,
    challenges: 0
  });

  // Animate stats on load
  useEffect(() => {
    const animateStats = () => {
      let users = 0;
      let squads = 0;
      let challenges = 0;
      
      const interval = setInterval(() => {
        if (users < 500) users += 10;
        if (squads < 50) squads += 1;
        if (challenges < 10000) challenges += 200;
        
        setStats({ users, squads, challenges });
        
        if (users >= 500 && squads >= 50 && challenges >= 10000) {
          clearInterval(interval);
        }
      }, 20);
    };
    
    animateStats();
  }, []);

  return (
    <div className="landing-container">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-logo">
          <span className="logo-icon">📚</span>
          <span className="logo-text">ChainLit</span>
        </div>
        
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#squads">Squads</a>
          <a href="#roadmap">Roadmap</a>
        </div>
        
        <div className="nav-buttons">
          <button className="btn-secondary">Read Deck</button>
          <button className="btn-primary">Open in Telegram</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-badge">🚀 Now Live on Telegram</div>
        <h1 className="hero-title">
          Read Together.<br />
          <span className="gradient-text">Earn On-Chain.</span>
        </h1>
        
        <p className="hero-subtitle">
          ChainLit turns reading into a social, verifiable experience. Join squads, 
          complete daily challenges, and earn NFT badges — all inside Telegram.
        </p>
        
        <div className="hero-buttons">
          <button className="btn-primary btn-large">
            <span>📱 Open in Telegram</span>
            <span className="btn-arrow">→</span>
          </button>
          
          <button className="btn-secondary btn-large">
            <span>📄 Read the Deck</span>
          </button>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.users}+</div>
            <div className="stat-label">Early Users</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value">{stats.squads}+</div>
            <div className="stat-label">Active Squads</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value">{stats.challenges.toLocaleString()}+</div>
            <div className="stat-label">Challenges Completed</div>
          </div>
        </div>

        {/* Preview Image */}
        <div className="hero-preview">
          <img 
            src="/api/placeholder/1200/600" 
            alt="ChainLit App Preview"
            className="preview-image"
          />
          <div className="preview-overlay">
            <div className="preview-badge">✨ Live Demo</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="section-header">
          <h2>Everything You Need to <span className="gradient-text">Read Socially</span></h2>
          <p>Join a squad, earn rewards, and build your on-chain reading resume</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Join Squads</h3>
            <p>Create or join book clubs with friends. Vote on books, share insights, and grow together.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>Daily Challenges</h3>
            <p>Fresh AI-generated challenges every day. Share quotes, photos, and stories.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🏆</div>
            <h3>Earn Badges</h3>
            <p>Collect NFT badges for achievements. Build your verifiable reading resume.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚔️</div>
            <h3>Squad Battles</h3>
            <p>Compete with other squads. Winner takes all — glory and rewards!</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">✅</div>
            <h3>Peer Verification</h3>
            <p>Verify squadmates' submissions. Earn points for helping the community.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI Assistant</h3>
            <p>Get AI-generated quote ideas and challenge hints when you're stuck.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="how-it-works">
        <div className="section-header">
          <h2>How <span className="gradient-text">ChainLit</span> Works</h2>
        </div>

        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Join a Squad</h3>
              <p>Find your people. Join existing squads or create your own book club.</p>
              <div className="step-preview">👥 Fantasy Readers • 15 members</div>
            </div>
          </div>

          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Complete Challenges</h3>
              <p>Daily AI-generated challenges. Share photos, quotes, and insights.</p>
              <div className="step-preview">📸 "Share your cozy reading corner"</div>
            </div>
          </div>

          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Get Verified</h3>
              <p>Squadmates verify your submissions. Build trust and earn points.</p>
              <div className="step-preview">✅ 3 verifications • +10 points</div>
            </div>
          </div>

          <div className="step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>Earn Rewards</h3>
              <p>Collect NFT badges, climb leaderboards, battle other squads.</p>
              <div className="step-preview">🏆 Legendary Reader • 500 points</div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Demo Preview */}
      <section className="demo-preview">
        <div className="demo-content">
          <h2>See It <span className="gradient-text">In Action</span></h2>
          
          <div className="demo-grid">
            <div className="demo-card">
              <div className="demo-card-header">
                <span className="demo-badge">📱 Telegram Mini App</span>
              </div>
              <div className="demo-card-content">
                <div className="demo-squad">
                  <span className="squad-avatar">📚</span>
                  <div>
                    <div className="demo-label">Current Squad</div>
                    <div className="demo-value">Fantasy Readers</div>
                  </div>
                </div>
                
                <div className="demo-challenge">
                  <div className="demo-label">Today's Challenge</div>
                  <div className="challenge-preview">
                    "Share a quote that changed your perspective"
                  </div>
                </div>
                
                <div className="demo-stats">
                  <div>
                    <div className="stat-small">Points</div>
                    <div className="stat-value-small">157</div>
                  </div>
                  <div>
                    <div className="stat-small">Badges</div>
                    <div className="stat-value-small">12</div>
                  </div>
                  <div>
                    <div className="stat-small">Rank</div>
                    <div className="stat-value-small">#3</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="demo-card">
              <div className="demo-card-header">
                <span className="demo-badge">⚔️ Active Battle</span>
              </div>
              <div className="demo-card-content">
                <div className="battle-preview">
                  <div className="battle-squad">
                    <span>Fantasy Readers</span>
                    <span className="battle-score">234</span>
                  </div>
                  <div className="battle-vs">VS</div>
                  <div className="battle-squad">
                    <span>Philosophy Fans</span>
                    <span className="battle-score">198</span>
                  </div>
                </div>
                <div className="battle-timer">⏰ 23h left</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Squad Showcase */}
      <section id="squads" className="squads-showcase">
        <h2>Popular <span className="gradient-text">Squads</span></h2>
        
        <div className="squad-grid">
          {[
            { name: "Fantasy Readers", members: 47, emoji: "🐉", activity: "high" },
            { name: "Philosophy Club", members: 32, emoji: "🤔", activity: "medium" },
            { name: "Sci-Fi Addicts", members: 28, emoji: "🚀", activity: "high" },
            { name: "Romance Lovers", members: 23, emoji: "❤️", activity: "medium" },
            { name: "Mystery Solvers", members: 19, emoji: "🔍", activity: "low" },
            { name: "Self-Help", members: 15, emoji: "🌱", activity: "medium" }
          ].map((squad, i) => (
            <div key={i} className="squad-card">
              <div className="squad-emoji">{squad.emoji}</div>
              <h4>{squad.name}</h4>
              <div className="squad-meta">
                <span>👥 {squad.members} members</span>
                <span className={`activity-${squad.activity}`}>●</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h2>What <span className="gradient-text">Readers</span> Say</h2>
        
        <div className="testimonial-grid">
          <div className="testimonial-card">
            <div className="testimonial-avatar">👤</div>
            <p className="testimonial-text">
              "ChainLit made reading social again. My squad keeps me motivated, 
              and earning NFTs for my reading is just awesome!"
            </p>
            <div className="testimonial-author">
              <strong>Alex Chen</strong>
              <span>Fantasy Readers • 47 challenges</span>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-avatar">👤</div>
            <p className="testimonial-text">
              "The daily challenges are so creative! Been using it for 2 months 
              and never missed a day. Best Web3 app I've used."
            </p>
            <div className="testimonial-author">
              <strong>Sarah Miller</strong>
              <span>Philosophy Club • 62 challenges</span>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-avatar">👤</div>
            <p className="testimonial-text">
              "Squad battles are intense! Nothing beats the feeling of winning 
              against rival book clubs. Highly recommended!"
            </p>
            <div className="testimonial-author">
              <strong>Marcus Wong</strong>
              <span>Sci-Fi Addicts • 89 challenges</span>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section id="roadmap" className="roadmap">
        <h2>What's <span className="gradient-text">Coming</span></h2>
        
        <div className="roadmap-timeline">
          <div className="roadmap-item completed">
            <div className="roadmap-marker">✅</div>
            <div className="roadmap-content">
              <h4>Squads & Daily Challenges</h4>
              <p>Create squads, complete AI-generated challenges</p>
            </div>
          </div>

          <div className="roadmap-item completed">
            <div className="roadmap-marker">✅</div>
            <div className="roadmap-content">
              <h4>NFT Badges</h4>
              <p>Earn verifiable on-chain achievements</p>
            </div>
          </div>

          <div className="roadmap-item in-progress">
            <div className="roadmap-marker">⚡</div>
            <div className="roadmap-content">
              <h4>Squad Battles</h4>
              <p>Compete with other squads for rewards</p>
              <span className="roadmap-date">Coming in 2 weeks</span>
            </div>
          </div>

          <div className="roadmap-item">
            <div className="roadmap-marker">🔜</div>
            <div className="roadmap-content">
              <h4>READ Token</h4>
              <p>Earn tokens for reading and verifying</p>
            </div>
          </div>

          <div className="roadmap-item">
            <div className="roadmap-marker">🔜</div>
            <div className="roadmap-content">
              <h4>DAO Governance</h4>
              <p>Vote on book selections and squad rules</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Start Your Reading Journey Today</h2>
          <p>Join 500+ readers already earning on-chain</p>
          
          <div className="cta-buttons">
            <button className="btn-primary btn-large">
              <span>📱 Open in Telegram</span>
            </button>
            
            <button className="btn-secondary btn-large">
              <span>📄 Read Documentation</span>
            </button>
          </div>

          <div className="cta-features">
            <span>✨ No wallet required to start</span>
            <span>🎯 Free to join</span>
            <span>⚡ Instant squad creation</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <span className="logo-icon">📚</span>
            <span className="logo-text">ChainLit</span>
          </div>
          
          <div className="footer-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#squads">Squads</a>
            <a href="#roadmap">Roadmap</a>
          </div>
          
          <div className="footer-social">
            <a href="#" className="social-link">𝕏</a>
            <a href="#" className="social-link">💬</a>
            <a href="#" className="social-link">📱</a>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2026 ChainLit. Read together, earn on-chain.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;