import React, { createContext, useContext, useState, useEffect } from 'react';
import { Agent, Proposal, Transaction, Network, ProposalStatus, AgentVote } from '@/types';
import { agents as mockAgents, proposals as mockProposals, transactions as mockTransactions, network as mockNetwork } from '@/data/mockData';
import { toast } from 'sonner'; 
import { ethers } from 'ethers';
import { DAOContract } from '@/contracts/DAOContract';

interface AppContextType {
  agents: Agent[];
  proposals: Proposal[];
  transactions: Transaction[];
  network: Network;
  loading: boolean;
  selectedProposal: Proposal | null;
  walletConnected: boolean;
  walletAddress: string | null;
  provider: ethers.providers.Web3Provider | null;
  daoContract: DAOContract | null;
  isCorrectNetwork: boolean;
  updateProposalStatus: (proposalId: string, status: ProposalStatus) => void;
  addProposal: (proposal: Omit<Proposal, 'id' | 'createdAt' | 'updatedAt' | 'votes'>) => void;
  addAgentVote: (proposalId: string, vote: Omit<AgentVote, 'timestamp'>) => void;
  simulateAgentActivity: () => void;
  selectProposal: (proposalId: string | null) => void;
  connectWallet: (address: string, provider: ethers.providers.Web3Provider) => void;
  disconnectWallet: () => void;
  checkAndSwitchNetwork: () => Promise<boolean>;
  setDAOContractAddress: (address: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [agents, setAgents] = useState<Agent[]>(mockAgents);
  const [proposals, setProposals] = useState<Proposal[]>(mockProposals);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [network, setNetwork] = useState<Network>(mockNetwork);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [daoContract, setDaoContract] = useState<DAOContract | null>(null);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState<boolean>(false);

  useEffect(() => {
    const savedAddress = localStorage.getItem('walletAddress');
    if (savedAddress) {
      setWalletAddress(savedAddress);
      setWalletConnected(true);
      
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        
        provider.getNetwork().then(network => {
          setIsCorrectNetwork(network.chainId === 1946);
          if (network.chainId !== 1946) {
            toast.warning('Wrong Network', {
              description: 'Please connect to Minato Testnet (Chain ID: 1946)'
            });
          }
        });
        
        const contractAddress = localStorage.getItem('daoContractAddress');
        if (contractAddress) {
          const contract = new DAOContract(provider);
          contract.setContractAddress(contractAddress);
          setDaoContract(contract);
        }
      }
    }
    
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setWalletAddress(accounts[0]);
          localStorage.setItem('walletAddress', accounts[0]);
          toast.info('Account Changed', {
            description: `Switched to ${accounts[0].substring(0, 6)}...${accounts[0].substring(accounts[0].length - 4)}`
          });
        }
      });
      
      window.ethereum.on('chainChanged', (chainId: string) => {
        const chainIdNumber = parseInt(chainId, 16);
        setIsCorrectNetwork(chainIdNumber === 1946);
        
        if (chainIdNumber !== 1946) {
          toast.warning('Network Changed', {
            description: 'Please connect to Minato Testnet (Chain ID: 1946)'
          });
        } else {
          toast.success('Connected to Minato Testnet', {
            description: 'Chain ID: 1946'
          });
        }
      });
    }
    
    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  const checkAndSwitchNetwork = async (): Promise<boolean> => {
    if (!provider || !window.ethereum) return false;
    
    try {
      const network = await provider.getNetwork();
      if (network.chainId !== 1946) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x79A' }],
          });
          return true;
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: '0x79A',
                    chainName: 'Minato Testnet',
                    nativeCurrency: {
                      name: 'ETH',
                      symbol: 'ETH',
                      decimals: 18,
                    },
                    rpcUrls: ['https://rpc.minato.soneium.org/'],
                    blockExplorerUrls: ['https://explorer-testnet.soneium.org/'],
                  },
                ],
              });
              return true;
            } catch (addError: any) {
              toast.error('Network Configuration Failed', {
                description: addError.message || 'Failed to add Minato network to MetaMask'
              });
              return false;
            }
          } else {
            toast.error('Network Switch Failed', {
              description: switchError.message || 'Failed to switch to Minato network'
            });
            return false;
          }
        }
      }
      return true;
    } catch (error) {
      console.error("Error checking network:", error);
      return false;
    }
  };

  const connectWallet = async (address: string, web3Provider: ethers.providers.Web3Provider) => {
    setWalletConnected(true);
    setWalletAddress(address);
    setProvider(web3Provider);
    localStorage.setItem('walletAddress', address);
    
    const network = await web3Provider.getNetwork();
    setIsCorrectNetwork(network.chainId === 1946);
    
    const contractAddress = localStorage.getItem('daoContractAddress');
    if (contractAddress) {
      const contract = new DAOContract(web3Provider);
      contract.setContractAddress(contractAddress);
      setDaoContract(contract);
    }
    
    if (network.chainId !== 1946) {
      toast.warning('Wrong Network', {
        description: 'Please connect to Minato Testnet to use all features'
      });
    }
  };

  const setDAOContractAddress = (address: string) => {
    if (!provider) {
      toast.error('Wallet Not Connected', {
        description: 'Please connect your wallet first'
      });
      return;
    }
    
    try {
      const contract = new DAOContract(provider);
      contract.setContractAddress(address);
      setDaoContract(contract);
      localStorage.setItem('daoContractAddress', address);
      
      toast.success('Contract Connected', {
        description: 'DAO contract connected successfully'
      });
    } catch (error: any) {
      toast.error('Contract Connection Failed', {
        description: error.message || 'Failed to connect to contract'
      });
    }
  };

  const disconnectWallet = () => {
    setWalletConnected(false);
    setWalletAddress(null);
    setProvider(null);
    setDaoContract(null);
    setIsCorrectNetwork(false);
    localStorage.removeItem('walletAddress');
  };

  const updateProposalStatus = (proposalId: string, status: ProposalStatus) => {
    setProposals(prev => 
      prev.map(p => 
        p.id === proposalId 
          ? { ...p, status, updatedAt: Date.now() } 
          : p
      )
    );

    if (status === 'approved' || status === 'rejected' || status === 'executed') {
      const newTxHash = `0x${Math.random().toString(16).substring(2, 10)}...`;
      
      const newTransaction: Transaction = {
        hash: newTxHash,
        type: status === 'executed' ? 'execution' : 'vote',
        timestamp: Date.now(),
        status: 'confirmed',
        from: '0xDAO...Contract',
        to: '0xDAO...Contract',
        proposalId: proposalId
      };
      
      setTransactions(prev => [...prev, newTransaction]);
      
      setProposals(prev => 
        prev.map(p => 
          p.id === proposalId 
            ? { ...p, txHash: newTxHash } 
            : p
        )
      );

      toast(`Proposal ${status}`, {
        description: `The proposal has been ${status} and recorded on-chain`,
      });
    }
  };

  const addProposal = (proposal: Omit<Proposal, 'id' | 'createdAt' | 'updatedAt' | 'votes'>) => {
    const id = `prop-${proposals.length + 1}`;
    const now = Date.now();
    const newProposal: Proposal = {
      ...proposal,
      id,
      createdAt: now,
      updatedAt: now,
      votes: [],
      status: 'pending'
    };

    setProposals(prev => [...prev, newProposal]);

    const newTxHash = `0x${Math.random().toString(16).substring(2, 10)}...`;
    
    const newTransaction: Transaction = {
      hash: newTxHash,
      type: 'proposal',
      timestamp: now,
      status: 'confirmed',
      from: proposal.author,
      to: '0xDAO...Contract',
      proposalId: id
    };
    
    setTransactions(prev => [...prev, newTransaction]);

    const newNodeId = `node-${network.nodes.length + 1}`;
    
    setNetwork(prev => ({
      nodes: [...prev.nodes, { id: newNodeId, type: 'proposal', entityId: id }],
      links: [
        ...prev.links,
        ...agents.map((agent, index) => ({
          source: `node-${index + 1}`,
          target: newNodeId,
          value: 1,
          type: 'routing' as const
        }))
      ]
    }));

    toast('Proposal Submitted', {
      description: 'Your proposal has been submitted to the DAO',
    });

    setTimeout(() => {
      updateProposalStatus(id, 'reviewing');
      simulateAgentReview(id);
    }, 2000);
  };

  const simulateAgentReview = (proposalId: string) => {
    setAgents(prev => 
      prev.map(agent => ({ ...agent, status: 'analyzing' }))
    );
    
    setTimeout(() => {
      setAgents(prev => 
        prev.map(agent => ({ ...agent, status: 'voting' }))
      );
      
      agents.forEach((agent, index) => {
        setTimeout(() => {
          const vote: AgentVote['vote'] = Math.random() > 0.3 ? 'approve' : 'revise';
          const reasons = {
            strategist: {
              approve: "This aligns with our long-term objectives and growth strategy.",
              revise: "We need more details on how this impacts our strategic roadmap."
            },
            ethicist: {
              approve: "The proposal meets our ethical standards and community values.",
              revise: "More consideration needed for diverse community impacts."
            },
            optimizer: {
              approve: "The implementation is technically sound and resource-efficient.",
              revise: "The technical specifications need to be optimized for better performance."
            }
          };
          
          addAgentVote(proposalId, {
            agentId: agent.id,
            vote,
            reason: reasons[agent.type][vote]
          });
        }, (index + 1) * 2000);
      });
      
      setTimeout(() => {
        const proposal = proposals.find(p => p.id === proposalId);
        if (proposal) {
          const approveCount = proposal.votes.filter(v => v.vote === 'approve').length;
          
          if (approveCount >= 2) {
            updateProposalStatus(proposalId, 'approved');
          } else {
            updateProposalStatus(proposalId, 'rejected');
          }
        }
        
        setAgents(prev => 
          prev.map(agent => ({ ...agent, status: 'idle' }))
        );
      }, agents.length * 2000 + 1000);
    }, 3000);
  };

  const addAgentVote = (proposalId: string, vote: Omit<AgentVote, 'timestamp'>) => {
    const agentVote: AgentVote = {
      ...vote,
      timestamp: Date.now()
    };

    setProposals(prev => 
      prev.map(p => 
        p.id === proposalId 
          ? { 
              ...p, 
              votes: [...p.votes, agentVote],
              updatedAt: Date.now()
            } 
          : p
      )
    );

    const newTxHash = `0x${Math.random().toString(16).substring(2, 10)}...`;
    
    const newTransaction: Transaction = {
      hash: newTxHash,
      type: 'vote',
      timestamp: Date.now(),
      status: 'confirmed',
      from: vote.agentId,
      to: '0xDAO...Contract',
      proposalId: proposalId
    };
    
    setTransactions(prev => [...prev, newTransaction]);

    const agentNode = network.nodes.find(node => node.entityId === vote.agentId);
    const proposalNode = network.nodes.find(node => node.entityId === proposalId);
    
    if (agentNode && proposalNode) {
      setNetwork(prev => ({
        ...prev,
        links: [
          ...prev.links.filter(link => 
            !(link.source === agentNode.id && 
              link.target === proposalNode.id && 
              link.type === 'vote')
          ),
          {
            source: agentNode.id,
            target: proposalNode.id,
            value: 1,
            type: 'vote' as const
          }
        ]
      }));
    }

    toast(`Agent ${vote.agentId.split('-')[1]} Voted`, {
      description: `Agent voted to ${vote.vote} proposal ${proposalId}`,
    });
  };

  const simulateAgentActivity = () => {
    const pendingProposals = proposals.filter(p => p.status === 'pending');
    
    if (pendingProposals.length > 0) {
      const randomProposal = pendingProposals[Math.floor(Math.random() * pendingProposals.length)];
      updateProposalStatus(randomProposal.id, 'reviewing');
      simulateAgentReview(randomProposal.id);
    } else {
      toast("No pending proposals", {
        description: "All proposals have been processed by the agents",
      });
    }
  };

  const selectProposal = (proposalId: string | null) => {
    if (!proposalId) {
      setSelectedProposal(null);
      return;
    }
    
    const proposal = proposals.find(p => p.id === proposalId);
    setSelectedProposal(proposal || null);
  };

  return (
    <AppContext.Provider
      value={{
        agents,
        proposals,
        transactions,
        network,
        loading,
        selectedProposal,
        walletConnected,
        walletAddress,
        provider,
        daoContract,
        isCorrectNetwork,
        updateProposalStatus,
        addProposal,
        addAgentVote,
        simulateAgentActivity,
        selectProposal,
        connectWallet,
        disconnectWallet,
        checkAndSwitchNetwork,
        setDAOContractAddress
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
