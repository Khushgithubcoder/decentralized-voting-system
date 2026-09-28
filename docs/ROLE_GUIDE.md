# 👥 Role-Based Development Guide

Complete guide for each team member role.

---

## 👨‍💻 ROLE 1: Smart Contract Developer

**Responsibilities:**
- Develop Solidity contracts
- Test contract logic
- Optimize gas usage
- Handle deployment
- Write technical documentation

### Week 1 Tasks

#### Task 1: Understand Solidity Basics
```bash
# Study these concepts:
# - Variables (state, local, global)
# - Functions (public, internal, view, pure)
# - Events and logging
# - Modifiers and restrictions
# - Gas optimization

# Resources:
# - https://docs.soliditylang.org/
# - https://solidity-by-example.org/
# - https://ethereum.org/en/developers/
```

#### Task 2: Review & Modify Voting.sol
```bash
# Copy Voting.sol to contracts/
cp Voting.sol contracts/

# Try these modifications:
# 1. Change VOTING_PERIOD from 7 days to 3 days
# 2. Add a minimum description length requirement
# 3. Add voter eligibility checks
```

#### Task 3: Compile Contract
```bash
# Compile Solidity to bytecode
truffle compile

# Output should show:
# ✓ Voting.sol compiled successfully
# ✓ ABI generated at build/contracts/Voting.json
```

#### Task 4: Test Contract Logic
```bash
# With Ganache running in another terminal:
ganache-cli

# In your terminal, run tests:
truffle test

# Expected output:
# passing 25 tests
```

#### Task 5: Analyze Gas Usage
```bash
# Run tests with verbose output
truffle test --verbose

# Look for gas usage in output:
# ⛽ Gas used for proposal creation: 78,543
# ⛽ Gas used for voting: 52,891

# Goal: Keep gas usage reasonable
# Proposal creation: < 200,000 gas
# Voting: < 150,000 gas
```

### Week 2 Tasks

#### Task 1: Optimize Gas
```solidity
// In Voting.sol, look for optimization opportunities

// Example: Use uint256 instead of larger types
uint256 yesVotes;  // Good - efficient
uint128 yesVotes;  // Less efficient

// Cache contract values
uint256 proposalId = proposalCount + 1;  // Good
proposalCount++;
uint256 proposalId = proposalCount;  // Less gas efficient
```

#### Task 2: Add Events
```solidity
// Events help track contract changes on frontend
event ProposalCreated(
    uint256 indexed proposalId,
    string title,
    address indexed creator,
    uint256 deadline
);

emit ProposalCreated(id, _title, msg.sender, deadline);
```

#### Task 3: Add Edge Case Handling
```solidity
// Handle zero addresses
require(msg.sender != address(0), "Invalid sender");

// Handle timestamp issues
require(block.timestamp < deadline, "Voting ended");

// Handle empty inputs
require(bytes(_title).length > 0, "Title empty");
```

#### Task 4: Document Contract
```solidity
// Add comprehensive comments

/**
 * @title Voting
 * @dev Implements a decentralized voting system
 * @author [Team Name]
 * @notice This contract allows users to create and vote on proposals
 */

/**
 * @dev Create a new proposal
 * @param _title The proposal title
 * @param _description Detailed description
 * @return proposalId The ID of created proposal
 */
function createProposal(
    string memory _title,
    string memory _description
) public returns (uint256) {
    // Implementation
}
```

### Commands Reference

```bash
# Compile contract
truffle compile

# Deploy to network
truffle migrate --network development

# Re-deploy (restart)
truffle migrate --network development --reset

# Test all
truffle test

# Test specific file
truffle test test/voting.test.js

# Test with verbose output
truffle test --verbose

# Interact with contract (Truffle Console)
truffle console --network development
# Then in console:
# > Voting.deployed()
# > contract = await Voting.deployed()
# > await contract.getProposalCount()
```

### Key Solidity Concepts

**State Variables:**
```solidity
address public owner;           // Stored on blockchain
mapping(uint => Proposal) proposals;  // Complex storage
uint256 public constant PERIOD = 7 days;  // Constant
```

