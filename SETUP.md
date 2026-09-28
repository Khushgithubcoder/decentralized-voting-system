# 🚀 Setup Instructions

## Quick Start (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Ganache (Terminal 1)
```bash
ganache-cli -m "hormone yellow state glance pig armed second cuff silent base work"
```

### 3. Compile & Deploy (Terminal 2)
```bash
truffle compile
truffle migrate --network development
```

### 4. Start Web Server (Terminal 3)
```bash
# Python 3
python -m http.server 8000 --directory public

# Or Node.js
npx http-server ./public -p 8000
```

### 5. Open Browser
```
http://localhost:8000
```

## Directory Structure
```
VotingDApp/
├── contracts/          # Smart contracts
│   └── Voting.sol     # Main voting contract
├── migrations/         # Deployment scripts
│   └── 2_deploy_voting.js
├── public/             # Frontend files
│   ├── index.html
│   ├── style.css
│   └── app.js
├── test/               # Test files
│   └── voting.test.js
├── docs/               # Documentation
├── truffle-config.js   # Truffle configuration
└── package.json        # Project dependencies
```

## Available Scripts

```bash
npm test                # Run all tests
npm run compile         # Compile contracts
npm run migrate         # Deploy to development
npm run migrate-reset   # Fresh deployment
```

## Troubleshooting

- **Port 8545 in use?** → Change: `ganache-cli -p 8546`
- **Node modules error?** → Run: `npm install` again
- **Contract error?** → Run: `truffle compile` first

For more help, see `docs/README.md`
