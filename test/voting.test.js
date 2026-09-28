const Voting = artifacts.require("Voting");

contract("Voting", accounts => {
    let votingInstance;
    const owner = accounts[0];
    const voter1 = accounts[1];
    const voter2 = accounts[2];
    const voter3 = accounts[3];
    
    // Deploy contract before each test
    beforeEach(async () => {
        votingInstance = await Voting.new();
    });
    
    // ============ BASIC TESTS ============
    
    describe("Deployment", () => {
        it("should deploy contract successfully", async () => {
            const address = votingInstance.address;
            assert.notEqual(address, 0x0);
            assert.notEqual(address, "");
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
        });
        
        it("should set owner correctly", async () => {
            const contractOwner = await votingInstance.owner();
            assert.equal(contractOwner, owner, "Owner not set correctly");
        });
        
        it("should initialize proposalCount to 0", async () => {
            const count = await votingInstance.getProposalCount();
            assert.equal(count, 0, "Proposal count should be 0");
        });
    });
    
    // ============ PROPOSAL CREATION TESTS ============
    
    describe("Creating Proposals", () => {
        it("should create a proposal", async () => {
            const title = "Test Proposal";
            const description = "This is a test proposal";
            
            const result = await votingInstance.createProposal(title, description, { from: owner });
            
            assert.equal(result.receipt.status, true, "Transaction failed");
        });
        
        it("should increment proposal count", async () => {
            await votingInstance.createProposal("Proposal 1", "Description 1", { from: owner });
            await votingInstance.createProposal("Proposal 2", "Description 2", { from: owner });
            
            const count = await votingInstance.getProposalCount();
            assert.equal(count, 2, "Proposal count not incremented");
        });
        
        it("should reject empty title", async () => {
            try {
                await votingInstance.createProposal("", "Description", { from: owner });
                assert.fail("Should throw error for empty title");
            } catch (error) {
                assert(error.message.includes("Title cannot be empty"));
            }
        });
        
        it("should reject empty description", async () => {
            try {
                await votingInstance.createProposal("Title", "", { from: owner });
                assert.fail("Should throw error for empty description");
            } catch (error) {
                assert(error.message.includes("Description cannot be empty"));
            }
        });
        
        it("should store proposal details correctly", async () => {
            const title = "New Proposal";
            const desc = "Test description";
            
            await votingInstance.createProposal(title, desc, { from: owner });
            const proposal = await votingInstance.getProposal(1);
            
            assert.equal(proposal.title, title, "Title not stored correctly");
            assert.equal(proposal.description, desc, "Description not stored correctly");
            assert.equal(proposal.id, 1, "ID not set correctly");
            assert.equal(proposal.creator, owner, "Creator not set correctly");
            assert.equal(proposal.yesVotes, 0, "Initial votes should be 0");
            assert.equal(proposal.noVotes, 0, "Initial votes should be 0");
            assert.equal(proposal.active, true, "Proposal should be active");
        });
    });
    
    // ============ VOTING TESTS ============
    
    describe("Voting", () => {
        beforeEach(async () => {
            await votingInstance.createProposal("Vote Test", "Testing voting", { from: owner });
        });
        
        it("should allow voting on active proposal", async () => {
            const result = await votingInstance.vote(1, true, { from: voter1 });
            assert.equal(result.receipt.status, true, "Voting transaction failed");
        });
        
        it("should increment yes votes", async () => {
            await votingInstance.vote(1, true, { from: voter1 });
            await votingInstance.vote(1, true, { from: voter2 });
            
            const results = await votingInstance.getResults(1);
            assert.equal(results.yes, 2, "Yes votes not incremented");
        });
        
        it("should increment no votes", async () => {
            await votingInstance.vote(1, false, { from: voter1 });
            await votingInstance.vote(1, false, { from: voter2 });
            
            const results = await votingInstance.getResults(1);
            assert.equal(results.no, 2, "No votes not incremented");
        });
        
        it("should not allow voting twice", async () => {
            await votingInstance.vote(1, true, { from: voter1 });
            
            try {
                await votingInstance.vote(1, false, { from: voter1 });
                assert.fail("Should not allow double voting");
            } catch (error) {
                assert(error.message.includes("already voted"));
            }
        });
        
        it("should not allow creator to vote on own proposal", async () => {
            try {
                await votingInstance.vote(1, true, { from: owner });
                assert.fail("Creator should not be able to vote");
            } catch (error) {
                assert(error.message.includes("cannot vote"));
            }
        });
        
        it("should track voter status", async () => {
            await votingInstance.vote(1, true, { from: voter1 });
            
            const hasVoted = await votingInstance.hasVoted(voter1, 1);
            assert.equal(hasVoted, true, "Voter status not tracked");
        });
        
        it("should show correct voting results", async () => {
            await votingInstance.vote(1, true, { from: voter1 });
            await votingInstance.vote(1, true, { from: voter2 });
            await votingInstance.vote(1, false, { from: voter3 });
            
            const results = await votingInstance.getResults(1);
            assert.equal(results.yes, 2, "Yes votes incorrect");
            assert.equal(results.no, 1, "No votes incorrect");
            assert.equal(results.isActive, true, "Proposal should be active");
        });
    });
    
    // ============ PROPOSAL STATUS TESTS ============
    
    describe("Proposal Status", () => {
        beforeEach(async () => {
            await votingInstance.createProposal("Status Test", "Testing status", { from: owner });
        });
        
        it("should check if proposal is active", async () => {
            const proposal = await votingInstance.getProposal(1);
            assert.equal(proposal.active, true, "Proposal should be active");
        });
        
        it("should allow closing proposal by owner", async () => {
            const result = await votingInstance.closeProposal(1, { from: owner });
            assert.equal(result.receipt.status, true, "Close proposal failed");
        });
        
        it("should mark proposal as inactive after closing", async () => {
            await votingInstance.closeProposal(1, { from: owner });
            
            const proposal = await votingInstance.getProposal(1);
            assert.equal(proposal.active, false, "Proposal should be inactive");
        });
        
        it("should not allow non-owner to close proposal", async () => {
            try {
                await votingInstance.closeProposal(1, { from: voter1 });
                assert.fail("Non-owner should not be able to close");
            } catch (error) {
                assert(error.message.includes("Only owner"));
            }
        });
        
        it("should not allow voting on closed proposal", async () => {
            await votingInstance.closeProposal(1, { from: owner });
            
            try {
                await votingInstance.vote(1, true, { from: voter1 });
                assert.fail("Should not allow voting on closed proposal");
            } catch (error) {
                assert(error.message.includes("not active"));
            }
        });
    });
    
    // ============ EDGE CASES ============
    
    describe("Edge Cases", () => {
        it("should reject voting on non-existent proposal", async () => {
            try {
                await votingInstance.vote(999, true, { from: voter1 });
                assert.fail("Should reject non-existent proposal");
            } catch (error) {
                assert(error.message.includes("does not exist"));
            }
        });
        
        it("should reject getting non-existent proposal", async () => {
            try {
                await votingInstance.getProposal(999);
                assert.fail("Should reject non-existent proposal");
            } catch (error) {
                assert(error.message.includes("does not exist"));
            }
        });
        
        it("should handle multiple proposals correctly", async () => {
            await votingInstance.createProposal("Proposal 1", "Desc 1", { from: owner });
            await votingInstance.createProposal("Proposal 2", "Desc 2", { from: voter1 });
            await votingInstance.createProposal("Proposal 3", "Desc 3", { from: voter2 });
            
            const count = await votingInstance.getProposalCount();
            assert.equal(count, 3, "Should have 3 proposals");
            
            // Verify each proposal
            const p1 = await votingInstance.getProposal(1);
            const p2 = await votingInstance.getProposal(2);
            const p3 = await votingInstance.getProposal(3);
            
            assert.equal(p1.id, 1);
            assert.equal(p2.id, 2);
            assert.equal(p3.id, 3);
        });
        
        it("should prevent voter from voting on multiple proposals with same vote", async () => {
            await votingInstance.createProposal("P1", "D1", { from: owner });
            await votingInstance.createProposal("P2", "D2", { from: voter2 });
            
            // Should be able to vote on both (different proposals)
            await votingInstance.vote(1, true, { from: voter1 });
            await votingInstance.vote(2, true, { from: voter1 });
            
            const hasVoted1 = await votingInstance.hasVoted(voter1, 1);
            const hasVoted2 = await votingInstance.hasVoted(voter1, 2);
            
            assert.equal(hasVoted1, true);
            assert.equal(hasVoted2, true);
        });
    });
    
    // ============ GAS TESTS ============
    
    describe("Gas Efficiency", () => {
        it("should track gas usage for proposal creation", async () => {
            const result = await votingInstance.createProposal("Gas Test", "Testing gas", { from: owner });
            console.log(`\n⛽ Gas used for proposal creation: ${result.receipt.gasUsed}`);
            
            // Gas should be reasonable (less than 200,000)
            assert.isBelow(result.receipt.gasUsed, 200000, "Gas usage too high");
        });
        
        it("should track gas usage for voting", async () => {
            await votingInstance.createProposal("P", "D", { from: owner });
            
            const result = await votingInstance.vote(1, true, { from: voter1 });
            console.log(`⛽ Gas used for voting: ${result.receipt.gasUsed}`);
            
            assert.isBelow(result.receipt.gasUsed, 150000, "Gas usage too high");
        });
    });
});