**Functions:**
```solidity
function create() public { }        // Anyone can call
function create() internal { }      // Only this contract
function create() private { }       // Only this contract
function create() view returns (uint) { }  // Read-only
function create() pure { }          // No state access
```

**Modifiers:**
```solidity
modifier onlyOwner() {
    require(msg.sender == owner);
    _;  // Execute function
}

function close() onlyOwner { }  // Only owner can call
```

### Testing Template

```javascript
describe("Feature Name", () => {
    beforeEach(async () => {
        // Setup before each test
    });
    
    it("should do something", async () => {
        // Arrange
        const input = "value";
        
        // Act
        const result = await contract.method(input);
        
        // Assert
        assert.equal(result, expected);
    });
});
```

### Deployment Checklist

- [ ] Contract compiles without errors
- [ ] All tests pass (25+ tests)
- [ ] No warnings in compilation
- [ ] Gas usage optimized
- [ ] Events properly emit
- [ ] Edge cases handled
- [ ] Documentation complete
- [ ] Ready for integration

---

## 🔗 ROLE 2: Blockchain Integration Developer

**Responsibilities:**
- Connect Web3.js to frontend
- Handle wallet connections
- Create transaction logic
- Monitor blockchain interactions
- Handle errors and retries

### Week 1 Tasks

#### Task 1: Understand Web3.js
```javascript
// Web3 is JavaScript library for Ethereum

// 1. Initialize Web3
const web3 = new Web3(window.ethereum);

// 2. Get account
const accounts = await web3.eth.getAccounts();
const userAccount = accounts[0];

// 3. Create contract instance
const contract = new web3.eth.Contract(ABI, ADDRESS);

// 4. Call read functions (free)
const count = await contract.methods.getProposalCount().call();

// 5. Send transactions (costs gas)
const tx = await contract.methods.vote(1, true)
    .send({ from: userAccount });
```

#### Task 2: Setup Web3 Connection
```javascript
// In app.js, add connection function

async function connectWallet() {
    try {
        // Request wallet connection
        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
        });
        
        userAccount = accounts[0];
        console.log('Connected:', userAccount);
        
        // Update UI
        updateConnectionStatus(true);
        
    } catch (error) {
        console.error('Connection failed:', error);
    }
}
```

#### Task 3: Handle MetaMask Events
```javascript
// Listen for account changes
window.ethereum.on('accountsChanged', (accounts) => {
    if (accounts.length === 0) {
        console.log('Wallet disconnected');
        updateConnectionStatus(false);
    } else {
        userAccount = accounts[0];
        updateUI();
    }
});

// Listen for network changes
window.ethereum.on('chainChanged', (chainId) => {
    console.log('Network changed:', chainId);
    location.reload();  // Reload page
});
```

#### Task 4: Contract Interaction
```javascript
// Initialize contract
async function initContract(address) {
    contract = new web3.eth.Contract(ABI, address);
    
    // Test connection
    try {
        const count = await contract.methods
            .getProposalCount().call();
        console.log('Contract works:', count);
    } catch (error) {
        console.error('Contract error:', error);
    }
}

// Read data (no gas)
async function loadProposals() {
    const count = await contract.methods
        .getProposalCount().call();
    
    for (let i = 1; i <= count; i++) {
        const proposal = await contract.methods
            .getProposal(i).call();
        console.log('Proposal:', proposal);
    }
}

// Write transaction (costs gas)
async function createProposal(title, desc) {
    try {
        const tx = await contract.methods
            .createProposal(title, desc)
            .send({ from: userAccount });
        
        console.log('Transaction:', tx.transactionHash);
    } catch (error) {
        console.error('Transaction failed:', error);
    }
}
```

