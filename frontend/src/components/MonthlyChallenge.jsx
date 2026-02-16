import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, usePublicClient } from 'wagmi';
import { MONTHLY_CHALLENGE_ADDRESS, MONTHLY_CHALLENGE_ABI } from '../contracts/config';
import { parseEther, formatEther } from 'viem';
import toast from 'react-hot-toast';
import './MonthlyChallenge.css';

// import { ethers } from 'ethers';
const MonthlyChallenge = () => {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState('current');
  const [viewMode, setViewMode] = useState('active'); // 'active' or 'past'
  const [proposalTitle, setProposalTitle] = useState('');
  const [proposalAuthor, setProposalAuthor] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [selectedChallenge, setSelectedChallenge] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [debugInfo, setDebugInfo] = useState({});
  const [timeLeft, setTimeLeft] = useState('');
  const [showWinner, setShowWinner] = useState(false);
  const [winner, setWinner] = useState(null);
  const [pastChallenges, setPastChallenges] = useState([]);
  const [pastProposals, setPastProposals] = useState([]);
  const [proposalDetails, setProposalDetails] = useState({}); // NEW: Store proposal details
  const [loading, setLoading] = useState(false);

  // ============ CONTRACT READS ============

  // Get pending rewards
  const { data: pendingRewards, refetch: refetchRewards } = useReadContract({
    address: MONTHLY_CHALLENGE_ADDRESS,
    abi: MONTHLY_CHALLENGE_ABI,
    functionName: 'getPendingRewards',
    args: [address],
  });

  // Get active proposals
  const { data: proposalsData, refetch: refetchProposals } = useReadContract({
    address: MONTHLY_CHALLENGE_ADDRESS,
    abi: MONTHLY_CHALLENGE_ABI,
    functionName: 'getActiveProposals',
  });

  // Get active challenges
  const { data: challengesData, refetch: refetchChallenges } = useReadContract({
    address: MONTHLY_CHALLENGE_ADDRESS,
    abi: MONTHLY_CHALLENGE_ABI,
    functionName: 'getActiveChallenges',
  });

  // Get challenge details when selected
  const { data: challengeData, refetch: refetchChallenge } = useReadContract({
    address: MONTHLY_CHALLENGE_ADDRESS,
    abi: MONTHLY_CHALLENGE_ABI,
    functionName: 'getChallenge',
    args: [selectedChallenge],
  });

  // Get participants
  const { data: participantsData, refetch: refetchParticipants } = useReadContract({
    address: MONTHLY_CHALLENGE_ADDRESS,
    abi: MONTHLY_CHALLENGE_ABI,
    functionName: 'getParticipants',
    args: [selectedChallenge],
  });

  // Get reviews
  const { data: reviewsData, refetch: refetchReviews } = useReadContract({
    address: MONTHLY_CHALLENGE_ADDRESS,
    abi: MONTHLY_CHALLENGE_ABI,
    functionName: 'getReviews',
    args: [selectedChallenge],
  });

  // ============ CONTRACT WRITES ============

  const { writeContractAsync: proposeBook } = useWriteContract();
  const { writeContractAsync: voteOnBook } = useWriteContract();
  const { writeContractAsync: sponsorBook } = useWriteContract();
  const { writeContractAsync: joinChallenge } = useWriteContract();
  const { writeContractAsync: submitReview } = useWriteContract();
  const { writeContractAsync: voteForReview } = useWriteContract();
  const { writeContractAsync: withdrawRewards } = useWriteContract();

  // ============ LOAD PAST DATA ============

  // Function to manually check if challenge exists
  const checkChallengeExists = async (index) => {
    try {
      const response = await fetch('/api/challenge-exists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId: index })
      });
      const data = await response.json();
      return data.exists;
    } catch (error) {
      console.error('Error checking challenge:', error);
      return false;
    }
  };
  

// usePublicClient hook add karna mat bhoolna
const publicClient = usePublicClient();

