// app.js
const CONTRACT_ADDRESS = "0x907FE88779838c56a01270a2cfd29869F25C978B";
const CONTRACT_ABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			}
		],
		"name": "addCandidate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_voter",
				"type": "address"
			}
		],
		"name": "addVoter",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "admin",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "candidates",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "voteCount",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "electionEnded",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "electionStarted",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "endElection",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getCandidateCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "hasVoted",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "isVoter",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "publishResults",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "resultsPublished",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "startElection",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "candidateId",
				"type": "uint256"
			}
		],
		"name": "vote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

let web3;
let contract;
let account;

const connectBtn = document.getElementById("connectBtn");
const accountP = document.getElementById("account");

const adminPanel = document.getElementById("adminPanel");
const voterPanel = document.getElementById("voterPanel");

const voterAddr = document.getElementById("voterAddr");
const addVoterBtn = document.getElementById("addVoterBtn");

const candidateName = document.getElementById("candidateName");
const addCandidateBtn = document.getElementById("addCandidateBtn");

const startBtn = document.getElementById("startBtn");
const endBtn = document.getElementById("endBtn");
const publishResultsBtn = document.getElementById("publishResults");

const checkRegBtn = document.getElementById("checkReg");
const votingArea = document.getElementById("votingArea");
const candidatesList = document.getElementById("candidatesList");
const resultsList = document.getElementById("resultsList");

function setStatus(text){
  accountP.innerText = text;
}

function showAdmin(show){
  if(show){
    adminPanel.classList.remove("hidden");
    voterPanel.classList.add("hidden");
  } else {
    voterPanel.classList.remove("hidden");
    adminPanel.classList.add("hidden");
  }
}

async function connectWallet(){
  try{
    if(!window.ethereum){
      alert("Please install MetaMask");
      return;
    }
    web3 = new Web3(window.ethereum);
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    account = accounts[0];
    setStatus(`Account: ${account}`);
    contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

    //show admin or voter panel
    const admin = await contract.methods.admin().call();
    showAdmin(account.toLowerCase() === admin.toLowerCase());

    //load results if already published
    await loadResults();

    //listen for account changes
    ethereum.on && ethereum.on("accountsChanged", (accs) => {
      if(accs.length === 0){
        setStatus("Not connected");
        account = null;
        adminPanel.classList.add("hidden");
        voterPanel.classList.add("hidden");
      } else {
        account = accs[0];
        setStatus(`Account: ${account}`);
        //re-evaluate admin status
        contract.methods.admin().call().then(adminAddr => {
          showAdmin(account.toLowerCase() === adminAddr.toLowerCase());
        }).catch(()=>{/*ignore*/});
      }
    });

  } catch (err){
    console.error(err);
    alert("Wallet connection failed: " + (err.message || err));
  }
}

connectBtn.onclick = connectWallet;

// ADMIN
addVoterBtn.onclick = async () => {
  try {
    const addr = voterAddr.value.trim();
    if(!web3.utils.isAddress(addr)) return alert("Enter a valid wallet address");
    await contract.methods.addVoter(addr).send({ from: account });
    alert("Voter added");
    voterAddr.value = "";
  } catch (err) {
    console.error(err);
    alert("Add voter failed: " + (err.message || err));
  }
};

addCandidateBtn.onclick = async () => {
  try {
    const name = candidateName.value.trim();
    if(!name) return alert("Enter candidate name");
    await contract.methods.addCandidate(name).send({ from: account });
    alert("Candidate added");
    candidateName.value = "";
  } catch (err) {
    console.error(err);
    alert("Add candidate failed: " + (err.message || err));
  }
};

startBtn.onclick = async () => {
  try {
    await contract.methods.startElection().send({ from: account });
    alert("Election started");
  } catch (err) {
    console.error(err);
    alert("Start failed: " + (err.message || err));
  }
};

endBtn.onclick = async () => {
  try {
    await contract.methods.endElection().send({ from: account });
    alert("Election ended");
  } catch (err) {
    console.error(err);
    alert("End failed: " + (err.message || err));
  }
};

publishResultsBtn.onclick = async () => {
  try {
    await contract.methods.publishResults().send({ from: account });
    alert("Results Published");
    await loadResults();
  } catch (err) {
    console.error(err);
    alert("Publish failed: " + (err.message || err));
  }
};

//Voter 
checkRegBtn.onclick = async () => {
  try {
    if(!account) return alert("Connect your wallet first");
    const registered = await contract.methods.isVoter(account).call();
    if(registered){
      alert("You are registered");
      votingArea.classList.remove("hidden");
      await loadCandidates();
    } else {
      alert("You are NOT registered");
      votingArea.classList.add("hidden");
    }
  } catch (err) {
    console.error(err);
    alert("Check registration failed: " + (err.message || err));
  }
};

async function loadCandidates(){
  candidatesList.innerHTML = "";
  try {
    const count = parseInt(await contract.methods.getCandidateCount().call(), 10);
    const electionStarted = await contract.methods.electionStarted().call();
    const electionEnded = await contract.methods.electionEnded().call();
    const voted = await contract.methods.hasVoted(account).call();

    if(count === 0){
      candidatesList.innerHTML = "<p class='small'>No candidates yet</p>";
      return;
    }

    for(let i=0;i<count;i++){
      const c = await contract.methods.candidates(i).call();
      const div = document.createElement("div");
      div.className = "candidate";
      const name = c.name || c[0];
      const votes = c.voteCount || c[1] || 0;

      let btnHtml = "";
      if(!electionStarted){
        btnHtml = "<p class='small'>Election not started</p>";
      } else if(electionEnded){
        btnHtml = "<p class='small'>Election ended</p>";
      } else if(voted){
        btnHtml = "<p class='small'>You have already voted</p>";
      } else {
        btnHtml = `<button data-id="${i}" class="voteBtn">Vote</button>`;
      }

      div.innerHTML = `<h4>${name}</h4><p class="small">Votes: ${votes}</p>${btnHtml}`;
      candidatesList.appendChild(div);
    }

    //add click listeners to vote buttons
    const voteButtons = document.querySelectorAll(".voteBtn");
    voteButtons.forEach(b => {
      b.onclick = async (e) => {
        const idx = parseInt(e.target.getAttribute("data-id"), 10);
        await vote(idx);
      };
    });

  } catch (err) {
    console.error(err);
    alert("Load candidates failed: " + (err.message || err));
  }
}

window.vote = async (i) => {
  try {
    if(!account) return alert("Connect wallet first");
    await contract.methods.vote(i).send({ from: account });
    alert("Vote casted");
    //reload candidates + results
    await loadCandidates();
    await loadResults();
  } catch (err) {
    console.error(err);
    alert("Vote failed: " + (err.message || err));
  }
};

async function loadResults(){
  try {
    if(!contract) return;
    const published = await contract.methods.resultsPublished().call();
    resultsList.innerHTML = "";
    if(!published){
      resultsList.innerHTML = "<p>Results not published yet</p>";
      return;
    }
    const count = parseInt(await contract.methods.getCandidateCount().call(), 10);
    if(count === 0){
      resultsList.innerHTML = "<p>No candidates</p>";
      return;
    }
    for(let i=0;i<count;i++){
      const c = await contract.methods.candidates(i).call();
      const name = c.name || c[0];
      const votes = c.voteCount || c[1] || 0;
      resultsList.innerHTML += `<p>${name}: ${votes} votes</p>`;
    }
  } catch (err){
    console.error(err);
    resultsList.innerHTML = "<p class='small'>Failed to load results</p>";
  }
}
