import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { CHALLENGE_MANAGER_ADDRESS, CHALLENGE_MANAGER_ABI } from '../contracts/challengeConfig';
import toast from 'react-hot-toast';

const WeeklyChallenge = ({ onComplete }) => {
  const { address } = useAccount();
  const [timeLeft, setTimeLeft] = useState('');
  const [challenge, setChallenge] = useState(null);

  // Helper to safely convert BigInt to Number
  const safeNumber = (value) => {
    if (value === null || value === undefined) return 0;
    return typeof value === 'bigint' ? Number(value) : value;
  };

  // Get active challenge
  const { data: activeChallenge, refetch: refetchChallenge, isLoading } = useReadContract({
    address: CHALLENGE_MANAGER_ADDRESS,
    abi: CHALLENGE_MANAGER_ABI,
    functionName: 'getActiveChallenge',
  });

  // Check if user completed
  const { data: hasCompleted, refetch: refetchCompleted } = useReadContract({
    address: CHALLENGE_MANAGER_ADDRESS,
    abi: CHALLENGE_MANAGER_ABI,
    functionName: 'hasUserCompleted',
    args: challenge ? [challenge.id, address] : undefined,
    query: {
      enabled: !!challenge && !!address,
    }
  });

  // Complete challenge
  const { writeContractAsync: completeChallenge, isPending } = useWriteContract();

  // Process challenge data
  useEffect(() => {
    if (activeChallenge) {
      console.log('📅 Active challenge received:', activeChallenge);
      
      // Handle both array and object formats
      if (Array.isArray(activeChallenge)) {
        setChallenge({
          id: safeNumber(activeChallenge[0]),
          title: activeChallenge[1] || '',
          description: activeChallenge[2] || '',
          theme: activeChallenge[3] || '',
          startTime: safeNumber(activeChallenge[4]),
          endTime: safeNumber(activeChallenge[5]),
          bonusPoints: safeNumber(activeChallenge[6]),
          active: activeChallenge[7] || false,
          participantCount: safeNumber(activeChallenge[8])
        });
      } else if (activeChallenge && typeof activeChallenge === 'object') {
        // Handle object format
        setChallenge({
          id: safeNumber(activeChallenge.id),
          title: activeChallenge.title || '',
          description: activeChallenge.description || '',
          theme: activeChallenge.theme || '',
          startTime: safeNumber(activeChallenge.startTime),
          endTime: safeNumber(activeChallenge.endTime),
          bonusPoints: safeNumber(activeChallenge.bonusPoints),
          active: activeChallenge.active || false,
          participantCount: safeNumber(activeChallenge.participantCount)
        });
      }
    }
  }, [activeChallenge]);

  // Update timer
  useEffect(() => {
    if (!challenge?.endTime) return;

    const timer = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const diff = challenge.endTime - now;

      if (diff <= 0) {
        setTimeLeft('Expired');
        refetchChallenge();
      } else {
        const days = Math.floor(diff / 86400);
        const hours = Math.floor((diff % 86400) / 3600);
        const minutes = Math.floor((diff % 3600) / 60);
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [challenge, refetchChallenge]);

  const handleComplete = async () => {
    if (!challenge) return;

    try {
      const txHash = await completeChallenge({
        address: CHALLENGE_MANAGER_ADDRESS,
        abi: CHALLENGE_MANAGER_ABI,
        functionName: 'completeChallenge',
        args: [challenge.id],
      });

      toast.success(`🎉 Challenge completed! +${challenge.bonusPoints} points`);
      refetchCompleted();
      refetchChallenge();
      if (onComplete) onComplete(challenge.bonusPoints);

    } catch (error) {
      console.error('Complete error:', error);
      toast.error(error?.shortMessage || 'Failed to complete challenge');
    }
  };

  if (isLoading) {
    return (
      <div className="challenge-card glass-effect" style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '24px',
        borderRadius: '16px',
        color: 'white'
      }}>
        <h3>📅 Weekly Challenge</h3>
        <p>Loading challenge...</p>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="challenge-card glass-effect" style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '24px',
        borderRadius: '16px',
        color: 'white'
      }}>
        <h3>📅 Weekly Challenge</h3>
        <p>No active challenge at the moment. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="challenge-card glass-effect" style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '24px',
      borderRadius: '16px',
      color: 'white',
      marginBottom: '20px'
    }}>
      <div className="challenge-header" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <h3 style={{ margin: 0 }}>📅 Weekly Challenge</h3>
        <span style={{ 
          background: 'rgba(255,255,255,0.2)',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '14px'
        }}>
          {challenge.theme}
        </span>
      </div>

      <h4 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>
        {challenge.title}
      </h4>
      
      <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '20px', opacity: 0.95 }}>
        {challenge.description}
      </p>

      <div style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        background: 'rgba(0,0,0,0.2)',
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <span style={{ fontWeight: 'bold', color: '#ffd700' }}>⏳ {timeLeft || 'Calculating...'}</span>
        <span style={{ fontWeight: 'bold', color: '#ffd700' }}>🏆 {challenge.bonusPoints} pts</span>
      </div>

      {hasCompleted ? (
        <div style={{ 
          textAlign: 'center',
          padding: '12px',
          background: 'rgba(46, 204, 113, 0.3)',
          borderRadius: '8px',
          fontWeight: 'bold'
        }}>
          ✅ You've completed this challenge!
        </div>
      ) : (
        <button 
          onClick={handleComplete}
          disabled={isPending}
          style={{
            width: '100%',
            padding: '14px',
            background: 'white',
            color: '#667eea',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            opacity: isPending ? 0.5 : 1
          }}
        >
          {isPending ? 'Completing...' : 'Complete Challenge'}
        </button>
      )}

      <div style={{ marginTop: '12px', textAlign: 'center', fontSize: '14px', opacity: 0.9 }}>
        👥 {challenge.participantCount} participant{challenge.participantCount !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default WeeklyChallenge;