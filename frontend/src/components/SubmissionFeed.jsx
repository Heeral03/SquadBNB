import React, { useState, useEffect } from 'react';
import './SubmissionFeed.css';

const SubmissionFeed = ({ squadName, submissions, onVerify, currentUser }) => {
  const [expandedImage, setExpandedImage] = useState(null);
  const [imageUrls, setImageUrls] = useState({});
  const [loadingImages, setLoadingImages] = useState({});

  // Helper functions
  const safeString = (value) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'bigint') return value.toString();
    if (typeof value === 'string') return value;
    return String(value);
  };

  const safeNumber = (value) => {
    if (value === null || value === undefined) return 0;
    if (typeof value === 'bigint') return Number(value);
    if (typeof value === 'string') return parseInt(value, 10) || 0;
    return Number(value) || 0;
  };

  // Fetch image from IPFS metadata
  const fetchImageFromMetadata = async (ipfsHash, index) => {
    if (imageUrls[index] || loadingImages[index]) return;

    setLoadingImages(prev => ({ ...prev, [index]: true }));

    const gateways = [
      'https://gateway.pinata.cloud/ipfs/',
      'https://ipfs.io/ipfs/',
      'https://cloudflare-ipfs.com/ipfs/'
    ];

    for (const gateway of gateways) {
      try {
        // First, fetch the metadata JSON
        const metadataUrl = `${gateway}${ipfsHash}`;
        const response = await fetch(metadataUrl);
        
        if (response.ok) {
          const metadata = await response.json();
          
          // Extract image hash from metadata
          const imageHash = metadata.imageIpfsHash || metadata.image;
          
          if (imageHash) {
            // Clean the hash (remove ipfs:// prefix if present)
            const cleanHash = imageHash.replace('ipfs://', '');
            const imageUrl = `${gateway}${cleanHash}`;
            
            setImageUrls(prev => ({ ...prev, [index]: imageUrl }));
            setLoadingImages(prev => ({ ...prev, [index]: false }));
            return;
          }
        }
      } catch (error) {
        console.log(`Gateway ${gateway} failed:`, error);
      }
    }

    setLoadingImages(prev => ({ ...prev, [index]: false }));
  };

  // Fetch images for all submissions
  useEffect(() => {
    if (!submissions?.length) return;

    submissions.forEach((sub, index) => {
      if (sub?.ipfsHash && !imageUrls[index] && !loadingImages[index]) {
        fetchImageFromMetadata(sub.ipfsHash, index);
      }
    });
  }, [submissions]);

  const TimeAgo = ({ timestamp }) => {
    const getTimeAgo = () => {
      const ts = safeNumber(timestamp);
      if (!ts) return 'unknown time';
      
      const seconds = Math.floor((Date.now() - ts * 1000) / 1000);
      if (seconds < 60) return 'just now';
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes}m ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    };
    
    return <span className="time-badge">{getTimeAgo()}</span>;
  };

  const ImageModal = ({ src, onClose }) => (
    <div className="image-modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <img src={src} alt="Full size" loading="lazy" />
      </div>
    </div>
  );

  const submissionsArray = Array.isArray(submissions) ? submissions : [];

  if (submissionsArray.length === 0) {
    return (
      <div className="feed-container">
        <div className="feed-header">
          <h3 className="feed-title">
            <span className="feed-icon">📖</span>
            Submission Feed
          </h3>
        </div>
        <div className="empty-feed">
          <div className="empty-icon">📚</div>
          <p className="empty-text">No submissions yet</p>
          <p className="empty-subtext">Be the first to share your reading journey!</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="feed-container">
        <div className="feed-header">
          <h3 className="feed-title">
            <span className="feed-icon">📖</span>
            Submission Feed
          </h3>
          <span className="feed-count">{submissionsArray.length}</span>
        </div>

        <div className="feed-list">
          {submissionsArray.map((submission, index) => {
            if (!submission) return null;

            const submitter = submission.user || submission.submitter || '';
            const isCurrentUser = currentUser && submitter 
              ? submitter.toLowerCase() === currentUser.toLowerCase() 
              : false;
            const ipfsHash = safeString(submission.ipfsHash);
            const quote = safeString(submission.quote);
            const verified = !!submission.verified;
            const imageUrl = imageUrls[index];
            const isLoading = loadingImages[index];

            return (
              <div key={index} className="feed-item">
                {/* Header */}
                <div className="feed-item-header">
                  <div className="submitter-info">
                    <div className="submitter-avatar">
                      <span>👤</span>
                    </div>
                    <div className="submitter-details">
                      <span className="submitter-name">
                        {isCurrentUser 
                          ? 'You' 
                          : submitter 
                            ? `${submitter.slice(0, 6)}...${submitter.slice(-4)}`
                            : 'Unknown'}
                      </span>
                      <TimeAgo timestamp={submission.timestamp} />
                    </div>
                  </div>
                  
                  {verified ? (
                    <div className="verified-badge">
                      <span className="verified-icon">✓</span>
                      <span>Verified</span>
                    </div>
                  ) : (
                    <div className="pending-badge-feed">
                      <span className="pending-icon">⏳</span>
                      <span>Pending</span>
                    </div>
                  )}
                </div>

                {/* Image - Fixed to properly display */}
                {ipfsHash && (
                  <div className="feed-image-section">
                    {isLoading ? (
                      <div className="image-loading">
                        <div className="loading-spinner"></div>
                        <p>Loading image from IPFS...</p>
                      </div>
                    ) : imageUrl ? (
                      <div 
                        className="feed-image-container"
                        onClick={() => setExpandedImage(imageUrl)}
                      >
                        <img 
                          src={imageUrl}
                          alt="Book submission"
                          className="feed-image"
                          loading="lazy"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.classList.add('image-error');
                          }}
                        />
                        <div className="image-overlay">
                          <span className="expand-icon">🔍</span>
                          <span>Click to expand</span>
                        </div>
                      </div>
                    ) : (
                      <div className="image-fallback">
                        <span className="fallback-icon">📷</span>
                        <span className="fallback-text">Image failed to load</span>
                        <a 
                          href={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="fallback-link"
                        >
                          View Metadata
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* Quote */}
                {quote && (
                  <div className="feed-quote-container">
                    <div className="quote-mark">❝</div>
                    <p className="feed-quote">{quote}</p>
                    <div className="quote-mark quote-mark-end">❞</div>
                  </div>
                )}

                {/* Footer */}
                <div className="feed-item-footer">
                  {verified && (
                    <div className="verification-info">
                      <span className="verification-icon">🏆</span>
                      <span className="verification-text">+10 points earned</span>
                    </div>
                  )}
                  
                  {!verified && submitter && submitter !== currentUser && (
                    <button 
                      className="verify-button"
                      onClick={() => onVerify(squadName, index)}
                    >
                      <span className="verify-icon">✨</span>
                      <span>Verify Submission</span>
                    </button>
                  )}

                  {!verified && isCurrentUser && (
                    <div className="awaiting-verification">
                      <span className="awaiting-icon">⏰</span>
                      <span>Awaiting verification from squad</span>
                    </div>
                  )}
                </div>

                {/* IPFS Links */}
                <div className="ipfs-links">
                  <a 
                    href={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ipfs-link"
                  >
                    <span className="ipfs-icon">🔗</span>
                    <span>Metadata</span>
                  </a>
                  {imageUrl && (
                    <a 
                      href={imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ipfs-link"
                    >
                      <span className="ipfs-icon">🖼️</span>
                      <span>Image</span>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {expandedImage && (
        <ImageModal 
          src={expandedImage} 
          onClose={() => setExpandedImage(null)} 
        />
      )}
    </>
  );
};

export default SubmissionFeed;