// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Voting
 * @dev Implements a simple voting system
 * @notice This is a learning project - not for production use
 */

contract Voting {
    
    // ============ STATE VARIABLES ============
    
    struct Proposal {
        uint256 id;
        string title;
        string description;
        uint256 createdAt;
        uint256 deadline;
        uint256 yesVotes;
        uint256 noVotes;
        bool active;
        address creator;
    }
    
    address public owner;
    uint256 public proposalCount;
    uint256 public constant VOTING_PERIOD = 7 days;
    
    // Mappings
    mapping(uint256 => Proposal) public proposals;
    mapping(address => mapping(uint256 => bool)) public voters;
    
    // Events
    event ProposalCreated(
        uint256 indexed proposalId,
        string title,
        address indexed creator,
        uint256 deadline
    );
    
    event VoteCasted(
        uint256 indexed proposalId,
        address indexed voter,
        bool vote,
        uint256 timestamp
    );
    
    event ProposalClosed(
        uint256 indexed proposalId,
        uint256 yesVotes,
        uint256 noVotes
    );
    
    // ============ MODIFIERS ============
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }
    
    modifier proposalExists(uint256 _proposalId) {
        require(_proposalId > 0 && _proposalId <= proposalCount, "Proposal does not exist");
        _;
    }
    
    modifier proposalActive(uint256 _proposalId) {
        require(proposals[_proposalId].active, "Proposal is not active");
        require(block.timestamp <= proposals[_proposalId].deadline, "Voting period has ended");
        _;
    }
    
    modifier hasNotVoted(uint256 _proposalId) {
        require(!voters[msg.sender][_proposalId], "You have already voted on this proposal");
        _;
    }
    
    // ============ CONSTRUCTOR ============
    
    constructor() {
        owner = msg.sender;
        proposalCount = 0;
    }
    
    // ============ MAIN FUNCTIONS ============
    
    /**
     * @dev Create a new proposal
     * @param _title Title of the proposal
     * @param _description Description of the proposal
     */
    function createProposal(
        string memory _title,
        string memory _description
    ) public returns (uint256) {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");
        
        proposalCount++;
        uint256 proposalId = proposalCount;
        
        Proposal storage newProposal = proposals[proposalId];
        newProposal.id = proposalId;
        newProposal.title = _title;
        newProposal.description = _description;
        newProposal.createdAt = block.timestamp;
        newProposal.deadline = block.timestamp + VOTING_PERIOD;
        newProposal.yesVotes = 0;
        newProposal.noVotes = 0;
        newProposal.active = true;
        newProposal.creator = msg.sender;
        
        emit ProposalCreated(proposalId, _title, msg.sender, newProposal.deadline);
        
        return proposalId;
    }
    
    /**
     * @dev Cast a vote on a proposal
     * @param _proposalId ID of the proposal
     * @param _vote Vote choice (true for yes, false for no)
     */
    function vote(uint256 _proposalId, bool _vote)
        public
        proposalExists(_proposalId)
        proposalActive(_proposalId)
        hasNotVoted(_proposalId)
    {
        voters[msg.sender][_proposalId] = true;
        
        if (_vote) {
            proposals[_proposalId].yesVotes++;
        } else {
            proposals[_proposalId].noVotes++;
        }
        
        emit VoteCasted(_proposalId, msg.sender, _vote, block.timestamp);
    }
    
    /**
     * @dev Close a proposal (ends voting)
     * @param _proposalId ID of the proposal
     */
    function closeProposal(uint256 _proposalId)
        public
        proposalExists(_proposalId)
        onlyOwner
    {
        require(proposals[_proposalId].active, "Proposal already closed");
        
        proposals[_proposalId].active = false;
        
        emit ProposalClosed(
            _proposalId,
            proposals[_proposalId].yesVotes,
            proposals[_proposalId].noVotes
        );
    }
    
    // ============ VIEW FUNCTIONS ============
    
    /**
     * @dev Get proposal details - Returns 9 INDIVIDUAL VALUES (not tuple/struct)
     * @param _proposalId ID of the proposal
     */
    function getProposal(uint256 _proposalId)
        public
        view
        proposalExists(_proposalId)
        returns (
            uint256 id,
            string memory title,
            string memory description,
            uint256 createdAt,
            uint256 deadline,
            uint256 yesVotes,
            uint256 noVotes,
            bool active,
            address creator
        )
    {
        Proposal storage p = proposals[_proposalId];
        return (
            p.id,
            p.title,
            p.description,
            p.createdAt,
            p.deadline,
            p.yesVotes,
            p.noVotes,
            p.active,
            p.creator
        );
    }
    
    /**
     * @dev Get all proposals count
     */
    function getProposalCount() public view returns (uint256) {
        return proposalCount;
    }
    
    /**
     * @dev Check if an address has voted on a proposal
     * @param _voter Address of the voter
     * @param _proposalId ID of the proposal
     */
    function hasVoted(address _voter, uint256 _proposalId)
        public
        view
        proposalExists(_proposalId)
        returns (bool)
    {
        return voters[_voter][_proposalId];
    }
    
    /**
     * @dev Get voting results
     * @param _proposalId ID of the proposal
     */
    function getResults(uint256 _proposalId)
        public
        view
        proposalExists(_proposalId)
        returns (uint256 yes, uint256 no, bool isActive)
    {
        Proposal storage proposal = proposals[_proposalId];
        return (proposal.yesVotes, proposal.noVotes, proposal.active);
    }
    
    /**
     * @dev Get winning option
     * @param _proposalId ID of the proposal
     */
    function getWinner(uint256 _proposalId)
        public
        view
        proposalExists(_proposalId)
        returns (string memory)
    {
        Proposal storage proposal = proposals[_proposalId];
        
        if (proposal.active) {
            return "Voting still active";
        }
        
        if (proposal.yesVotes > proposal.noVotes) {
            return "YES wins";
        } else if (proposal.noVotes > proposal.yesVotes) {
            return "NO wins";
        } else {
            return "Tie";
        }
    }
    
    /**
     * @dev Check if proposal voting period has expired
     * @param _proposalId ID of the proposal
     */
    function isExpired(uint256 _proposalId)
        public
        view
        proposalExists(_proposalId)
        returns (bool)
    {
        return block.timestamp > proposals[_proposalId].deadline;
    }
}
