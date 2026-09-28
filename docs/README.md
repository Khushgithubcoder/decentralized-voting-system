# 🗳️ Decentralized Voting DApp

A complete blockchain-based voting system built with Truffle, Solidity, Web3.js, and Ganache.

## 📑 Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Setup & Configuration](#setup--configuration)
- [Running the DApp](#running-the-dapp)
- [Smart Contract Functions](#smart-contract-functions)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Learning Resources](#learning-resources)
- [Group Collaboration Guide](#group-collaboration-guide)

---

## ✨ Features

✅ **Create Proposals** - Anyone can create voting proposals  
✅ **Cast Votes** - Vote YES or NO on proposals  
✅ **Track Results** - Real-time vote counting  
✅ **Blockchain Security** - Immutable voting records  
✅ **Web3 Integration** - Full blockchain interaction  
✅ **MetaMask Support** - Easy wallet connection  
✅ **Transparent** - All data stored on blockchain  
✅ **Test Suite** - Comprehensive unit tests  

---

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** v14 or higher ([Download](https://nodejs.org/))
- **npm** v6 or higher (comes with Node.js)
- **MetaMask** browser extension ([Download](https://metamask.io/))
- **Git** for version control
- Basic understanding of JavaScript and Ethereum

Check installation:
```bash
node --version
npm --version
```

---

## 🚀 Installation

### Step 1: Install Global Tools

```bash
# Install Truffle
npm install -g truffle

# Install Ganache CLI
npm install -g ganache-cli

# Verify installations
truffle version
ganache-cli --version
```

### Step 2: Create Project Directory

```bash
# Create project folder
mkdir VotingDApp
cd VotingDApp

# Initialize Truffle project
truffle init

# Install dependencies
npm install web3@1.10.0
npm install @truffle/hdwallet-provider
npm install dotenv
```

### Step 3: Project Structure Setup

```bash
# Copy files to appropriate directories
# contracts/Voting.sol  →  (provided)
# migrations/2_deploy_voting.js  →  (provided)
# public/index.html  →  (provided)
# public/style.css  →  (provided)
# public/app.js  →  (provided)
# test/voting.test.js  →  (provided)
```

Final structure:
```
VotingDApp/
├── contracts/
│   ├── Migrations.sol
│   └── Voting.sol
├── migrations/
│   ├── 1_initial_migration.js
│   └── 2_deploy_voting.js
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── test/
│   └── voting.test.js
├── build/
├── truffle-config.js
├── package.json
└── README.md
```

---

## ⚙️ Setup & Configuration

### Truffle Configuration

Edit `truffle-config.js`:

```javascript
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
      gasPrice: 20000000000,  // 20 Gwei
      gas: 6721975
    },
    ganache: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    }
  },
  
  compilers: {
    solc: {
      version: "0.8.0",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  }
};
```

### MetaMask Configuration

1. **Open MetaMask** in browser
2. **Add Custom Network:**
   - Network Name: `Ganache`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `1337`
   - Currency: `ETH`

3. **Import Test Accounts:**
   - Private Key: (from Ganache output)
   - Ganache provides 10 test accounts

---

## 🏃 Running the DApp

### Terminal 1: Start Ganache

```bash
# Start local blockchain
ganache-cli -m "hormone yellow state glance pig armed second cuff silent base work"

# Output will show:
# ✔ Account 0: 0x... (100 ETH)
# ✔ Account 1: 0x... (100 ETH)
# etc...
# ✔ listening on 127.0.0.1:8545
```

Keep this terminal running!

### Terminal 2: Compile & Deploy Contract

```bash
# Compile Solidity contract
truffle compile

# Deploy to Ganache
truffle migrate --network development

# Output will show:
# 1_initial_migration.js
# ✔ Deployed Migrations
# 2_deploy_voting.js
# ✔ Deployed Voting
# ✔ Contract address: 0x...
```

**Save the contract address!** You'll need it in the frontend.

### Terminal 3: Start Web Server

```bash
# Using Python 3
python -m http.server 8000 --directory public

# OR using Python 2
python -m SimpleHTTPServer 8000

# OR using Node.js http-server
npx http-server ./public -p 8000

# Access at: http://localhost:8000
```

### Browser

1. **Open:** `http://localhost:8000`
2. **Click:** "Connect MetaMask"
3. **Select:** Ganache account
4. **Paste** contract address from Terminal 2
5. **Start voting!**

---

## 🔧 Smart Contract Functions

### View Functions (Read-only, No Gas)

#### `getProposal(uint256 _proposalId)`
```javascript
const proposal = await contract.methods.getProposal(1).call();
// Returns: {
//   id, title, description, createdAt, deadline,
//   yesVotes, noVotes, active, creator
// }
```

#### `getResults(uint256 _proposalId)`
```javascript
const results = await contract.methods.getResults(1).call();
// Returns: { yes: 5, no: 3, isActive: true }
```

#### `hasVoted(address _voter, uint256 _proposalId)`
```javascript
const voted = await contract.methods.hasVoted(userAddress, 1).call();
// Returns: true/false
```

#### `getProposalCount()`
```javascript
const count = await contract.methods.getProposalCount().call();
// Returns: 5 (number of proposals)
```

### State-Changing Functions (Require Gas)

#### `createProposal(string _title, string _description)`
```javascript
const tx = await contract.methods
  .createProposal("Should we adopt new feature?", "Discussion about feature X")
  .send({ from: userAccount });
```

#### `vote(uint256 _proposalId, bool _vote)`
```javascript
// _vote: true = YES, false = NO
const tx = await contract.methods
  .vote(1, true)  // Vote YES on proposal 1
  .send({ from: userAccount });
```

---

## 🧪 Testing

### Run Tests

```bash
# Make sure Ganache is running in another terminal

# Run all tests
truffle test

# Run specific test file
truffle test test/voting.test.js

# Run tests with detailed output
truffle test --verbose
```

### Expected Output

```
✓ Deployment
  ✓ should deploy contract successfully
  ✓ should set owner correctly
  
✓ Creating Proposals
  ✓ should create a proposal
  ✓ should increment proposal count
  
✓ Voting
  ✓ should allow voting on active proposal
  ✓ should not allow voting twice
  
... (more tests)

passing 25 tests
```

### Test Coverage

The test suite covers:
- ✅ Contract deployment
- ✅ Proposal creation
- ✅ Vote casting
- ✅ Double voting prevention
- ✅ Creator restrictions
- ✅ Proposal expiration
- ✅ Edge cases
- ✅ Gas efficiency

---

## 📦 Deployment

### Local Deployment (Already Done)

Done in "Running the DApp" section.

### Deploy to Testnet (Optional)

#### 1. Set up Infura Account
```bash
# Get API key from https://infura.io/
# Keep it private!
```

#### 2. Create .env file
```bash
# Create file named .env
INFURA_API_KEY=your_key_here
PRIVATE_KEY=your_private_key_here
```

#### 3. Update truffle-config.js
```javascript
const HDWalletProvider = require('@truffle/hdwallet-provider');
const dotenv = require('dotenv').config();

module.exports = {
  networks: {
    ropsten: {
      provider: () => new HDWalletProvider(
        process.env.PRIVATE_KEY,
        `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`
      ),
      network_id: 3,
      gas: 5500000,
      gasPrice: 20000000000
    }
  }
};
```

#### 4. Deploy
```bash
truffle migrate --network ropsten
```

---

## 🐛 Troubleshooting

### Issue: "Contract not found"
**Solution:**
```bash
# Ensure Ganache is running
# Run truffle compile
truffle compile
# Run migrations again
truffle migrate --network development
# Copy new contract address to frontend
```

### Issue: "MetaMask won't connect"
**Solution:**
1. Check Chain ID is 1337
2. Check RPC URL is http://127.0.0.1:8545
3. Hard refresh browser (Ctrl+F5)
4. Disconnect and reconnect MetaMask

### Issue: "Transaction failed" or "Revert"
**Solution:**
1. Check account has enough ETH balance
2. Verify contract is deployed
3. Check contract address is correct
4. Look at Ganache logs for error details

### Issue: "Web3 is not defined"
**Solution:**
1. Check web3.min.js is loaded from CDN
2. Check browser console for loading errors
3. Try refreshing page

### Issue: "Account not found"
**Solution:**
```bash
# Make sure you imported Ganache account to MetaMask
# Use Account 0 or any of the 10 test accounts
# Private key format: 0x... (64 characters after 0x)
```

### Issue: Gas price too high
**Solution:**
```bash
# In truffle-config.js, lower gasPrice:
gasPrice: 1000000000  // 1 Gwei instead of 20
```

### Issue: Port 8545 already in use
**Solution:**
```bash
# Use different port
ganache-cli -p 8546

# Update truffle-config.js port to 8546
```

---

## 📚 Learning Resources

### Official Documentation
- [Truffle Suite](https://www.trufflesuite.com/docs)
- [Web3.js Documentation](https://web3js.readthedocs.io/)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [Ethereum Docs](https://ethereum.org/en/developers/)

### Tutorials & Guides
- [Solidity by Example](https://solidity-by-example.org/)
- [Ethereum Smart Contracts](https://ethereum.org/en/developers/docs/smart-contracts/)
- [Web3.js API Reference](https://web3js.readthedocs.io/en/v1.2.11/web3.html)

### Tools
- [Remix IDE](https://remix.ethereum.org/) - Browser-based Solidity IDE
- [MetaMask](https://metamask.io/) - Wallet & gateway to blockchain
- [Ganache](https://www.trufflesuite.com/ganache) - Personal blockchain
- [Etherscan](https://etherscan.io/) - Blockchain explorer

---

## 👥 Group Collaboration Guide

### Role Assignments (4 Members)

#### Role 1: Smart Contract Developer
**Responsibilities:**
- Write and optimize Solidity contracts
- Test contract logic
- Handle gas optimization
- Deploy contracts
- Write comprehensive comments

**Tasks:**
```
Week 1:
- ✅ Understand Solidity syntax
- ✅ Write Voting.sol
- ✅ Test all functions
- ✅ Document contract

Week 2:
- ✅ Optimize gas usage
- ✅ Add events
- ✅ Handle edge cases
```

#### Role 2: Blockchain Integration Developer
**Responsibilities:**
- Integrate Web3.js with frontend
- Handle wallet connections
- Create transaction logic
- Handle blockchain interactions

**Tasks:**
```
Week 1:
- ✅ Setup Web3 connection
- ✅ MetaMask integration
- ✅ Contract ABI handling
- ✅ Basic functions

Week 2:
- ✅ Error handling
- ✅ Transaction monitoring
- ✅ Event listeners
- ✅ Data serialization
```

#### Role 3: Frontend Developer
**Responsibilities:**
- Design and build UI
- Create responsive layouts
- Implement styling
- Build user components

**Tasks:**
```
Week 1:
- ✅ HTML structure
- ✅ CSS styling
- ✅ Component design
- ✅ Responsive layout

Week 2:
- ✅ Modal windows
- ✅ Form validation
- ✅ UX improvements
- ✅ Animation effects
```

#### Role 4: Project Lead & Tester
**Responsibilities:**
- Project management
- Testing & QA
- Documentation
- GitHub management
- Bug tracking

**Tasks:**
```
Week 1:
- ✅ Setup repository
- ✅ Create documentation
- ✅ Setup testing
- ✅ Create issues

Week 2:
- ✅ Integration testing
- ✅ Bug fixing
- ✅ Deployment guide
- ✅ Final review
```

### Team Communication

**Weekly Meetings:**
- Monday: Plan week (30 mins)
- Wednesday: Progress update (30 mins)
- Friday: Demo & issues (45 mins)

**Tools:**
- GitHub: Code & issues
- Discord/Slack: Daily communication
- Trello: Task tracking
- Google Docs: Shared documentation

### GitHub Workflow

```bash
# Initial setup
git clone [repository]
cd VotingDApp

# Create feature branch
git checkout -b feature/voting-page

# Make changes
git add .
git commit -m "Add voting modal functionality"

# Push to GitHub
git push origin feature/voting-page

# Create Pull Request on GitHub
# Have team review before merging
```

### Development Checklist

- [ ] Environment setup
- [ ] Contract compiled
- [ ] Contract deployed
- [ ] Tests passing (25+ tests)
- [ ] UI responsive
- [ ] Web3 integration working
- [ ] MetaMask connects
- [ ] Can create proposal
- [ ] Can vote on proposal
- [ ] Results update correctly
- [ ] No console errors
- [ ] Documentation complete
- [ ] GitHub repo organized
- [ ] Code reviewed by peers
- [ ] Ready for presentation

---

## 📊 Project Metrics

### Code Statistics
- **Smart Contract:** ~250 lines (Solidity)
- **Frontend:** ~900 lines (JavaScript)
- **Styling:** ~900 lines (CSS)
- **HTML:** ~150 lines
- **Tests:** ~350 lines (Truffle tests)
- **Total:** ~2,500 lines of code

### Contract Deployment
- **Gas Cost (Deployment):** ~1,500,000 gas (~$0.30)
- **Gas Cost (Create Proposal):** ~60,000 gas
- **Gas Cost (Vote):** ~50,000 gas
- **Total Functions:** 11 functions
- **State Variables:** 7 variables
- **Events:** 3 events

### Timeline
- **Week 1:** Setup & Contract Development
- **Week 2:** Integration & Frontend
- **Week 3:** Testing & Deployment
- **Total:** 2-3 weeks

---

## 🎓 Learning Outcomes

After completing this project, you'll understand:

✅ How blockchain works  
✅ Smart contract development  
✅ Solidity programming  
✅ Web3.js integration  
✅ Ethereum transactions  
✅ Gas and transaction costs  
✅ DApp architecture  
✅ Frontend-blockchain interaction  
✅ Testing smart contracts  
✅ Decentralized applications  

---

## 📝 License

MIT License - Feel free to use for educational purposes!

---

## 🤝 Contributing

This is a learning project. Contributions and suggestions welcome!

1. Fork the repository
2. Create feature branch
3. Make changes
4. Submit pull request

---

## 📞 Support

**Issues?** Check the Troubleshooting section above.

**Questions?** Open an issue on GitHub!

**Want to learn more?** See Learning Resources section.

---

## 🎯 Next Steps

After completing this project:

1. **Deploy to Testnet** (Ropsten, Sepolia)
2. **Add more features** (voting periods, voting power, delegation)
3. **Improve security** (audits, testing)
4. **Scale solutions** (L2 solutions, alternative chains)
5. **Deploy to Mainnet** (requires real ETH)

---

**Happy Coding! 🚀🗳️**

Made with ❤️ for blockchain developers
