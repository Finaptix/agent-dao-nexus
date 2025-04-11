
import { ethers } from "ethers";

// ABI for the DAO Contract - this should match the Solidity contract
const DAO_ABI = [
  // Proposal functions
  "function createProposal(string title, string description, uint8 proposalType, string budget, string timeline) external returns (uint256)",
  "function voteOnProposal(uint256 proposalId, uint256 agentId, uint8 vote, string reason) external",
  "function executeProposal(uint256 proposalId) external",
  "function getProposal(uint256 proposalId) external view returns (tuple(uint256 id, string title, string description, uint8 proposalType, uint8 status, uint256 createdAt, uint256 updatedAt, address author, string budget, string timeline))",
  
  // Agent functions
  "function registerAgent(string name, uint8 agentType, string description) external returns (uint256)",
  "function getAgent(uint256 agentId) external view returns (tuple(uint256 id, string name, uint8 agentType, string description, uint8 status))",
  
  // Status and Info
  "function owner() external view returns (address)",
  "function requiredApprovals() external view returns (uint256)",
  "function setRequiredApprovals(uint256 count) external",
  
  // Events
  "event ProposalCreated(uint256 indexed proposalId, address indexed author, string title)",
  "event VoteCast(uint256 indexed proposalId, uint256 indexed agentId, uint8 vote, string reason)",
  "event ProposalStatusChanged(uint256 indexed proposalId, uint8 newStatus)"
];

export class DAOContract {
  private contract: ethers.Contract;
  private address: string = "";
  
  constructor(provider: ethers.providers.Web3Provider) {
    const signer = provider.getSigner();
    // Initialize with empty address - will be set later
    this.contract = new ethers.Contract("0x0000000000000000000000000000000000000000", DAO_ABI, signer);
  }
  
  setContractAddress(address: string) {
    this.address = address;
    this.contract = new ethers.Contract(address, DAO_ABI, this.contract.signer);
  }
  
  getContractAddress(): string {
    return this.address;
  }
  
  async isDeployed(): Promise<boolean> {
    try {
      const code = await this.contract.provider.getCode(this.address);
      return code !== "0x";
    } catch (error) {
      return false;
    }
  }
  
  async createProposal(
    title: string,
    description: string,
    proposalType: number, // 0: funding, 1: governance, etc.
    budget: string,
    timeline: string
  ): Promise<string> {
    try {
      if (!this.address || this.address === "0x0000000000000000000000000000000000000000") {
        throw new Error("Contract address not set");
      }
      
      const tx = await this.contract.createProposal(title, description, proposalType, budget, timeline);
      await tx.wait();
      return tx.hash;
    } catch (error: any) {
      console.error("Error creating proposal:", error);
      throw new Error(error.message || "Failed to create proposal");
    }
  }
  
  async voteOnProposal(
    proposalId: number,
    agentId: number,
    vote: number, // 0: approve, 1: reject, 2: revise
    reason: string
  ): Promise<string> {
    try {
      const tx = await this.contract.voteOnProposal(proposalId, agentId, vote, reason);
      await tx.wait();
      return tx.hash;
    } catch (error: any) {
      console.error("Error voting on proposal:", error);
      throw new Error(error.message || "Failed to vote on proposal");
    }
  }
  
  async executeProposal(proposalId: number): Promise<string> {
    try {
      const tx = await this.contract.executeProposal(proposalId);
      await tx.wait();
      return tx.hash;
    } catch (error: any) {
      console.error("Error executing proposal:", error);
      throw new Error(error.message || "Failed to execute proposal");
    }
  }
  
  async getOwner(): Promise<string> {
    try {
      return await this.contract.owner();
    } catch (error) {
      console.error("Error getting owner:", error);
      return "";
    }
  }
  
  async getRequiredApprovals(): Promise<number> {
    try {
      const result = await this.contract.requiredApprovals();
      return result.toNumber();
    } catch (error) {
      console.error("Error getting required approvals:", error);
      return 0;
    }
  }
  
  async setRequiredApprovals(count: number): Promise<string> {
    try {
      const tx = await this.contract.setRequiredApprovals(count);
      await tx.wait();
      return tx.hash;
    } catch (error: any) {
      console.error("Error setting required approvals:", error);
      throw new Error(error.message || "Failed to set required approvals");
    }
  }
  
  // Event listeners
  onProposalCreated(callback: (proposalId: number, author: string, title: string) => void): ethers.Contract {
    return this.contract.on("ProposalCreated", (proposalId, author, title) => {
      callback(proposalId.toNumber(), author, title);
    });
  }
  
  onVoteCast(callback: (proposalId: number, agentId: number, vote: number, reason: string) => void): ethers.Contract {
    return this.contract.on("VoteCast", (proposalId, agentId, vote, reason) => {
      callback(proposalId.toNumber(), agentId.toNumber(), vote, reason);
    });
  }
  
  onProposalStatusChanged(callback: (proposalId: number, newStatus: number) => void): ethers.Contract {
    return this.contract.on("ProposalStatusChanged", (proposalId, newStatus) => {
      callback(proposalId.toNumber(), newStatus);
    });
  }
  
  // Remove event listeners
  removeAllListeners(): void {
    this.contract.removeAllListeners();
  }
}

// Helper function to check if a contract exists at an address
export async function isContractAtAddress(provider: ethers.providers.Provider, address: string): Promise<boolean> {
  try {
    const code = await provider.getCode(address);
    return code !== "0x"; // If code length > 0, there's a contract at this address
  } catch (error) {
    console.error("Error checking contract:", error);
    return false;
  }
}
