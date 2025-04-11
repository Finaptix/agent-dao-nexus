
import { Agent, Proposal, Transaction, Network } from '@/types';

export const agents: Agent[] = [
  {
    id: 'agent-1',
    name: 'The Strategist',
    type: 'strategist',
    description: 'Analyzes proposals for long-term strategic value and alignment with DAO objectives.',
    status: 'idle',
    avatar: '👨‍💼',
    values: ['Innovation', 'Growth', 'Sustainability'],
    expertise: ['Strategic Planning', 'Resource Allocation', 'Risk Assessment']
  },
  {
    id: 'agent-2',
    name: 'The Ethicist',
    type: 'ethicist',
    description: 'Evaluates proposals for ethical implications, community impact, and alignment with values.',
    status: 'idle',
    avatar: '👩‍⚖️',
    values: ['Fairness', 'Transparency', 'Inclusivity'],
    expertise: ['Ethical Analysis', 'Community Engagement', 'Governance Standards']
  },
  {
    id: 'agent-3',
    name: 'The Optimizer',
    type: 'optimizer',
    description: 'Focuses on efficiency, resource optimization, and technical feasibility of proposals.',
    status: 'idle',
    avatar: '🧠',
    values: ['Efficiency', 'Pragmatism', 'Innovation'],
    expertise: ['Technical Analysis', 'Economic Modeling', 'Process Optimization']
  }
];

export const proposals: Proposal[] = [
  {
    id: 'prop-1',
    title: 'Community Treasury Allocation for Q2',
    description: 'Proposal to allocate 50,000 tokens from the community treasury to fund development, marketing, and community initiatives for Q2.',
    type: 'funding',
    status: 'reviewing',
    createdAt: Date.now() - 1000000,
    updatedAt: Date.now() - 500000,
    author: '0x1234...5678',
    budget: '50,000 tokens',
    timeline: 'Q2 2025',
    votes: []
  },
  {
    id: 'prop-2',
    title: 'Governance Framework Update',
    description: 'Proposal to update the governance framework to include multi-signature requirements for treasury transactions exceeding 10,000 tokens.',
    type: 'governance',
    status: 'debating',
    createdAt: Date.now() - 2000000,
    updatedAt: Date.now() - 300000,
    author: '0xabcd...ef01',
    votes: [
      {
        agentId: 'agent-1',
        vote: 'approve',
        reason: 'This aligns with our strategic goal of improving security and transparency.',
        timestamp: Date.now() - 400000
      }
    ]
  },
  {
    id: 'prop-3',
    title: 'New Developer Bounty Program',
    description: 'Establish a bounty program to incentivize external developers to contribute to our codebase.',
    type: 'development',
    status: 'voting',
    createdAt: Date.now() - 3000000,
    updatedAt: Date.now() - 200000,
    author: '0x7890...1234',
    budget: '15,000 tokens',
    timeline: 'Ongoing',
    votes: [
      {
        agentId: 'agent-1',
        vote: 'approve',
        reason: 'This will accelerate development and bring fresh perspectives.',
        timestamp: Date.now() - 250000
      },
      {
        agentId: 'agent-2',
        vote: 'approve',
        reason: 'The program includes fair compensation and proper attribution.',
        timestamp: Date.now() - 225000
      }
    ]
  },
  {
    id: 'prop-4',
    title: 'Community Events Budget',
    description: 'Allocate budget for virtual community events, workshops, and hackathons for the next quarter.',
    type: 'community',
    status: 'approved',
    createdAt: Date.now() - 4000000,
    updatedAt: Date.now() - 100000,
    author: '0xdef0...5678',
    budget: '8,000 tokens',
    timeline: 'Next quarter',
    votes: [
      {
        agentId: 'agent-1',
        vote: 'approve',
        reason: 'Community engagement is critical for our growth strategy.',
        timestamp: Date.now() - 150000
      },
      {
        agentId: 'agent-2',
        vote: 'approve',
        reason: 'Events promote inclusivity and educate the community.',
        timestamp: Date.now() - 140000
      },
      {
        agentId: 'agent-3',
        vote: 'approve',
        reason: 'The budget is reasonable for the expected outcomes.',
        timestamp: Date.now() - 130000
      }
    ],
    txHash: '0x1a2b3c4d5e6f7g8h9i0j...'
  },
  {
    id: 'prop-5',
    title: 'Protocol Upgrade Implementation',
    description: 'Implement the proposed protocol upgrade to improve transaction throughput and reduce gas costs.',
    type: 'development',
    status: 'executed',
    createdAt: Date.now() - 5000000,
    updatedAt: Date.now() - 50000,
    author: '0x5678...9abc',
    votes: [
      {
        agentId: 'agent-1',
        vote: 'approve',
        reason: 'This upgrade aligns with our technical roadmap.',
        timestamp: Date.now() - 110000
      },
      {
        agentId: 'agent-2',
        vote: 'approve',
        reason: 'The upgrade has undergone sufficient security auditing.',
        timestamp: Date.now() - 100000
      },
      {
        agentId: 'agent-3',
        vote: 'approve',
        reason: 'This provides significant efficiency improvements.',
        timestamp: Date.now() - 90000
      }
    ],
    txHash: '0xa1b2c3d4e5f6g7h8i9j0...'
  }
];

