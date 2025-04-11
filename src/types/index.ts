
export type AgentType = 'strategist' | 'ethicist' | 'optimizer';

export type AgentStatus = 'idle' | 'analyzing' | 'voting' | 'debating';

export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  description: string;
  status: AgentStatus;
  avatar: string;
  values: string[];
  expertise: string[];
}

export type ProposalStatus = 'pending' | 'reviewing' | 'debating' | 'voting' | 'approved' | 'rejected' | 'executed';

export type ProposalType = 'funding' | 'governance' | 'development' | 'community' | 'other';

export type Vote = 'approve' | 'reject' | 'revise';

export interface AgentVote {
  agentId: string;
  vote: Vote;
  reason: string;
  timestamp: number;
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  type: ProposalType;
  status: ProposalStatus;
  createdAt: number;
  updatedAt: number;
  author: string;
  budget?: string;
  timeline?: string;
  votes: AgentVote[];
  txHash?: string;
}

export interface Transaction {
  hash: string;
  type: 'proposal' | 'vote' | 'execution';
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
  from: string;
  to: string;
  value?: string;
  gasUsed?: string;
  proposalId?: string;
}

export interface NetworkNode {
  id: string;
  type: 'agent' | 'proposal';
  entityId: string; // refers to either agent.id or proposal.id
}

export interface NetworkLink {
  source: string;
  target: string;
  value: number;
  type: 'vote' | 'debate' | 'routing';
}

export interface Network {
  nodes: NetworkNode[];
  links: NetworkLink[];
}
