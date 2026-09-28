# ⚡ Quick Start Guide - 10 Minutes

Get your Voting DApp running in 10 minutes!

---

## 🔧 Prerequisites (5 min)

### 1. Install Node.js
Download from: https://nodejs.org/ (LTS version)

Verify:
```bash
node --version  # Should show v14+
npm --version   # Should show v6+
```

### 2. Install Required Tools
```bash
# Open terminal/command prompt and run:
npm install -g truffle
npm install -g ganache-cli

# Verify:
truffle version
ganache-cli --version
```

### 3. Install MetaMask
- Download: https://metamask.io/
- Add to browser (Chrome, Firefox, Edge)
- Create wallet (save seed phrase!)

---

## 🚀 Setup Project (5 min)

### Step 1: Create Project
```bash
# Create folder
mkdir VotingDApp
cd VotingDApp

# Initialize Truffle
truffle init

# Install Web3.js
npm install web3@1.10.0
```

### Step 2: Add Files
Copy these files to your project:
- `Voting.sol` → `contracts/Voting.sol`
- `2_deploy_voting.js` → `migrations/2_deploy_voting.js`
- Create folder: `public/`
- `index.html` → `public/index.html`
- `style.css` → `public/style.css`
- `app.js` → `public/app.js`
- `voting.test.js` → `test/voting.test.js`

### Step 3: Update truffle-config.js

Find this section:
```javascript
networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    }
}
```

Replace with:
```javascript
networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
      gasPrice: 20000000000,
      gas: 6721975
    }
},
compilers: {
    solc: {
      version: "0.8.0"
    }
}
```

---

## ▶️ Running (3 min)

### Terminal 1: Start Ganache
```bash
ganache-cli -m "hormone yellow state glance pig armed second cuff silent base work"
```

Wait for: `listening on 127.0.0.1:8545`

✅ Keep this running!

### Terminal 2: Deploy Contract
```bash
# In project directory
truffle compile
truffle migrate --network development
```

You'll see:
```
Deployed Voting
Contract address: 0x...
```

**COPY THIS ADDRESS!**

### Terminal 3: Start Server
```bash
# In public directory
python -m http.server 8000

# Or:
npx http-server . -p 8000
```

---

## 🌐 Open Browser

1. Go to: `http://localhost:8000`
2. Click "Connect MetaMask"
3. Select Ganache account
4. Enter contract address (from Terminal 2)
5. Click "Load Contract"
6. ✅ You're ready!

---

## 🗳️ Try It Out

### Create Proposal
1. Type title: "Should we go to Mars?"
2. Type description: "Exploring space exploration"
3. Click "Create Proposal"
4. Wait for transaction

### Vote
1. Click "Vote Now" on proposal
2. Click "👍 YES" or "👎 NO"
3. Wait for transaction
4. See vote count update!

---

## 🧪 Run Tests (Optional)

```bash
# In another terminal (with Ganache still running)
truffle test

# Should see:
# ✓ 25 tests passing
```

---

## 📱 Setup MetaMask for Ganache

### Add Network
1. MetaMask → Networks → Add Network
2. Fill in:
   - Name: `Ganache`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `1337`
   - Currency: `ETH`
3. Save

### Import Account
1. MetaMask → Import Account
2. Paste private key from Ganache
3. Name it (e.g., "Dev Account 1")
4. Done!

---

## 🎯 Troubleshooting

| Issue | Fix |
|-------|-----|
| "Port 8545 in use" | Change to 8546: `ganache-cli -p 8546` |
| "Web3 not defined" | Refresh browser (Ctrl+F5) |
| "Contract not found" | Check contract address, paste correctly |
| "MetaMask won't connect" | Hard refresh (Ctrl+F5) |
| "Transaction failed" | Check balance in MetaMask |
| "port 8000 in use" | Use: `python -m http.server 8001` |

---

## 📊 Project Structure
```
VotingDApp/
├── contracts/Voting.sol
├── migrations/2_deploy_voting.js
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── test/voting.test.js
├── truffle-config.js
├── package.json
└── README.md
```

---

## ✅ Checklist

- [ ] Node.js installed
- [ ] Truffle installed
- [ ] Ganache CLI installed
- [ ] MetaMask installed
- [ ] Project created
- [ ] Files copied
- [ ] truffle-config.js updated
- [ ] Ganache running (Terminal 1)
- [ ] Contract compiled & deployed (Terminal 2)
- [ ] Web server running (Terminal 3)
- [ ] Browser at localhost:8000
- [ ] MetaMask connected
- [ ] Contract loaded
- [ ] Proposal created
- [ ] Voted on proposal
- [ ] ✅ Working!

---

## 🎓 Next Steps

### Week 1 (Smart Contracts)
- [ ] Understand Solidity code
- [ ] Run tests
- [ ] Modify contract
- [ ] Add new functions

### Week 2 (Frontend)
- [ ] Modify UI
- [ ] Add new features
- [ ] Improve styling
- [ ] Test interactions

### Week 3 (Deployment)
- [ ] Deploy to testnet
- [ ] Create GitHub repo
- [ ] Document everything
- [ ] Present to class

---

## 💡 Pro Tips

1. **Save Ganache output** - Keep account addresses
2. **Use same RPC URL** - Consistency is key
3. **Test before deploy** - Run `truffle test` first
4. **Monitor gas** - Keep eye on gas usage
5. **Save contract address** - You'll need it often
6. **Clear cache** - If UI doesn't update, clear browser cache
7. **Read error messages** - They tell you what's wrong
8. **Use console.log** - Debug with console logs

---

## 🆘 Common Errors

### "Error: Could not find a contract artifact"
```bash
# Run this:
truffle compile
```

### "Error: Web3.js 1.0 requires provider"
Check that MetaMask is connected and Ganache is running

### "Nonce too high"
```bash
# In MetaMask, click account → Settings → Reset Account
```

### "Transaction underpriced"
Gas price too low. Increase in truffle-config.js

---

## 🎉 Success!

You now have a working blockchain DApp! 

**Next:** Read the full README.md for detailed info.

---

**Questions?** 
- Check README.md Troubleshooting section
- Look at console errors (F12)
- Check Ganache logs
- Google the error message

---

**Ready to level up? 🚀**

- Add voting time limits
- Add voting power
- Create voting pools
- Deploy to testnet
- Build mobile app

---

Made with ❤️ for learning developers
