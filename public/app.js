// ============ GLOBAL VARIABLES ============

let web3;
let contract;
let userAccount;
let contractAddress = " 0x6fd5D4b189b61c207694e4e9732c835147C978E9";

// ✅ CORRECT ABI - Matching your Solidity code (9 individual return values, NOT tuple)
const VOTING_ABI = [
    {
        "inputs": [],
        "name": "proposalCount",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "_proposalId", "type": "uint256"}],
        "name": "getProposal",
        "outputs": [
            {"internalType": "uint256", "name": "id", "type": "uint256"},
            {"internalType": "string", "name": "title", "type": "string"},
            {"internalType": "string", "name": "description", "type": "string"},
            {"internalType": "uint256", "name": "createdAt", "type": "uint256"},
            {"internalType": "uint256", "name": "deadline", "type": "uint256"},
            {"internalType": "uint256", "name": "yesVotes", "type": "uint256"},
            {"internalType": "uint256", "name": "noVotes", "type": "uint256"},
            {"internalType": "bool", "name": "active", "type": "bool"},
            {"internalType": "address", "name": "creator", "type": "address"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "string", "name": "_title", "type": "string"},
            {"internalType": "string", "name": "_description", "type": "string"}
        ],
        "name": "createProposal",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "uint256", "name": "_proposalId", "type": "uint256"},
            {"internalType": "bool", "name": "_vote", "type": "bool"}
        ],
        "name": "vote",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "address", "name": "_voter", "type": "address"},
            {"internalType": "uint256", "name": "_proposalId", "type": "uint256"}
        ],
        "name": "hasVoted",
        "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "_proposalId", "type": "uint256"}],
        "name": "getResults",
        "outputs": [
            {"internalType": "uint256", "name": "yes", "type": "uint256"},
            {"internalType": "uint256", "name": "no", "type": "uint256"},
            {"internalType": "bool", "name": "isActive", "type": "bool"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "_proposalId", "type": "uint256"}],
        "name": "isExpired",
        "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "_proposalId", "type": "uint256"}],
        "name": "getProposalCount",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "_proposalId", "type": "uint256"}],
        "name": "getWinner",
        "outputs": [{"internalType": "string", "name": "", "type": "string"}],
        "stateMutability": "view",
        "type": "function"
    }
];

// ============ INITIALIZATION ============

window.addEventListener('load', async () => {
    console.log('🚀 Voting DApp Loading...');
    
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        console.log('✅ Web3 initialized');
        
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);
        
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {
            userAccount = accounts[0];
            updateUI();
        }
    } else {
        showError('MetaMask not detected!');
    }
    
    setupEventListeners();
});

function setupEventListeners() {
    const connectBtn = document.getElementById('connectBtn');
    const createBtn = document.getElementById('createBtn');
    const closeBtn = document.querySelector('.close');
    
    if (connectBtn) connectBtn.addEventListener('click', connectWallet);
    if (createBtn) createBtn.addEventListener('click', createProposal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('voteModal');
        if (modal && e.target === modal) closeModal();
    });
}

async function connectWallet() {
    try {
        showLoading('Connecting to MetaMask...');
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAccount = accounts[0];
        console.log('✅ Connected:', userAccount);
        hideLoading();
        updateUI();
    } catch (error) {
        console.error('Connection error:', error);
        hideLoading();
        showError('Failed to connect wallet');
    }
}

async function updateUI() {
    try {
        const accountEl = document.getElementById('account');
        const balanceEl = document.getElementById('balance');
        const networkEl = document.getElementById('network');
        
        if (accountEl) accountEl.textContent = userAccount.substring(0, 6) + '...' + userAccount.substring(38);
        
        if (balanceEl) {
            const balance = await web3.eth.getBalance(userAccount);
            balanceEl.textContent = parseFloat(web3.utils.fromWei(balance, 'ether')).toFixed(4);
        }
        
        if (networkEl) {
            const chainId = await web3.eth.getChainId();
            networkEl.textContent = (chainId === 1337 || chainId === 5777) ? 'Ganache (Local)' : 'Other';
        }
        
        updateConnectionStatus(true);
        
        const userInfoEl = document.getElementById('userInfo');
        if (userInfoEl) userInfoEl.classList.remove('hidden');
        
        const createBtn = document.getElementById('createBtn');
        if (createBtn) createBtn.disabled = false;
        
        await initializeContract();
    } catch (error) {
        console.error('UI error:', error);
    }
}

function updateConnectionStatus(connected) {
    const statusEl = document.getElementById('status');
    const statusText = document.getElementById('statusText');
    if (statusEl && statusText) {
        if (connected) {
            statusEl.classList.remove('status-disconnected');
            statusEl.classList.add('status-connected');
            statusText.textContent = '✅ Connected';
        } else {
            statusEl.classList.remove('status-connected');
            statusEl.classList.add('status-disconnected');
            statusText.textContent = '⚠️ Not Connected';
        }
    }
}

async function initializeContract() {
    try {
        console.log('🔗 Contract address:', contractAddress);
        contract = new web3.eth.Contract(VOTING_ABI, contractAddress);
        console.log('✅ Contract initialized');
        await loadProposals();
    } catch (error) {
        console.error('Contract init error:', error);
        showError('Failed to initialize contract');
    }
}