#### Task 5: Error Handling
```javascript
function showError(message) {
    console.error(message);
    // Show to user
    document.getElementById('error').textContent = message;
}

async function safeTransaction(method) {
    try {
        const tx = await method.send({ from: userAccount });
        return { success: true, tx };
    } catch (error) {
        if (error.message.includes('User denied')) {
            showError('Transaction cancelled by user');
        } else if (error.message.includes('Insufficient funds')) {
            showError('Not enough ETH for gas');
        } else if (error.message.includes('revert')) {
            showError('Transaction failed (contract logic)');
        } else {
            showError('Transaction error: ' + error.message);
        }
        return { success: false, error };
    }
}
```

### Week 2 Tasks

#### Task 1: Transaction Monitoring
```javascript
async function monitorTransaction(txHash) {
    // Wait for transaction receipt
    let receipt = null;
    let attempts = 0;
    
    while (receipt === null && attempts < 50) {
        receipt = await web3.eth.getTransactionReceipt(txHash);
        
        if (!receipt) {
            console.log('Waiting for confirmation...');
            await sleep(2000);  // Wait 2 seconds
            attempts++;
        }
    }
    
    if (receipt.status === true) {
        console.log('✅ Transaction successful!');
    } else {
        console.log('❌ Transaction failed!');
    }
    
    return receipt;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
```

#### Task 2: Real-time Updates
```javascript
async function watchForChanges() {
    // Poll for updates every 5 seconds
    setInterval(async () => {
        const count = await contract.methods
            .getProposalCount().call();
        
        if (count > currentCount) {
            console.log('New proposal detected!');
            loadProposals();  // Reload
            currentCount = count;
        }
    }, 5000);
}

// Or use events (better)
function watchEvents() {
    contract.events.ProposalCreated()
        .on('data', (event) => {
            console.log('New proposal:', event.returnValues);
            loadProposals();
        })
        .on('error', console.error);
}
```

#### Task 3: Data Serialization
```javascript
// Handle different data types

// Numbers (returned as strings from blockchain)
const votes = await contract.methods.getResults(1).call();
const yesVotes = Number(votes.yes);  // Convert to number
const noVotes = parseInt(votes.no);  // Alternative

// Addresses (returned in checksum format)
const creator = proposal.creator;
const normalized = creator.toLowerCase();  // For comparison

// Timestamps (in seconds, not milliseconds)
const deadline = Number(proposal.deadline) * 1000;  // Convert to ms
const date = new Date(deadline);

// Booleans
const isActive = proposal.active === true;  // Explicit check
const hasVoted = Boolean(votes);
```

#### Task 4: Gas Estimation
```javascript
async function estimateGas(proposalId, voteChoice) {
    try {
        const gasEstimate = await contract.methods
            .vote(proposalId, voteChoice)
            .estimateGas({ from: userAccount });
        
        console.log('Estimated gas:', gasEstimate);
        
        // Add 20% buffer
        const gasWithBuffer = Math.floor(gasEstimate * 1.2);
        console.log('Gas with buffer:', gasWithBuffer);
        
    } catch (error) {
        console.error('Gas estimation failed:', error);
    }
}
```

### Commands Reference

```javascript
// Check Web3 version
console.log(web3.version);

// Get chain ID
const chainId = await web3.eth.getChainId();

// Get gas price
const gasPrice = await web3.eth.getGasPrice();
console.log(web3.utils.fromWei(gasPrice, 'gwei'));

// Get account balance
const balance = await web3.eth.getBalance(userAccount);
console.log(web3.utils.fromWei(balance, 'ether'));

// Get transaction details
const tx = await web3.eth.getTransaction(txHash);

// Decode function call
const decoded = web3.eth.abi.decodeFunctionCall(ABI, data);
```

### Debugging Web3

```javascript
// Enable detailed logging
window.DEBUG = true;

function log(message, data) {
    if (window.DEBUG) {
        console.log(message, data);
    }
}

// Add network info to console
async function debugNetwork() {
    const chainId = await web3.eth.getChainId();
    const latestBlock = await web3.eth.getBlockNumber();
    const accounts = await web3.eth.getAccounts();
    const balance = await web3.eth.getBalance(accounts[0]);
    
    console.log({
        chainId,
        latestBlock,
        account: accounts[0],
        balance: web3.utils.fromWei(balance, 'ether')
    });
}
```

