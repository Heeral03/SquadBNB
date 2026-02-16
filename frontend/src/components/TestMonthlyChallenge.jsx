import React, { useEffect, useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { 
  MONTHLY_CHALLENGE_ADDRESS, 
  MONTHLY_CHALLENGE_ABI 
} from '../contracts/config';

const TestMonthlyChallenge = () => {
  const { address } = useAccount();
  const [debug, setDebug] = useState({});
  const [challengeExists, setChallengeExists] = useState({ index0: false, index1: false });

  // Get active proposals (book proposals)
  const { data: proposalsData, error: proposalsError, isLoading: proposalsLoading } = useReadContract({
    address: MONTHLY_CHALLENGE_ADDRESS,
    abi: MONTHLY_CHALLENGE_ABI,
    functionName: 'getActiveProposals',
  });

  // Try to get challenge at index 0 using getChallenge function
  const { data: challengeData, error: challengeError, isLoading: challengeLoading } = useReadContract({
    address: MONTHLY_CHALLENGE_ADDRESS,
    abi: MONTHLY_CHALLENGE_ABI,
    functionName: 'getChallenge',
    args: [0],
  });

  // Try to get challenge at index 1
  const { data: challengeData1, error: challengeError1 } = useReadContract({
    address: MONTHLY_CHALLENGE_ADDRESS,
    abi: MONTHLY_CHALLENGE_ABI,
    functionName: 'getChallenge',
    args: [1],
  });

  // Get first active proposal details if available
  const proposalId = proposalsData && proposalsData.length > 0 ? proposalsData[0] : null;
  
  const { data: proposalData } = useReadContract({
    address: MONTHLY_CHALLENGE_ADDRESS,
    abi: MONTHLY_CHALLENGE_ABI,
    functionName: 'getProposal',
    args: proposalId ? [proposalId] : [0],
    query: { enabled: !!proposalId },
  });

  // Get challenge entry fee
  const { data: entryFee } = useReadContract({
    address: MONTHLY_CHALLENGE_ADDRESS,
    abi: MONTHLY_CHALLENGE_ABI,
    functionName: 'CHALLENGE_ENTRY_FEE',
  });

  // Get reward pool
  const { data: rewardPool } = useReadContract({
    address: MONTHLY_CHALLENGE_ADDRESS,
    abi: MONTHLY_CHALLENGE_ABI,
    functionName: 'rewardPool',
  });

  useEffect(() => {
    // Check if challenge exists by seeing if getChallenge returns valid data
    const hasChallenge0 = challengeData && !challengeError;
    const hasChallenge1 = challengeData1 && !challengeError1;
    
    console.log('🔍 proposalsData (active proposals):', proposalsData);
    console.log('🔍 challenge at index 0:', challengeData);
    console.log('🔍 challenge at index 1:', challengeData1);
    console.log('🔍 proposalId:', proposalId?.toString());
    console.log('🔍 proposalData:', proposalData);
    
    setChallengeExists({
      index0: hasChallenge0,
      index1: hasChallenge1
    });
    
    setDebug({
      proposalsData: proposalsData ? proposalsData.map(id => id.toString()) : null,
      challengeAtZero: challengeData ? {
        bookTitle: challengeData[0],
        bookAuthor: challengeData[1],
        startTime: challengeData[2]?.toString(),
        endTime: challengeData[3]?.toString(),
        prizePool: challengeData[4]?.toString(),
        participantCount: challengeData[5]?.toString(),
        sponsor: challengeData[6],
        rewardsDistributed: challengeData[7]
      } : null,
      challengeAtOne: challengeData1 ? {
        bookTitle: challengeData1[0],
        bookAuthor: challengeData1[1],
        startTime: challengeData1[2]?.toString(),
        endTime: challengeData1[3]?.toString(),
        prizePool: challengeData1[4]?.toString(),
        participantCount: challengeData1[5]?.toString(),
        sponsor: challengeData1[6],
        rewardsDistributed: challengeData1[7]
      } : null,
      proposalId: proposalId?.toString(),
      proposalData: proposalData ? {
        title: proposalData[0],
        author: proposalData[1],
        proposer: proposalData[2],
        votes: proposalData[3]?.toString(),
        deadline: proposalData[4]?.toString(),
        executed: proposalData[5],
        sponsor: proposalData[6],
        sponsorAmount: proposalData[7]?.toString()
      } : null,
      entryFee: entryFee?.toString(),
      rewardPool: rewardPool?.toString()
    });
  }, [proposalsData, challengeData, challengeData1, proposalData, proposalId, entryFee, rewardPool, challengeError, challengeError1]);

  if (proposalsLoading || challengeLoading) return <div>Loading challenges...</div>;

  const formatEther = (wei) => {
    if (!wei) return 'N/A';
    return (Number(wei) / 1e18).toFixed(4) + ' MATIC';
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(Number(timestamp) * 1000).toLocaleString();
  };

  return (
    <div style={{ 
      padding: '20px', 
      background: '#f0f0f0', 
      margin: '20px',
      borderRadius: '8px',
      border: '1px solid #ccc'
    }}>
      <h3>🔧 Monthly Challenge Debug Info</h3>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Contract Address:</strong> {MONTHLY_CHALLENGE_ADDRESS}
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Proposals Loading:</strong> {proposalsLoading ? 'Yes' : 'No'}
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Proposals Error:</strong> {proposalsError?.message || 'None'}
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Challenge Error:</strong> {challengeError?.message || 'None'}
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Entry Fee:</strong> {formatEther(debug.entryFee)}
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Reward Pool:</strong> {formatEther(debug.rewardPool)}
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Active Proposals (Book Proposals):</strong> {debug.proposalsData?.join(', ') || 'None'}
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Selected Proposal ID:</strong> {debug.proposalId || 'None'}
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Challenge at Index 0:</strong> {challengeExists.index0 ? '✅ Exists' : '❌ Does not exist'}
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Challenge at Index 1:</strong> {challengeExists.index1 ? '✅ Exists' : '❌ Does not exist'}
      </div>
      
      {challengeExists.index0 && debug.challengeAtZero && (
        <div style={{ 
          marginTop: '15px', 
          padding: '15px', 
          background: '#fff', 
          borderRadius: '8px',
          border: '1px solid #3b82f6'
        }}>
          <h4>📖 Challenge #0 Details</h4>
          <div><strong>Book:</strong> {debug.challengeAtZero.bookTitle} by {debug.challengeAtZero.bookAuthor}</div>
          <div><strong>Start:</strong> {formatTimestamp(debug.challengeAtZero.startTime)}</div>
          <div><strong>End:</strong> {formatTimestamp(debug.challengeAtZero.endTime)}</div>
          <div><strong>Prize Pool:</strong> {formatEther(debug.challengeAtZero.prizePool)}</div>
          <div><strong>Participants:</strong> {debug.challengeAtZero.participantCount}</div>
          <div><strong>Sponsor:</strong> {debug.challengeAtZero.sponsor || 'None'}</div>
          <div><strong>Rewards Distributed:</strong> {debug.challengeAtZero.rewardsDistributed ? 'Yes' : 'No'}</div>
        </div>
      )}
      
      {debug.proposalData && (
        <div style={{ 
          marginTop: '15px', 
          padding: '15px', 
          background: '#fff', 
          borderRadius: '8px',
          border: '1px solid #10b981'
        }}>
          <h4>📝 Proposal #{debug.proposalId}</h4>
          <div><strong>Title:</strong> {debug.proposalData.title}</div>
          <div><strong>Author:</strong> {debug.proposalData.author}</div>
          <div><strong>Proposer:</strong> {debug.proposalData.proposer}</div>
          <div><strong>Votes:</strong> {debug.proposalData.votes}</div>
          <div><strong>Deadline:</strong> {formatTimestamp(debug.proposalData.deadline)}</div>
          <div><strong>Executed:</strong> {debug.proposalData.executed ? 'Yes' : 'No'}</div>
          <div><strong>Sponsor:</strong> {debug.proposalData.sponsor || 'None'}</div>
          <div><strong>Sponsor Amount:</strong> {formatEther(debug.proposalData.sponsorAmount)}</div>
        </div>
      )}

      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        background: '#d1e7ff', 
        borderRadius: '8px',
        border: '1px solid #3b82f6'
      }}>
        <h4>📋 Summary</h4>
        {debug.proposalData ? (
          <>
            <p>✅ You have an active proposal for <strong>"{debug.proposalData.title}"</strong></p>
            <p>❌ No challenges have been created yet</p>
            <p>👉 <strong>Next step:</strong> The proposal needs <strong>{debug.proposalData.votes} votes</strong> so far. 
            It needs to reach the required votes threshold before it can be executed to create a challenge.</p>
            <p>ℹ️ To vote on this proposal, use the <code>voteOnBook({debug.proposalId})</code> function.</p>
          </>
        ) : (
          <p>No active proposals found. Create a proposal first using <code>proposeBook(title, author)</code></p>
        )}
      </div>
    </div>
  );
};

export default TestMonthlyChallenge;