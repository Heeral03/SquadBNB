import React from 'react';
import './SquadSwitcher.css';

const SquadSwitcher = ({ currentSquad, allSquads, onJoinSquad, onLeaveSquad, squadDetails }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const stats = {
    members: squadDetails?.[1]?.length || 0,
    submissions: squadDetails?.[2]?.length || 0,
    points: squadDetails?.[3] || 0,
  };

  return (
    <div className="squad-switcher">
      <div className="current-squad" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="squad-card-bg"></div>
        <div className="squad-card-content">
          <div className="squad-avatar-container">
            <div className="squad-avatar-glow"></div>
            <div className="squad-avatar">
              <span className="squad-emoji">🏰</span>
            </div>
          </div>
          
          <div className="squad-details">
            <span className="squad-label">Current Squad</span>
            <h2 className="squad-name-display">{currentSquad}</h2>
            
            <div className="squad-mini-stats">
              <div className="mini-stat">
                <span className="mini-stat-icon">👥</span>
                <span className="mini-stat-value">{stats.members}</span>
              </div>
              <div className="mini-stat-divider"></div>
              <div className="mini-stat">
                <span className="mini-stat-icon">📚</span>
                <span className="mini-stat-value">{stats.submissions}</span>
              </div>
              <div className="mini-stat-divider"></div>
              <div className="mini-stat">
                <span className="mini-stat-icon">💎</span>
                <span className="mini-stat-value">{stats.points.toString()}</span>
              </div>
            </div>
          </div>
          
          <div className="expand-indicator">
            <span className={`expand-arrow ${isExpanded ? 'expanded' : ''}`}>▼</span>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="squad-dropdown">
          <div className="dropdown-header">
            <h4 className="dropdown-title">Switch Squad</h4>
            <button 
              className="leave-button"
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('Leave current squad?')) {
                  onLeaveSquad();
                  setIsExpanded(false);
                }
              }}
            >
              <span className="leave-icon">🚪</span>
              <span>Leave Squad</span>
            </button>
          </div>

          <div className="available-squads">
            {allSquads?.filter(squad => squad !== currentSquad).map((squad, i) => (
              <div 
                key={i} 
                className="available-squad-item"
                onClick={() => {
                  onJoinSquad(squad);
                  setIsExpanded(false);
                }}
              >
                <div className="available-squad-icon">🏰</div>
                <span className="available-squad-name">{squad}</span>
                <span className="join-arrow">→</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SquadSwitcher;