### Integration Checklist

- [ ] Web3.js loads without errors
- [ ] MetaMask connects successfully
- [ ] Contract initializes properly
- [ ] Can read data from blockchain
- [ ] Can send transactions
- [ ] Error handling works
- [ ] Events are monitored
- [ ] Data is properly serialized
- [ ] Gas estimation works
- [ ] Console has no errors

---

## 🎨 ROLE 3: Frontend Developer

**Responsibilities:**
- Design user interface
- Build HTML structure
- Create CSS styling
- Implement responsive design
- Improve user experience

### Week 1 Tasks

#### Task 1: Understand HTML Structure
```html
<!-- Semantic HTML -->
<header><!-- Top section --></header>
<main><!-- Main content --></main>
<section><!-- Content sections --></section>
<article><!-- Individual items --></article>
<footer><!-- Bottom section --></footer>
```

#### Task 2: Create Page Layout
```html
<!-- Basic structure in index.html -->
<div class="container">
    <!-- Header with title -->
    <header class="header">
        <h1>🗳️ Voting System</h1>
    </header>
    
    <!-- Connection status -->
    <div class="connection-status">
        <div id="status"></div>
        <button id="connectBtn">Connect</button>
    </div>
    
    <!-- Main content -->
    <main class="main-content">
        <section class="create-proposal">
            <!-- Form here -->
        </section>
        
        <section class="proposals-list">
            <!-- Proposals here -->
        </section>
    </main>
</div>
```

#### Task 3: Design Components
```html
<!-- Proposal Card -->
<div class="proposal-card">
    <h3 class="proposal-title">Title</h3>
    <p class="proposal-desc">Description</p>
    
    <div class="proposal-results">
        <div class="result-bar">
            <span>Yes: 5</span>
        </div>
        <div class="result-bar">
            <span>No: 3</span>
        </div>
    </div>
    
    <button class="btn btn-vote">Vote</button>
</div>
```

#### Task 4: Styling with CSS
```css
/* Modern dark theme */
:root {
    --primary: #6366f1;
    --secondary: #ec4899;
    --bg: #0f172a;
    --text: #f1f5f9;
}

body {
    font-family: 'Segoe UI', sans-serif;
    background: var(--bg);
    color: var(--text);
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.header {
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    padding: 40px;
    border-radius: 12px;
}
```

#### Task 5: Responsive Design
```css
/* Mobile first approach */
@media (max-width: 768px) {
    .container {
        padding: 10px;
    }
    
    .main-content {
        grid-template-columns: 1fr;  /* Single column */
    }
    
    .btn {
        width: 100%;  /* Full width buttons */
    }
}
```

### Week 2 Tasks

#### Task 1: Create Modal
```html
<!-- Voting Modal -->
<div id="voteModal" class="modal hidden">
    <div class="modal-content">
        <h2 id="modalTitle">Vote on Proposal</h2>
        
        <div class="modal-stats">
            <div class="stat-box">
                <p class="stat-label">Yes Votes</p>
                <p id="yesCount">0</p>
            </div>
            <div class="stat-box">
                <p class="stat-label">No Votes</p>
                <p id="noCount">0</p>
            </div>
        </div>
        
        <div class="voting-buttons">
            <button id="yesBtn" class="btn btn-yes">👍 YES</button>
            <button id="noBtn" class="btn btn-no">👎 NO</button>
        </div>
    </div>
</div>
```

#### Task 2: Modal Styling & Animation
```css
/* Modal */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background: var(--bg-secondary);
    border-radius: 12px;
    padding: 30px;
    max-width: 500px;
    animation: slideIn 0.3s ease;
}

@keyframes slideIn {
    from {
        transform: translateY(-50px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.modal.hidden {
    display: none;
}
```

#### Task 3: Loading States
```html
<!-- Loading Spinner -->
<div id="loadingSpinner" class="spinner hidden">
    <div class="spinner-circle"></div>
    <p id="loadingText">Processing...</p>
</div>
```