async function loadProposals() {
    if (!contract || !userAccount) return;
    
    try {
        console.log('📋 Loading proposals...');
        const proposalCount = await contract.methods.proposalCount().call();
        console.log(`Total proposals: ${proposalCount}`);
        
        const container = document.getElementById('proposalsContainer');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (proposalCount === 0) {
            container.innerHTML = '<p class="empty-state">No proposals yet. Create one!</p>';
            return;
        }
        
        for (let i = 1; i <= proposalCount; i++) {
            try {
                console.log(`Loading proposal ${i}...`);
                const proposal = await contract.methods.getProposal(i).call();
                console.log(`Proposal ${i}:`, proposal);
                
                const isExpired = await contract.methods.isExpired(i).call();
                const hasVoted = await contract.methods.hasVoted(userAccount, i).call();
                
                createProposalCard(proposal, hasVoted, isExpired);
            } catch (error) {
                console.error(`Error loading proposal ${i}:`, error);
            }
        }
    } catch (error) {
        console.error('Load proposals error:', error);
        showError('Failed to load proposals');
    }
}

function createProposalCard(proposal, hasVoted, isExpired) {
    const container = document.getElementById('proposalsContainer');
    if (!container) return;
    
    const deadline = new Date(proposal.deadline * 1000).toLocaleString();
    const totalVotes = parseInt(proposal.yesVotes) + parseInt(proposal.noVotes);
    const yesPercent = totalVotes === 0 ? 0 : (parseInt(proposal.yesVotes) / totalVotes * 100);
    
    const card = document.createElement('div');
    card.className = 'proposal-card';
    card.innerHTML = `
        <div class="proposal-header">
            <span class="proposal-id">Proposal #${proposal.id}</span>
            <h3 class="proposal-title">${escapeHtml(proposal.title)}</h3>
        </div>
        
        <p class="proposal-desc">${escapeHtml(proposal.description)}</p>
        
        <div class="proposal-meta">
            <span>⏰ ${deadline}</span>
            <span>👤 ${proposal.creator.substring(0, 6)}...</span>
            <span>🗳️ ${totalVotes} votes</span>
        </div>
        
        <div class="proposal-results">
            <div class="result-bar">
                <div class="result-label">👍 Yes: ${proposal.yesVotes}</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${yesPercent}%"></div>
                </div>
            </div>
            <div class="result-bar">
                <div class="result-label">👎 No: ${proposal.noVotes}</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${100 - yesPercent}%"></div>
                </div>
            </div>
        </div>
        
        <div class="proposal-actions">
            ${proposal.active && !isExpired && !hasVoted ? 
                `<button class="btn btn-primary" onclick="openVoteModal(${proposal.id}, '${escapeHtml(proposal.title)}')">Vote Now</button>` 
                : ''}
            ${hasVoted ? '<span class="badge">✅ Voted</span>' : ''}
            ${!proposal.active || isExpired ? '<span class="badge expired">⏱️ Closed</span>' : '<span class="badge">🔵 Active</span>'}
        </div>
    `;
    
    container.appendChild(card);
}

async function createProposal() {
    const title = document.getElementById('proposalTitle').value.trim();
    const description = document.getElementById('proposalDesc').value.trim();
    
    if (!title || !description) {
        showError('Fill in all fields');
        return;
    }
    
    if (!contract) {
        showError('Contract not ready');
        return;
    }
    
    try {
        showLoading('Creating proposal...');
        const tx = await contract.methods.createProposal(title, description).send({ from: userAccount });
        console.log('✅ Created:', tx.transactionHash);
        hideLoading();
        showSuccess('✅ Proposal created!');
        document.getElementById('proposalTitle').value = '';
        document.getElementById('proposalDesc').value = '';
        setTimeout(() => loadProposals(), 2000);
    } catch (error) {
        console.error('Create error:', error);
        hideLoading();
        showError('Failed: ' + error.message);
    }
}

function openVoteModal(proposalId, title) {
    const modal = document.getElementById('voteModal');
    if (!modal) return;
    const modalTitle = document.getElementById('modalTitle');
    if (modalTitle) modalTitle.textContent = `Vote: ${title}`;
    
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    if (yesBtn) yesBtn.onclick = () => castVote(proposalId, true);
    if (noBtn) noBtn.onclick = () => castVote(proposalId, false);
    modal.classList.remove('hidden');
}

function closeModal() {
    const modal = document.getElementById('voteModal');
    if (modal) modal.classList.add('hidden');
}

async function castVote(proposalId, voteChoice) {
    try {
        showLoading('Voting...');
        const tx = await contract.methods.vote(proposalId, voteChoice).send({ from: userAccount });
        console.log('✅ Voted:', tx.transactionHash);
        hideLoading();
        closeModal();
        showSuccess('✅ Vote recorded!');
        setTimeout(() => loadProposals(), 2000);
    } catch (error) {
        console.error('Vote error:', error);
        hideLoading();
        showError('Failed: ' + error.message);
    }
}

function showLoading(text = 'Processing...') {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        document.getElementById('loadingText').textContent = text;
        spinner.classList.remove('hidden');
    }
}

function hideLoading() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) spinner.classList.add('hidden');
}

function showSuccess(msg) { showMessage(msg, 'success'); }
function showError(msg) { showMessage(msg, 'error'); }
function showWarning(msg) { showMessage(msg, 'info'); }

function showMessage(msg, type = 'info') {
    const el = document.getElementById('createStatus');
    if (el) {
        el.textContent = msg;
        el.className = `status-message ${type}`;
        if (type !== 'error') setTimeout(() => { el.textContent = ''; el.className = 'status-message'; }, 5000);
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        userAccount = null;
        updateConnectionStatus(false);
        const userInfoEl = document.getElementById('userInfo');
        if (userInfoEl) userInfoEl.classList.add('hidden');
    } else {
        userAccount = accounts[0];
        updateUI();
    }
}

function handleChainChanged(chainId) {
    if (chainId !== '0x539' && chainId !== '0x1a4') {
        showWarning('⚠️ Switch to Ganache (Chain ID: 1337)');
    }
}