export const transactions: Transaction[] = [
  {
    hash: '0x1a2b3c4d5e6f7g8h9i0j...',
    type: 'proposal',
    timestamp: Date.now() - 1000000,
    status: 'confirmed',
    from: '0x1234...5678',
    to: '0xDAO...Contract',
    proposalId: 'prop-1'
  },
  {
    hash: '0xa1b2c3d4e5f6g7h8i9j0...',
    type: 'vote',
    timestamp: Date.now() - 400000,
    status: 'confirmed',
    from: 'agent-1',
    to: '0xDAO...Contract',
    proposalId: 'prop-2'
  },
  {
    hash: '0xz1y2x3w4v5u6t7s8r9q0...',
    type: 'vote',
    timestamp: Date.now() - 250000,
    status: 'confirmed',
    from: 'agent-1',
    to: '0xDAO...Contract',
    proposalId: 'prop-3'
  },
  {
    hash: '0xq1w2e3r4t5y6u7i8o9p0...',
    type: 'vote',
    timestamp: Date.now() - 225000,
    status: 'confirmed',
    from: 'agent-2',
    to: '0xDAO...Contract',
    proposalId: 'prop-3'
  },
  {
    hash: '0xm1n2b3v4c5x6z7l8k9j0...',
    type: 'execution',
    timestamp: Date.now() - 50000,
    status: 'confirmed',
    from: '0xDAO...Contract',
    to: '0x5678...9abc',
    value: '15000',
    gasUsed: '350000',
    proposalId: 'prop-5'
  }
];

export const network: Network = {
  nodes: [
    { id: 'node-1', type: 'agent', entityId: 'agent-1' },
    { id: 'node-2', type: 'agent', entityId: 'agent-2' },
    { id: 'node-3', type: 'agent', entityId: 'agent-3' },
    { id: 'node-4', type: 'proposal', entityId: 'prop-1' },
    { id: 'node-5', type: 'proposal', entityId: 'prop-2' },
    { id: 'node-6', type: 'proposal', entityId: 'prop-3' },
    { id: 'node-7', type: 'proposal', entityId: 'prop-4' },
    { id: 'node-8', type: 'proposal', entityId: 'prop-5' }
  ],
  links: [
    { source: 'node-1', target: 'node-5', value: 1, type: 'vote' },
    { source: 'node-1', target: 'node-6', value: 1, type: 'vote' },
    { source: 'node-2', target: 'node-6', value: 1, type: 'vote' },
    { source: 'node-1', target: 'node-7', value: 1, type: 'vote' },
    { source: 'node-2', target: 'node-7', value: 1, type: 'vote' },
    { source: 'node-3', target: 'node-7', value: 1, type: 'vote' },
    { source: 'node-1', target: 'node-8', value: 1, type: 'vote' },
    { source: 'node-2', target: 'node-8', value: 1, type: 'vote' },
    { source: 'node-3', target: 'node-8', value: 1, type: 'vote' },
    { source: 'node-1', target: 'node-2', value: 1, type: 'debate' },
    { source: 'node-2', target: 'node-3', value: 1, type: 'debate' },
    { source: 'node-3', target: 'node-1', value: 1, type: 'debate' },
    { source: 'node-4', target: 'node-1', value: 1, type: 'routing' },
    { source: 'node-4', target: 'node-2', value: 1, type: 'routing' },
    { source: 'node-4', target: 'node-3', value: 1, type: 'routing' }
  ]
};
