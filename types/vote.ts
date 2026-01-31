// Block Share App v2.0 - Voting & Governance Types
// Ranked-choice voting for democratic decisions

export type VoteType = 'pool_priority' | 'item_selection' | 'rule_change' | 'general';
export type VoteStatus = 'draft' | 'active' | 'closed' | 'cancelled';

export interface VoteOption {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
}

export interface RankedBallot {
  odterId: string;
  rankings: string[]; // option IDs in order of preference
  submittedAt: Date;
}

export interface VoteResult {
  winnerId: string;
  rounds: {
    round: number;
    eliminated?: string;
    votes: Record<string, number>;
  }[];
  totalVotes: number;
  participation: number; // percentage of eligible voters
}

export interface Vote {
  id: string;
  poolId: string;
  poolName: string;
  createdById: string;
  createdByName: string;
  
  type: VoteType;
  title: string;
  description: string;
  
  options: VoteOption[];
  ballots: RankedBallot[];
  
  status: VoteStatus;
  startsAt: Date;
  endsAt: Date;
  
  // Results (populated when closed)
  result?: VoteResult;
  
  // Metadata
  createdAt: Date;
  eligibleVoters: number;
  
  // Notifications
  remindersSent: number;
}

// Helper to check if user has voted
export const hasUserVoted = (vote: Vote, odterId: string): boolean => {
  return vote.ballots.some(b => b.odterId === odterId);
};

// Helper to get vote participation percentage
export const getParticipation = (vote: Vote): number => {
  if (vote.eligibleVoters === 0) return 0;
  return Math.round((vote.ballots.length / vote.eligibleVoters) * 100);
};

// Sample vote templates
export const VOTE_TEMPLATES: Record<VoteType, { title: string; description: string }> = {
  pool_priority: {
    title: 'Pool Priority Vote',
    description: 'Rank which sharing pools we should establish next in our building.',
  },
  item_selection: {
    title: 'Item Selection Vote',
    description: 'Help us choose which specific item to add to our pool.',
  },
  rule_change: {
    title: 'Rule Change Proposal',
    description: 'Vote on a proposed change to our pool rules.',
  },
  general: {
    title: 'Community Decision',
    description: 'We need your input on an important community matter.',
  },
};