const fetchProposalDirectly = async (proposalId) => {
  try {
    if (!publicClient) {
      console.log('⏳ Waiting for public client...');
      return null;
    }
    
    const data = await publicClient.readContract({
      address: MONTHLY_CHALLENGE_ADDRESS,
      abi: MONTHLY_CHALLENGE_ABI,
      functionName: 'getProposal',
      args: [proposalId],
    });
    
    // Check if it's a valid proposal (has a title)
    if (data && data[0] && data[0] !== '') {
      console.log(`✅ Found proposal #${proposalId}:`, data[0]);
      return {
        title: data[0],
        author: data[1],
        votes: data[3].toString(),
        executed: data[4]
      };
    }
    return null;
  } catch (error) {
    console.log(`❌ No proposal at index ${proposalId}`);
    return null;
  }
};

// Load past proposals - FIXED VERSION
useEffect(() => {
  const loadPastProposals = async () => {
    if (!publicClient) return;
    
    const past = [];
    
    console.log('🔍 Loading past proposals with viem...');
    
    for (let i = 0; i <= 10; i++) {
      if (proposalsData?.some(active => Number(active) === i)) {
        console.log(`⏭️ Skipping active proposal #${i}`);
        continue;
      }
      
      try {
        const data = await fetchProposalDirectly(i);
        
        if (data) {
          console.log(`📜 Found past proposal #${i}: ${data.title} - Executed: ${data.executed}`);
          past.push(i);
        }
      } catch (error) {
        // No proposal at this index - ignore
      }
    }
    
    console.log('📜 Past proposals found:', past);
    setPastProposals(past);
  };
  
  loadPastProposals();
}, [proposalsData, publicClient]);

