// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract CollegeVoting {

    address public admin;
    bool public electionStarted;
    bool public electionEnded;
    bool public resultsPublished;

    struct Candidate {
        string name;
        uint voteCount;
    }

    mapping(address => bool) public isVoter;
    mapping(address => bool) public hasVoted;

    Candidate[] public candidates;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin allowed");
        _;
    }

    modifier electionOngoing() {
        require(electionStarted && !electionEnded, "Election not active");
        _;
    }

    constructor() {
        admin = msg.sender;
        resultsPublished = false;
    }

    function addVoter(address _voter) public onlyAdmin {
        require(!electionStarted, "Cannot add voters after start");
        isVoter[_voter] = true;
    }

    function addCandidate(string memory _name) public onlyAdmin {
        require(!electionStarted, "Cannot add candidates after start");
        candidates.push(Candidate(_name, 0));
    }

    function startElection() public onlyAdmin {
        electionStarted = true;
    }

    function endElection() public onlyAdmin {
        electionEnded = true;
    }

    function publishResults() public onlyAdmin {
        require(electionEnded, "End election first");
        require(!resultsPublished, "Results already published");
        resultsPublished = true;
    }

    function vote(uint candidateId) public electionOngoing {
        require(isVoter[msg.sender], "Not a registered voter");
        require(!hasVoted[msg.sender], "Already voted");
        require(candidateId < candidates.length, "Invalid ID");

        candidates[candidateId].voteCount++;
        hasVoted[msg.sender] = true;
    }

    function getCandidateCount() public view returns(uint) {
        return candidates.length;
    }
}