```css
.spinner {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.8);
    padding: 40px;
    border-radius: 12px;
    z-index: 2000;
}

.spinner-circle {
    border: 4px solid #333;
    border-top: 4px solid #6366f1;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}
```

#### Task 4: Forms & Input Validation
```html
<!-- Form -->
<div class="form-group">
    <label for="proposalTitle">Title:</label>
    <input 
        type="text" 
        id="proposalTitle" 
        placeholder="Enter title"
        maxlength="100"
        required
    >
    <span class="error-message" id="titleError"></span>
</div>

<div class="form-group">
    <label for="proposalDesc">Description:</label>
    <textarea 
        id="proposalDesc" 
        placeholder="Enter description"
        rows="4"
        maxlength="500"
        required
    ></textarea>
    <span class="error-message" id="descError"></span>
</div>
```

```javascript
// Form validation
function validateForm() {
    const title = document.getElementById('proposalTitle').value.trim();
    const desc = document.getElementById('proposalDesc').value.trim();
    
    let isValid = true;
    
    if (title.length === 0) {
        document.getElementById('titleError').textContent = 'Title required';
        isValid = false;
    }
    
    if (desc.length === 0) {
        document.getElementById('descError').textContent = 'Description required';
        isValid = false;
    }
    
    return isValid;
}

// Form submit
document.getElementById('createBtn').addEventListener('click', () => {
    if (validateForm()) {
        // Proceed with creation
    }
});
```

#### Task 5: UI Polish
```css
/* Smooth transitions */
.btn {
    transition: all 0.3s ease;
}

.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* Progress bars */
.progress-bar {
    width: 100%;
    height: 8px;
    background: rgba(99, 102, 241, 0.1);
    border-radius: 4px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #6366f1, #ec4899);
    transition: width 0.3s ease;
}

/* Status badges */
.status-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
}

.status-badge.active {
    background: rgba(16, 185, 129, 0.2);
    color: #10b981;
}

.status-badge.expired {
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;
}
```

### Responsive Breakpoints

```css
/* Desktop (> 1024px) */
/* Default styles */

/* Tablet (768px - 1024px) */
@media (max-width: 1024px) {
    .main-content {
        grid-template-columns: 1fr;
    }
}

/* Mobile (< 768px) */
@media (max-width: 768px) {
    .container {
        padding: 10px;
    }
    
    .header h1 {
        font-size: 1.8rem;
    }
    
    .btn {
        width: 100%;
    }
    
    .proposal-results {
        grid-template-columns: 1fr;
    }
}

/* Small mobile (< 480px) */
@media (max-width: 480px) {
    .header h1 {
        font-size: 1.4rem;
    }
    
    .section {
        padding: 15px;
    }
}
```

### UI/UX Best Practices

```
✅ Clear call-to-action buttons
✅ Immediate visual feedback
✅ Error messages in plain language
✅ Loading indicators
✅ Consistent spacing
✅ Readable fonts (14px+ for body)
✅ High contrast text
✅ Mobile-first design
✅ Accessible color choices
✅ No outdated designs
```

### Frontend Checklist

- [ ] HTML is semantic
- [ ] CSS is organized
- [ ] Layout is responsive
- [ ] Buttons are clickable
- [ ] Forms validate input
- [ ] Loading states show
- [ ] Modals work
- [ ] Colors are consistent
- [ ] Typography is clear
- [ ] No console errors
- [ ] Works on mobile
- [ ] Accessible (WCAG)

---

## 👨‍💼 ROLE 4: Project Lead & Tester

**Responsibilities:**
- Project management
- Quality assurance
- Testing & debugging
- Documentation
- GitHub management
- Team coordination

### Week 1 Tasks

#### Task 1: Setup Project Management
```bash
# Create GitHub repository
git init
git add .
git commit -m "Initial commit"
git remote add origin [your-repo-url]
git push origin main

# Create GitHub issues for tasks
# - Smart Contract Development
# - Web3 Integration
# - Frontend UI
# - Testing & Deployment
```

