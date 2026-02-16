// components/DailyChallenge.jsx - WITH REAL-TIME DATES
import React, { useState, useEffect } from 'react';
import './DailyChallenge.css';

const DailyChallenge = ({ 
  challenge, 
  loading, 
  onRefresh,
  onSubmit, 
  isSubmitting, 
  photo, 
  setPhoto, 
  quote, 
  setQuote, 
  photoPreview, 
  setPhotoPreview 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [timeUntilNext, setTimeUntilNext] = useState('');
  

  // Update current date every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Calculate time until next challenge (midnight)
  useEffect(() => {
    const calculateTimeUntilNext = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const diff = tomorrow - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeUntilNext(`${hours}h ${minutes}m ${seconds}s`);
    };

    calculateTimeUntilNext();
    const timer = setInterval(calculateTimeUntilNext, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Format date display
  const formatDate = (date) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      alert('Image too large (max 5MB)');
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image');
      return;
    }
    
    setPhoto(file);
    
    const reader = new FileReader();
    reader.onload = (event) => setPhotoPreview(event.target.result);
    reader.readAsDataURL(file);
  };

  const clearPhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="daily-challenge">
        <div className="challenge-loading">
          <div className="spinner"></div>
          <p>Loading today's challenge...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="daily-challenge">
      {/* Date Header */}
      <div className="challenge-date-header">
        <div className="date-info">
          <div className="current-date">
            <span className="date-icon">🗓️</span>
            <span className="date-text">{formatDate(currentDate)}</span>
          </div>
          <div className="current-time">
            <span className="time-icon">⏰</span>
            <span className="time-text">{formatTime(currentDate)}</span>
          </div>
        </div>
      

      </div>

      <div className="challenge-header-section">
        <div className="challenge-icon-wrapper">
          <span className="challenge-icon">{challenge?.emoji || '📖'}</span>
          <div className="icon-glow"></div>
        </div>
        <div className="challenge-header-content">
          <h3 className="challenge-title">Daily Challenge</h3>
          {challenge && (
            <div className="challenge-prompt">
              <span className="challenge-category">{challenge.category}</span>
              <p className="challenge-question">{challenge.prompt || challenge.description}</p>
              {challenge.requiresPhoto && (
                <span className="photo-required">📸 Photo required for this challenge</span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="challenge-form">
        {/* Photo Upload */}
        <div className="upload-section">
          <label className="upload-label">
            <span className="label-icon">📸</span>
            <span>Upload Photo</span>
          </label>
          
          {!photoPreview ? (
            <div 
              className="upload-zone"
              onClick={() => document.getElementById('photo-input')?.click()}
            >
              <div className="upload-icon-large">📚</div>
              <p className="upload-text">Click to upload your book photo</p>
              <p className="upload-hint">Max size: 5MB</p>
              <input
                id="photo-input"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{ display: 'none' }}
              />
            </div>
          ) : (
            <div className="photo-preview-container">
              <img src={photoPreview} alt="Preview" className="photo-preview" />
              <div className="preview-overlay">
                <button 
                  className="change-photo-btn"
                  onClick={clearPhoto}
                  type="button"
                >
                  <span className="btn-icon">🔄</span>
                  <span>Change Photo</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quote Input */}
        <div className="quote-section">
          <label className="quote-label">
            <span className="label-icon">✍️</span>
            <span>Your Response</span>
          </label>
          
          <div className="quote-input-wrapper">
            <div className="quote-decoration quote-decoration-top">❝</div>
            <textarea
              className="quote-textarea"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder={challenge?.prompt ? "Write your response here..." : "Write a meaningful quote from your reading..."}
              rows="4"
            />
            <div className="quote-decoration quote-decoration-bottom">❞</div>
          </div>
          
          <div className="character-count">
            <span className={quote.length > 500 ? 'count-warning' : ''}>
              {quote.length}
            </span>
            <span className="count-separator">/</span>
            <span className="count-max">500</span>
          </div>
        </div>

        {/* Submit Button */}
        <button 
          className="submit-challenge-btn"
          onClick={onSubmit}
          disabled={isSubmitting || !photo || !quote || quote.length > 500}
        >
          {isSubmitting ? (
            <>
              <span className="spinner"></span>
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <span className="btn-icon">✨</span>
              <span>Submit Challenge</span>
            </>
          )}
        </button>

        {/* Tips */}
        <div className="challenge-tips">
          <div className="tip-icon">💡</div>
          <div className="tip-content">
            <p className="tip-title">Pro Tips:</p>
            <ul className="tip-list">
              <li>Clear, well-lit photos work best</li>
              <li>Include the book cover in frame</li>
              <li>Answer the challenge prompt thoughtfully</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyChallenge;