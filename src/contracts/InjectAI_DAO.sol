
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title InjectAI DAO Contract
 * @dev Smart contract to manage autonomous multi-agent governance for DAOs
 */
contract InjectAIDAO {
    // Enum for proposal types
    enum ProposalType {
        Funding,
        Governance,
        Development,
        Community,
        Other
    }
    
    // Enum for proposal status
    enum ProposalStatus {
        Pending,
        Reviewing,
        Debating,
        Voting,
        Approved,
        Rejected,
        Executed
    }
    
    // Enum for vote types
    enum VoteType {
        Approve,
        Reject,
        Revise
    }
    
    // Enum for agent types
    enum AgentType {
        Strategist,
        Ethicist,
        Optimizer
    }
    
    // Enum for agent status
    enum AgentStatus {
        Idle,
        Analyzing,
        Voting,
        Debating
    }
    
    // Struct for proposals
    struct Proposal {
        uint256 id;
        string title;
        string description;
        ProposalType proposalType;
        ProposalStatus status;
        uint256 createdAt;
        uint256 updatedAt;
        address author;
        string budget;
        string timeline;
        uint256 approvalCount;
        uint256 rejectionCount;
        uint256 revisionCount;
    }
    
    // Struct for agent votes
    struct AgentVote {
        uint256 agentId;
        VoteType vote;
        string reason;
        uint256 timestamp;
    }
    
    // Struct for agents
    struct Agent {
        uint256 id;
        string name;
        AgentType agentType;
        string description;
        AgentStatus status;
        address controller; // Address that controls this agent
    }
    
    // State variables
    uint256 private nextProposalId = 1;
    uint256 private nextAgentId = 1;
    address public owner;
    uint256 public requiredApprovals = 2; // Default threshold for proposal approval
    
    // Mappings
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => Agent) public agents;
    mapping(uint256 => mapping(uint256 => bool)) public agentVoted; // proposalId => agentId => hasVoted
    mapping(uint256 => AgentVote[]) public proposalVotes; // proposalId => votes
    
    // Events
    event ProposalCreated(uint256 indexed proposalId, address indexed author, string title);
    event ProposalStatusChanged(uint256 indexed proposalId, ProposalStatus newStatus);
    event VoteCast(uint256 indexed proposalId, uint256 indexed agentId, VoteType vote, string reason);
    event AgentRegistered(uint256 indexed agentId, string name, AgentType agentType);
    event AgentStatusChanged(uint256 indexed agentId, AgentStatus newStatus);
    event ProposalExecuted(uint256 indexed proposalId);
    
    // Constructor
    constructor() {
        owner = msg.sender;
        
        // Initialize default agents
        _registerAgent("The Strategist", AgentType.Strategist, "Assesses strategic impact and alignment");
        _registerAgent("The Ethicist", AgentType.Ethicist, "Evaluates ethical implications and community values");
        _registerAgent("The Optimizer", AgentType.Optimizer, "Analyzes technical efficiency and resource optimization");
    }
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyAgentController(uint256 agentId) {
        require(agents[agentId].controller == msg.sender, "Only agent controller can call this function");
        _;
    }
    
    modifier proposalExists(uint256 proposalId) {
        require(proposals[proposalId].id == proposalId, "Proposal does not exist");
        _;
    }
    
    modifier agentExists(uint256 agentId) {
        require(agents[agentId].id == agentId, "Agent does not exist");
        _;
    }
    
    // Public functions
    
    /**
     * @dev Create a new proposal
     * @param title Proposal title
     * @param description Detailed description
     * @param proposalType Type of proposal
     * @param budget Optional budget information
     * @param timeline Optional timeline information
     * @return proposalId The ID of the created proposal
     */
    function createProposal(
        string memory title,
        string memory description,
        uint8 proposalType,
        string memory budget,
        string memory timeline
    ) external returns (uint256) {
        require(bytes(title).length > 0, "Title cannot be empty");
        require(bytes(description).length > 0, "Description cannot be empty");
        require(proposalType <= uint8(ProposalType.Other), "Invalid proposal type");
        
        uint256 proposalId = nextProposalId++;
        
        Proposal storage newProposal = proposals[proposalId];
        newProposal.id = proposalId;
        newProposal.title = title;
        newProposal.description = description;
        newProposal.proposalType = ProposalType(proposalType);
        newProposal.status = ProposalStatus.Pending;
        newProposal.createdAt = block.timestamp;
        newProposal.updatedAt = block.timestamp;
        newProposal.author = msg.sender;
        newProposal.budget = budget;
        newProposal.timeline = timeline;
        
        emit ProposalCreated(proposalId, msg.sender, title);
        
        return proposalId;
    }
    
    /**
     * @dev Vote on a proposal as an agent
     * @param proposalId ID of the proposal
     * @param agentId ID of the voting agent
     * @param vote Type of vote (approve, reject, revise)
     * @param reason Explanation for the vote
     */
    function voteOnProposal(
        uint256 proposalId,
        uint256 agentId,
        uint8 vote,
        string memory reason
    ) external proposalExists(proposalId) agentExists(agentId) onlyAgentController(agentId) {
        require(vote <= uint8(VoteType.Revise), "Invalid vote type");
        require(!agentVoted[proposalId][agentId], "Agent has already voted on this proposal");
        require(
            proposals[proposalId].status == ProposalStatus.Reviewing ||
            proposals[proposalId].status == ProposalStatus.Voting,
            "Proposal is not in a votable state"
        );
        
        // Record the vote
        AgentVote memory newVote = AgentVote({
            agentId: agentId,
            vote: VoteType(vote),
            reason: reason,
            timestamp: block.timestamp
        });
        
        proposalVotes[proposalId].push(newVote);
        agentVoted[proposalId][agentId] = true;
        
        // Update vote counts
        Proposal storage proposal = proposals[proposalId];
        if (VoteType(vote) == VoteType.Approve) {
            proposal.approvalCount++;
        } else if (VoteType(vote) == VoteType.Reject) {
            proposal.rejectionCount++;
        } else if (VoteType(vote) == VoteType.Revise) {
            proposal.revisionCount++;
        }
        
        proposal.updatedAt = block.timestamp;
        
        emit VoteCast(proposalId, agentId, VoteType(vote), reason);
        
        // Check if voting threshold is met
        _checkVotingThreshold(proposalId);
    }
    
    /**
     * @dev Change the status of a proposal
     * @param proposalId ID of the proposal
     * @param newStatus New status to set
     */
    function changeProposalStatus(uint256 proposalId, uint8 newStatus) 
        external 
        proposalExists(proposalId) 
        onlyOwner 
    {
        require(newStatus <= uint8(ProposalStatus.Executed), "Invalid proposal status");
        proposals[proposalId].status = ProposalStatus(newStatus);
        proposals[proposalId].updatedAt = block.timestamp;
        
        emit ProposalStatusChanged(proposalId, ProposalStatus(newStatus));
    }
    
    /**
     * @dev Execute an approved proposal
     * @param proposalId ID of the proposal to execute
     */
    function executeProposal(uint256 proposalId) 
        external 
        proposalExists(proposalId) 
        onlyOwner 
    {
        require(
            proposals[proposalId].status == ProposalStatus.Approved,
            "Only approved proposals can be executed"
        );
        
        proposals[proposalId].status = ProposalStatus.Executed;
        proposals[proposalId].updatedAt = block.timestamp;
        
        emit ProposalExecuted(proposalId);
        emit ProposalStatusChanged(proposalId, ProposalStatus.Executed);
    }
    
    /**
     * @dev Register a new agent
     * @param name Agent name
     * @param agentType Type of agent
     * @param description Agent description
     * @return agentId The ID of the registered agent
     */
    function registerAgent(
        string memory name,
        uint8 agentType,
        string memory description
    ) external onlyOwner returns (uint256) {
        require(agentType <= uint8(AgentType.Optimizer), "Invalid agent type");
        return _registerAgent(name, AgentType(agentType), description);
    }
    
    /**
     * @dev Set an agent's controller address
     * @param agentId ID of the agent
     * @param controller Address that can control this agent
     */
    function setAgentController(uint256 agentId, address controller) 
        external 
        agentExists(agentId) 
        onlyOwner 
    {
        agents[agentId].controller = controller;
    }
    
    /**
     * @dev Set agent status
     * @param agentId ID of the agent
     * @param status New status
     */
    function setAgentStatus(uint256 agentId, uint8 status) 
        external 
        agentExists(agentId) 
        onlyAgentController(agentId) 
    {
        require(status <= uint8(AgentStatus.Debating), "Invalid agent status");
        agents[agentId].status = AgentStatus(status);
        
        emit AgentStatusChanged(agentId, AgentStatus(status));
    }
    
    /**
     * @dev Set required approvals for proposal acceptance
     * @param count Number of approvals required
     */
    function setRequiredApprovals(uint256 count) external onlyOwner {
        requiredApprovals = count;
    }
    
    /**
     * @dev Get proposal details
     * @param proposalId ID of the proposal
     * @return Proposal details
     */
    function getProposal(uint256 proposalId) 
        external 
        view 
        proposalExists(proposalId) 
        returns (Proposal memory) 
    {
        return proposals[proposalId];
    }
    
    /**
     * @dev Get agent details
     * @param agentId ID of the agent
     * @return Agent details
     */
    function getAgent(uint256 agentId) 
        external 
        view 
        agentExists(agentId) 
        returns (Agent memory) 
    {
        return agents[agentId];
    }
    
    /**
     * @dev Get votes for a proposal
     * @param proposalId ID of the proposal
     * @return Array of votes
     */
    function getProposalVotes(uint256 proposalId) 
        external 
        view 
        proposalExists(proposalId) 
        returns (AgentVote[] memory) 
    {
        return proposalVotes[proposalId];
    }
    
    // Internal functions
    
    /**
     * @dev Internal function to register a new agent
     */
    function _registerAgent(
        string memory name,
        AgentType agentType,
        string memory description
    ) internal returns (uint256) {
        uint256 agentId = nextAgentId++;
        
        Agent storage newAgent = agents[agentId];
        newAgent.id = agentId;
        newAgent.name = name;
        newAgent.agentType = agentType;
        newAgent.description = description;
        newAgent.status = AgentStatus.Idle;
        newAgent.controller = owner; // Default controller is the owner
        
        emit AgentRegistered(agentId, name, agentType);
        
        return agentId;
    }
    
    /**
     * @dev Check if voting threshold is met and update proposal status
     */
    function _checkVotingThreshold(uint256 proposalId) internal {
        Proposal storage proposal = proposals[proposalId];
        
        // If approval threshold is met
        if (proposal.approvalCount >= requiredApprovals) {
            proposal.status = ProposalStatus.Approved;
            emit ProposalStatusChanged(proposalId, ProposalStatus.Approved);
        }
        // If rejection threshold is met (we're using the same threshold for simplicity)
        else if (proposal.rejectionCount >= requiredApprovals) {
            proposal.status = ProposalStatus.Rejected;
            emit ProposalStatusChanged(proposalId, ProposalStatus.Rejected);
        }
        // If revision threshold is met and exceeds approvals
        else if (proposal.revisionCount >= requiredApprovals && 
                proposal.revisionCount > proposal.approvalCount) {
            // Keep in reviewing state to allow for revisions
            if (proposal.status != ProposalStatus.Reviewing) {
                proposal.status = ProposalStatus.Reviewing;
                emit ProposalStatusChanged(proposalId, ProposalStatus.Reviewing);
            }
        }
    }
}