#### Task 2: Create Testing Plan
```markdown
# Testing Plan

## Unit Tests
- [ ] Smart contract functions
- [ ] Web3 interactions
- [ ] Frontend logic

## Integration Tests
- [ ] Contract deployment
- [ ] Frontend connections
- [ ] End-to-end workflows

## Manual Tests
- [ ] User creates proposal
- [ ] User votes on proposal
- [ ] Vote count updates
- [ ] Blockchain records data

## Edge Case Tests
- [ ] Double voting prevention
- [ ] Creator voting prevention
- [ ] Proposal expiration
- [ ] Invalid inputs
```

#### Task 3: Documentation Setup
```bash
# Create documentation structure
mkdir docs/

# Create files:
# docs/README.md (main guide)
# docs/QUICK_START.md (quick setup)
# docs/SMART_CONTRACT.md (contract details)
# docs/WEB3_INTEGRATION.md (integration guide)
# docs/FRONTEND.md (UI guide)
# docs/TROUBLESHOOTING.md (common issues)
# docs/API.md (contract ABI reference)
```

#### Task 4: Test Matrix
```
| Feature          | Unit Test | Integration | Manual | Status |
|------------------|-----------|-------------|--------|--------|
| Proposal Create  | ✅        | ✅          | ✅     | PASS   |
| Voting           | ✅        | ✅          | ✅     | PASS   |
| Double Vote      | ✅        | ✅          | ✅     | PASS   |
| MetaMask Connect | -         | ✅          | ✅     | PASS   |
| UI Rendering     | -         | -           | ✅     | PASS   |
```

#### Task 5: Risk Assessment
```markdown
# Risks & Mitigations

## High Risk
- Smart contract bugs → Code review + testing
- Gas failures → Gas estimation + monitoring
- User wallet issues → Clear instructions + support

## Medium Risk
- UI bugs → Cross-browser testing
- Network issues → Error handling
- Data sync issues → Real-time monitoring

## Low Risk
- Minor UI glitches → Polish phase
- Documentation gaps → Can add later
```

### Week 2 Tasks

#### Task 1: Integration Testing
```bash
# Test full flow

# 1. Start Ganache
ganache-cli

# 2. Deploy contract
truffle compile
truffle migrate --network development

# 3. Test frontend
# - Open localhost:8000
# - Connect MetaMask
# - Create proposal
# - Vote on proposal
# - Verify blockchain

# 4. Check logs
# - Browser console (F12)
# - Ganache output
# - Contract events
```

#### Task 2: Bug Tracking
```markdown
# Bug Report Template

## Title
[Component] - Brief description

## Severity
- Critical: Feature broken
- High: Major functionality issue
- Medium: Minor issue
- Low: Polish/enhancement

## Steps to Reproduce
1. ...
2. ...
3. ...

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Screenshots
[if applicable]

## Environment
- Browser: Chrome 91
- MetaMask: v9.3
- Network: Ganache local

## Notes
Any additional info
```

#### Task 3: Performance Testing
```javascript
// Measure performance

// Contract deployment time
console.time('deployment');
// ... deploy code ...
console.timeEnd('deployment');

// Transaction confirmation time
const startTime = Date.now();
// ... transaction ...
const confirmTime = Date.now() - startTime;

// Page load time
window.addEventListener('load', () => {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log('Page load:', pageLoadTime + 'ms');
});

// Memory usage
console.log(performance.memory);
```

#### Task 4: Deployment Testing
```bash
# Test full deployment process

# 1. Clean slate
rm -rf build/
rm -rf node_modules/
npm install

# 2. Compile
truffle compile
# Errors? Fix them

# 3. Deploy
truffle migrate --network development --reset
# Failed? Debug

# 4. Test suite
truffle test
# All passing? Continue

# 5. Frontend
npm start  # or http-server
# All features work? Good!

# 6. Document
# Write deployment guide
# Record any issues
```