// NEW: Fetch details for all past proposals
useEffect(() => {
  const fetchAllProposalDetails = async () => {
    if (!publicClient || pastProposals.length === 0) return;
    
    const details = {};
    for (const id of pastProposals) {
      const data = await fetchProposalDirectly(id);
      if (data) {
        details[id] = data;
      }
    }
    setProposalDetails(details);
  };
  
  fetchAllProposalDetails();
}, [pastProposals, publicClient]);

  // ============ DATA FORMATTING ============

  // Format data
  const pendingRewardsFormatted = pendingRewards ? formatEther(pendingRewards) : '0';
  const activeChallenges = challengesData || [];
  const activeProposals = proposalsData || [];

  // Format challenge data based on ABI
  const challengeDetails = challengeData ? {
    id: challengeData[0]?.toString(),
    title: challengeData[1] || 'Unknown Title',
    author: challengeData[2] || 'Unknown Author',
    startTime: challengeData[3] ? Number(challengeData[3]) * 1000 : Date.now(),
    endTime: challengeData[4] ? Number(challengeData[4]) * 1000 : Date.now(),
    prizePool: challengeData[5] ? formatEther(challengeData[5]) : '0',
    sponsor: challengeData[6] || '0x0000000000000000000000000000000000000000',
    rewardsDistributed: challengeData[7] || false,
    participantCount: challengeData[8] ? Number(challengeData[8]) : 0,
  } : null;

  // Format reviews
  const reviews = reviewsData && reviewsData[0] ? reviewsData[0].map((user, i) => ({
    user,
    ipfsHash: reviewsData[1]?.[i] || '',
    timestamp: reviewsData[2]?.[i] ? Number(reviewsData[2][i]) * 1000 : 0,
    upvotes: reviewsData[3]?.[i] ? Number(reviewsData[3][i]) : 0,
  })) : [];

  const participants = participantsData || [];

  const now = Date.now();
  const isActive = challengeDetails && now < challengeDetails.endTime;
  const isVotingWindow = challengeDetails && 
    now > challengeDetails.endTime && 
    now < challengeDetails.endTime + 3 * 24 * 60 * 60 * 1000;
  
  // Determine if join button should show
  const showJoinButton = !challengeDetails?.rewardsDistributed && isActive && !hasJoined;

  // ============ EFFECTS ============

  // Monitor account changes
  useEffect(() => {
    console.log('🔄 ACCOUNT CHANGED DETECTED');
    console.log('📝 New address:', address);
    
    setHasJoined(false);
    refetchParticipants();
    refetchChallenge();
    refetchChallenges();
    refetchRewards();
  }, [address]);

  // Monitor participants data
  useEffect(() => {
    if (participantsData && address) {
      const userHasJoined = participantsData.some(
        participant => participant?.toLowerCase() === address?.toLowerCase()
      );
      setHasJoined(userHasJoined);
    }
  }, [participantsData, address]);

  // Auto-select challenge when view mode changes
  useEffect(() => {
    if (viewMode === 'active' && activeChallenges.length > 0) {
      setSelectedChallenge(Number(activeChallenges[0]));
    } else if (viewMode === 'past' && pastChallenges.length > 0) {
      setSelectedChallenge(pastChallenges[0]);
    }
  }, [viewMode, activeChallenges, pastChallenges]);

  // Countdown timer
  useEffect(() => {
    if (!challengeDetails?.endTime) return;
    
    const updateCountdown = () => {
      const now = Date.now();
      const end = challengeDetails.endTime;
      const diff = end - now;
      
      if (diff <= 0) {
        setTimeLeft('Challenge ended');
        return;
      }
      
      if (diff < 24 * 60 * 60 * 1000) {
        const minutes = Math.floor(diff / (60 * 1000));
        const seconds = Math.floor((diff % (60 * 1000)) / 1000);
        setTimeLeft(`${minutes}m ${seconds}s`);
      } else {
        const days = Math.floor(diff / (24 * 60 * 60 * 1000));
        const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        setTimeLeft(`${days}d ${hours}h`);
      }
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [challengeDetails?.endTime]);

  // Phase change notifications
  useEffect(() => {
    if (!challengeDetails) return;
    
    const now = Date.now();
    const end = challengeDetails.endTime;
    
    if (now > end && now < end + 60000) {
      toast.success('🗳️ Voting phase has begun! Vote for the best review!', {
        duration: 8000,
        icon: '🗳️'
      });
    }
    
    if (challengeDetails.rewardsDistributed) {
      toast.success('🏆 Challenge completed! Check the winner!', {
        duration: 8000,
        icon: '🏆'
      });
    }
  }, [challengeDetails]);

  // Check for winner
  useEffect(() => {
    if (challengeDetails?.rewardsDistributed) {
      setShowWinner(true);
    }
  }, [challengeDetails?.rewardsDistributed]);

  // Get phase information
  const getPhaseInfo = () => {
    if (!challengeDetails) return null;
    
    if (now < challengeDetails.endTime) {
      const secondsLeft = Math.floor((challengeDetails.endTime - now) / 1000);
      return {
        phase: '📖 Reading Phase',
        message: `${secondsLeft} seconds left`,
        color: '#3b82f6'
      };
    } else if (isVotingWindow) {
      const secondsLeft = Math.floor((challengeDetails.endTime + 3 * 24 * 60 * 60 * 1000 - now) / 1000);
      return {
        phase: '🗳️ Voting Phase',
        message: `${secondsLeft} seconds left to vote`,
        color: '#8b5cf6'
      };
    } else if (challengeDetails.rewardsDistributed) {
      return {
        phase: '🏆 Challenge Complete',
        message: 'Winner chosen!',
        color: '#f59e0b'
      };
    }
    return null;
  };

  const phaseInfo = getPhaseInfo();

  // Manual refresh function
// Replace the existing refreshPastChallenges function
const refreshPastChallenges = async () => {
  setLoading(true);
  const past = [];
  
  // Check indices 0-10 for challenges
  for (let i = 0; i <= 10; i++) {
    // Skip active challenges
    if (activeChallenges.some(id => Number(id) === i)) continue;
    
    try {
      const data = await publicClient.readContract({
        address: MONTHLY_CHALLENGE_ADDRESS,
        abi: MONTHLY_CHALLENGE_ABI,
        functionName: 'getChallenge',
        args: [i],
      });
      
      // Check if challenge exists (has a title)
      if (data && data[1] && data[1] !== '') {
        console.log(`📜 Found past challenge #${i}: ${data[1]}`);
        past.push(i);
      }
    } catch (error) {
      // No challenge at this index
    }
  }
  
  console.log('📜 Past challenges found:', past);
  setPastChallenges(past);
  setLoading(false);
  toast.success(`Found ${past.length} past challenges`);
};

// Call it on mount
useEffect(() => {
  refreshPastChallenges();
}, []);

  // ============ HANDLERS ============

  const handleProposeBook = async () => {
    if (!proposalTitle || !proposalAuthor) {
      toast.error('Please enter title and author');
      return;
    }

    setIsSubmitting(true);
    try {
      const tx = await proposeBook({
        address: MONTHLY_CHALLENGE_ADDRESS,
        abi: MONTHLY_CHALLENGE_ABI,
        functionName: 'proposeBook',
        args: [proposalTitle, proposalAuthor],
      });
      toast.success('Book proposed successfully!');
      setProposalTitle('');
      setProposalAuthor('');
      setTimeout(() => refetchProposals(), 3000);
    } catch (error) {
      toast.error(error?.shortMessage || 'Failed to propose book');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVoteOnBook = async (proposalId) => {
    try {
      const tx = await voteOnBook({
        address: MONTHLY_CHALLENGE_ADDRESS,
        abi: MONTHLY_CHALLENGE_ABI,
        functionName: 'voteOnBook',
        args: [proposalId],
      });
      toast.success('Vote cast!');
      setTimeout(() => {
        refetchProposals();
        refetchChallenges();
      }, 3000);
    } catch (error) {
      toast.error(error?.shortMessage || 'Failed to vote');
    }
  };

  const handleSponsorBook = async (proposalId, amount) => {
    try {
      const valueInWei = parseEther(amount);
      const tx = await sponsorBook({
        address: MONTHLY_CHALLENGE_ADDRESS,
        abi: MONTHLY_CHALLENGE_ABI,
        functionName: 'sponsorBook',
        args: [proposalId],
        value: valueInWei,
      });
      toast.success(`Sponsored with ${amount} BNB!`);
      setTimeout(() => refetchProposals(), 3000);
    } catch (error) {
      toast.error(error?.shortMessage || 'Failed to sponsor');
    }
  };

  const handleJoinChallenge = async () => {
    if (selectedChallenge === undefined || selectedChallenge === null) {
      toast.error('No active challenge to join');
      return;
    }

    try {
      setIsSubmitting(true);
      const loadingToast = toast.loading('Joining challenge...');
      
      const valueInWei = parseEther('0.001');
      const tx = await joinChallenge({
        address: MONTHLY_CHALLENGE_ADDRESS,
        abi: MONTHLY_CHALLENGE_ABI,
        functionName: 'joinChallenge',
        args: [selectedChallenge],
        value: valueInWei,
      });
      
      toast.dismiss(loadingToast);
      toast.success('Joined challenge!');
      
      setTimeout(() => {
        refetchChallenge();
        refetchParticipants();
        refetchChallenges();
      }, 3000);
    } catch (error) {
      if (error?.message?.includes('ALREADY_JOINED')) {
        toast.error('You have already joined this challenge');
      } else if (error?.message?.includes('CHALLENGE_ENDED')) {
        toast.error('This challenge has already ended');
      } else {
        toast.error(error?.shortMessage || 'Failed to join challenge');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewText || !selectedChallenge) {
      toast.error('Please write your review');
      return;
    }

    setIsSubmitting(true);
    try {
      const ipfsHash = `Qm${Math.random().toString(36).substring(2, 15)}`;
      
      const tx = await submitReview({
        address: MONTHLY_CHALLENGE_ADDRESS,
        abi: MONTHLY_CHALLENGE_ABI,
        functionName: 'submitReview',
        args: [selectedChallenge, ipfsHash],
      });
      
      toast.success('Review submitted!');
      setReviewText('');
      setTimeout(() => refetchReviews(), 3000);
    } catch (error) {
      toast.error(error?.shortMessage || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVoteForReview = async (reviewId) => {
    if (!selectedChallenge) return;
    
    try {
      const tx = await voteForReview({
        address: MONTHLY_CHALLENGE_ADDRESS,
        abi: MONTHLY_CHALLENGE_ABI,
        functionName: 'voteForReview',
        args: [selectedChallenge, reviewId],
      });
      
      toast.success('Vote cast! You earned a small reward!');
      setTimeout(() => {
        refetchReviews();
        refetchRewards();
      }, 3000);
    } catch (error) {
      toast.error(error?.shortMessage || 'Failed to vote');
    }
  };

  const handleWithdraw = async () => {
    try {
      const tx = await withdrawRewards({
        address: MONTHLY_CHALLENGE_ADDRESS,
        abi: MONTHLY_CHALLENGE_ABI,
        functionName: 'withdrawRewards',
      });
      toast.success('Rewards withdrawn!');
      setTimeout(() => refetchRewards(), 3000);
    } catch (error) {
      toast.error(error?.shortMessage || 'Failed to withdraw');
    }
  };

  return (
    <div className="monthly-challenge-container">
      <h2>📚 MONTHLY READING CHALLENGE</h2>
      
      {/* Debug Panel */}
      <div className="debug-panel">


        <div style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
          <button onClick={() => {
            refetchParticipants();
            refetchChallenge();
            window.location.reload();
          }}>🔄 Full Refresh</button>
          <button onClick={refreshPastChallenges}>📜 Refresh Past</button>
        </div>
      </div>

      {/* Rewards Card */}
      {pendingRewards > 0 && (
        <div className="rewards-card">
          <div>
            <strong>Your Earnings:</strong> {pendingRewardsFormatted} BNB
          </div>
          <button onClick={handleWithdraw} className="withdraw-btn">
            Withdraw
          </button>
        </div>
      )}

      {/* Main Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'current' ? 'active' : ''}`}
          onClick={() => setActiveTab('current')}
        >
          📖 Challenges
        </button>
        <button 
          className={`tab ${activeTab === 'propose' ? 'active' : ''}`}
          onClick={() => setActiveTab('propose')}
        >
          🗳️ Proposals
        </button>
      </div>

      {/* Challenges Tab */}
      {activeTab === 'current' && (
        <div className="current-challenge">
          {/* View Mode Switcher */}
          <div className="view-switcher">
            <button 
              className={`view-btn ${viewMode === 'active' ? 'active' : ''}`}
              onClick={() => {
                setViewMode('active');
                if (activeChallenges.length > 0) {
                  setSelectedChallenge(Number(activeChallenges[0]));
                }
              }}
            >
              🔥 Active ({activeChallenges.length})
            </button>
            <button 
              className={`view-btn ${viewMode === 'past' ? 'active' : ''}`}
              onClick={() => {
                setViewMode('past');
                // Set past challenges manually for demo
                const past = [0, 1, 2];
                setPastChallenges(past);
                if (past.length > 0) {
                  setSelectedChallenge(past[0]);
                }
              }}
            >
              📜 Past ({pastChallenges.length})
            </button>
          </div>

          {/* Challenge Selector */}
          {(viewMode === 'active' ? activeChallenges : pastChallenges).length > 0 ? (
            <>
              <div className="challenge-selector">
                <select 
                  onChange={(e) => setSelectedChallenge(Number(e.target.value))}
                  value={selectedChallenge}
                  className="challenge-dropdown"
                >
                  {(viewMode === 'active' ? activeChallenges : pastChallenges).map(id => (
                    <option key={id} value={id}>
                      Challenge #{id} - {viewMode === 'active' ? 'Active' : 'Ended'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Challenge Details */}
              {challengeDetails && (
                <>
                  {/* Phase Indicator */}
                  {viewMode === 'active' && phaseInfo && (
                    <div className="phase-indicator" style={{ backgroundColor: phaseInfo.color }}>
                      <span className="phase-badge">{phaseInfo.phase}</span>
                      <span className="phase-message">{phaseInfo.message}</span>
                    </div>
                  )}

                  {/* Past Challenge Badge */}
                  {viewMode === 'past' && (
                    <div className="phase-indicator" style={{ backgroundColor: '#6b7280' }}>
                      <span className="phase-badge">📜 Past Challenge</span>
                      <span className="phase-message">Ended on {new Date(challengeDetails.endTime).toLocaleString()}</span>
                    </div>
                  )}

                  {/* Winner Announcement */}
                  {showWinner && (
                    <div className="winner-announcement">
                      <h4>🏆 Challenge Complete!</h4>
                      <p>Prize: {challengeDetails.prizePool} BNB distributed</p>
                    </div>
                  )}

                  <div className="challenge-header">
                    <h3>{challengeDetails.title}</h3>
                    <p className="challenge-author">by {challengeDetails.author}</p>
                    {challengeDetails.sponsor !== '0x0000000000000000000000000000000000000000' && (
                      <p className="sponsor-badge">
                        ✨ Sponsored by: {challengeDetails.sponsor.slice(0,6)}...{challengeDetails.sponsor.slice(-4)}
                      </p>
                    )}
                  </div>

                  <div className="challenge-stats">
                    <div className="stat">
                      <span className="stat-label">Prize Pool</span>
                      <span className="stat-value">{challengeDetails.prizePool} BNB</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Participants</span>
                      <span className="stat-value">{participants.length}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">{viewMode === 'active' ? 'Time Left' : 'Ended'}</span>
                      <span className="stat-value">
                        {viewMode === 'active' ? timeLeft : new Date(challengeDetails.endTime).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Active Challenge Actions */}
                  {viewMode === 'active' && (
                    <>
                      {showJoinButton && (
                        <button onClick={handleJoinChallenge} className="join-btn" disabled={isSubmitting}>
                          {isSubmitting ? 'Joining...' : 'Join Challenge (0.001 BNB)'}
                        </button>
                      )}

                      {hasJoined && isActive && (
                        <div className="review-form">
                          <h4>📝 Submit Your Review</h4>
                          <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="Share your thoughts on the book..."
                            rows="4"
                            disabled={isSubmitting}
                          />
                          <button 
                            onClick={handleSubmitReview}
                            disabled={isSubmitting || !reviewText.trim()}
                            className="submit-review-btn"
                          >
                            {isSubmitting ? 'Submitting...' : 'Submit Review'}
                          </button>
                        </div>
                      )}
                    </>
                  )}

                  {/* Reviews Section */}
                  {reviews.length > 0 && (
                    <div className="reviews-section">
                      <h4>📖 Reader Reviews ({reviews.length})</h4>
                      {reviews.map((review, i) => (
                        <div key={i} className="review-card">
                          <div className="review-header">
                            <span className="reviewer">
                              {review.user.slice(0,6)}...{review.user.slice(-4)}
                              {review.user?.toLowerCase() === address?.toLowerCase() && ' (You)'}
                            </span>
                            <span className="upvotes">👍 {review.upvotes}</span>
                          </div>
                          <div className="review-hash">📄 {review.ipfsHash}</div>
                          {viewMode === 'active' && isVotingWindow && review.user?.toLowerCase() !== address?.toLowerCase() && (
                            <button onClick={() => handleVoteForReview(i)} className="vote-review-btn">
                              Vote for this Review
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Participants Section */}
                  {participants.length > 0 && (
                    <div className="participants-section">
                      <h4>👥 Participants ({participants.length})</h4>
                      <div className="participants-list">
                        {participants.map((participant, i) => (
                          <span key={i} className={`participant-tag ${participant?.toLowerCase() === address?.toLowerCase() ? 'current-user' : ''}`}>
                            {participant.slice(0,4)}...{participant.slice(-2)}
                            {participant?.toLowerCase() === address?.toLowerCase() && ' (You)'}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <div className="empty-state">
              <p>No {viewMode} challenges found</p>
              {viewMode === 'active' && (
                <button 
                  className="switch-tab-btn"
                  onClick={() => setActiveTab('propose')}
                >
                  Propose a Book to Start
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Proposals Tab */}
      {activeTab === 'propose' && (
        <div className="propose-tab">
          {/* New Proposal Form */}
          <div className="propose-form">
            <h3>📖 Propose a New Book</h3>
            <p className="form-hint">Get 2 votes and the challenge starts automatically!</p>
            <input
              type="text"
              placeholder="Book Title"
              value={proposalTitle}
              onChange={(e) => setProposalTitle(e.target.value)}
              className="proposal-input"
            />
            <input
              type="text"
              placeholder="Author"
              value={proposalAuthor}
              onChange={(e) => setProposalAuthor(e.target.value)}
              className="proposal-input"
            />
            <button 
              onClick={handleProposeBook}
              disabled={isSubmitting || !proposalTitle.trim() || !proposalAuthor.trim()}
              className="propose-btn"
            >
              {isSubmitting ? 'Proposing...' : 'Propose Book'}
            </button>
          </div>

          {/* Active Proposals */}
          {activeProposals.length > 0 && (
            <div className="proposals-section">
              <h3>🔥 Active Proposals</h3>
              {activeProposals.map((id) => (
                <div key={id} className="proposal-card">
                  <div className="proposal-header">
                    <span className="proposal-id">Proposal #{id.toString()}</span>
                    <span className="proposal-badge">⚡ Needs 2 votes</span>
                  </div>
                  <div className="proposal-actions">
                    <button onClick={() => handleVoteOnBook(id)} className="vote-btn">
                      Vote
                    </button>
                    <button onClick={() => {
                      const amount = prompt('Enter BNB amount (min 0.001):', '0.01');
                      if (amount && !isNaN(amount) && Number(amount) >= 0.001) {
                        handleSponsorBook(id, amount);
                      }
                    }} className="sponsor-btn">
                      Sponsor
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Past Proposals - FIXED VERSION */}
          {pastProposals.length > 0 && (
            <div className="proposals-section">
              <h3>📜 Past Proposals</h3>
              {pastProposals.map((id) => {
                const proposal = proposalDetails[id];
                return (
                  <div key={id} className="proposal-card past">
                    <div className="proposal-header">
                      <span className="proposal-id">Proposal #{id}</span>
                      <span className="proposal-badge executed">✅ Executed</span>
                    </div>
                    {proposal ? (
                      <div className="proposal-details">
                        <div style={{ fontWeight: '600', fontSize: '14px' }}>
                          📖 {proposal.title}
                        </div>
                        <div style={{ fontSize: '12px', color: '#4b5563' }}>
                          ✍️ by {proposal.author}
                        </div>
                        <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>
                          🗳️ {proposal.votes} votes • Created Challenge #{id}
                        </div>
                      </div>
                    ) : (
                      <div style={{ padding: '8px', color: '#999' }}>Loading...</div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {activeProposals.length === 0 && pastProposals.length === 0 && (
            <p className="empty-message">No proposals yet. Be the first to propose a book!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MonthlyChallenge;