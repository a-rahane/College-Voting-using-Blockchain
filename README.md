# College Voting using Blockchain

The College Voting DApp is a decentralized web application built using Ethereum blockchain, Solidity, and Web3.js.  
It allows a college administrator to conduct secure elections on the blockchain — where voters can register, cast votes for candidates, and view tamper-proof results.

## Features

**Admin can:**
- Add voter wallet addresses  
- Add candidate names  
- Start, end, and publish election results  

**Voters can:**
- Check registration  
- View candidates  
- Cast their votes once per election  

Results are displayed automatically once published.

## Tech Stack

- Frontend: HTML, CSS, JavaScript  
- Blockchain Interaction: Web3.js  
- Smart Contract: Solidity (deployed on Ethereum or a local testnet like Ganache)

## How to Run Locally

### 1. Clone the repository
```bash
git clone https://github.com/a-rahane/College-Voting-using-Blockchain.git
cd College-Voting-using-Blockchain
```

### 2. Deploy the Smart Contract
You can deploy the Solidity contract (`CollegeVoting.sol`) using:

- Remix IDE (Deploy using Injected Provider (MetaMask))  
- Or Hardhat/Truffle locally  

### 3. Include Your Own Contract in the Frontend
In the `app.js` file, replace with your deployed contract details:
```javascript
const CONTRACT_ADDRESS = "0xYourNewContractAddress";
const CONTRACT_ABI = [ /* your ABI here */ ];
```

### 4. Run the Frontend
You can open `index.html` directly in your browser or use a local development server such as **Live Server** in VS Code.

### 5. Connect MetaMask
- Switch MetaMask to the same network where your contract is deployed  
- Click “Connect Wallet”  
- If your wallet address matches the admin, the Admin Dashboard will be visible  
- Otherwise, the Voter Panel will appear