#### Task 5: Final QA Checklist
```
## Smart Contract
- [ ] All tests pass (25+)
- [ ] No compilation warnings
- [ ] Gas usage optimized
- [ ] Events properly emit
- [ ] Edge cases handled
- [ ] Documented with comments

## Web3 Integration
- [ ] MetaMask connects
- [ ] Contract initializes
- [ ] Data loads correctly
- [ ] Transactions execute
- [ ] Error handling works
- [ ] No console errors

## Frontend
- [ ] Responsive design
- [ ] All buttons work
- [ ] Forms validate
- [ ] Loading states show
- [ ] Modals function
- [ ] No broken links

## Documentation
- [ ] README complete
- [ ] Quick start guide
- [ ] Troubleshooting guide
- [ ] API documentation
- [ ] Comments in code
- [ ] Examples provided

## Deployment
- [ ] Ganache setup guide
- [ ] Contract deployment steps
- [ ] Frontend setup
- [ ] MetaMask configuration
- [ ] Testing instructions
- [ ] All working end-to-end
```

### Testing Commands

```bash
# Run all tests
truffle test

# Run specific test
truffle test test/voting.test.js

# Run with gas reporter
truffle test --reporter eth-gas-reporter

# Check code coverage (optional)
truffle run coverage

# Lint code (find issues)
npm install -g solhint
solhint contracts/Voting.sol
```

### GitHub Workflow

```bash
# Create feature branch
git checkout -b feature/voting-modal

# Make changes
# ... edit files ...

# Stage changes
git add .

# Commit
git commit -m "Add voting modal component"

# Push
git push origin feature/voting-modal

# Create Pull Request on GitHub
# Have team members review
# Merge when approved
git checkout main
git pull origin main

# Delete old branch
git branch -d feature/voting-modal
git push origin --delete feature/voting-modal
```

### Issue Tracking Template

```markdown
# Development Issues

## [CRITICAL] Contract compilation fails
- Status: Open
- Assigned to: Role 1
- Due: Monday
- Description: Fix Solidity syntax error in Voting.sol

## [HIGH] MetaMask connection timeout
- Status: In Progress
- Assigned to: Role 2
- Due: Wednesday
- Description: Implement retry logic

## [MEDIUM] Mobile layout breaks
- Status: Open
- Assigned to: Role 3
- Due: Friday
- Description: Fix CSS media queries

## [LOW] Add loading animation
- Status: Backlog
- Assigned to: Role 3
- Due: Next sprint
- Description: Nice-to-have enhancement
```

### Project Lead Checklist

- [ ] Team members assigned
- [ ] GitHub repo created
- [ ] Issues created
- [ ] Testing plan documented
- [ ] Daily standups scheduled
- [ ] Progress tracked
- [ ] Risks identified
- [ ] Blockers resolved
- [ ] Documentation updated
- [ ] Code reviewed
- [ ] Tests passing
- [ ] Ready for presentation

---

## 📅 Weekly Timeline

### Week 1: Foundation
```
Mon: Setup & Planning
- [ ] All tools installed
- [ ] Project created
- [ ] GitHub repo setup
- [ ] Team meeting

Tue-Thu: Development
- [ ] Smart contract written
- [ ] Web3 setup
- [ ] HTML structure
- [ ] Testing framework

Fri: Review & Testing
- [ ] Code review
- [ ] Tests pass
- [ ] Minor fixes
- [ ] Team meeting
```

### Week 2: Integration
```
Mon: Integration Focus
- [ ] Contract & frontend connected
- [ ] Basic flow working
- [ ] Known issues documented

Tue-Thu: Polish & Test
- [ ] UI refinements
- [ ] Bug fixes
- [ ] Additional tests
- [ ] Documentation

Fri: Final Review
- [ ] End-to-end testing
- [ ] Deployment verification
- [ ] Final fixes
- [ ] Presentation prep
```

### Week 3: Deployment
```
Mon: Testing Sprint
- [ ] Comprehensive testing
- [ ] Bug fixes
- [ ] Performance checks

Tue-Wed: Deployment
- [ ] Contract deployed
- [ ] Frontend tested
- [ ] Documentation finalized

Thu-Fri: Presentation
- [ ] Demo preparation
- [ ] Final testing
- [ ] Presentation delivery
```

---

**Remember:** Communication is key to successful group projects! 🎯
