// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    event VoteCast(address indexed voter, uint256 indexed candidateIndex, string candidateName);
    event VotingEnded(string winnerName, uint256 winningVoteCount);

    Candidate[] public candidates;
    address public owner;
    mapping(address => bool) public voters;

    uint256 public votingStart;
    uint256 public votingEnd;
    bool public isEnded;

    constructor(string[] memory _candidateNames, uint256 _durationInMinutes) {
        require(_candidateNames.length > 0, "Must have at least one candidate");
        require(_durationInMinutes > 0, "Duration must be positive");
        for (uint256 i = 0; i < _candidateNames.length; i++) {
            candidates.push(Candidate({
                name: _candidateNames[i],
                voteCount: 0
            }));
        }
        owner = msg.sender;
        votingStart = block.timestamp;
        votingEnd = block.timestamp + (_durationInMinutes * 1 minutes);
    }

    modifier onlyOwner {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier votingActive {
        require(block.timestamp < votingEnd, "Voting has ended");
        _;
    }

    function addCandidate(string memory _name) public onlyOwner votingActive {
        require(bytes(_name).length > 0, "Name cannot be empty");
        candidates.push(Candidate({
            name: _name,
            voteCount: 0
        }));
    }

    function vote(uint256 _candidateIndex) public votingActive {
        require(!voters[msg.sender], "You have already voted.");
        require(_candidateIndex < candidates.length, "Invalid candidate index.");

        candidates[_candidateIndex].voteCount++;
        voters[msg.sender] = true;

        emit VoteCast(msg.sender, _candidateIndex, candidates[_candidateIndex].name);
    }

    function getAllVotesOfCandiates() public view returns (Candidate[] memory) {
        return candidates;
    }

    function getVotingStatus() public view returns (bool) {
        return (block.timestamp >= votingStart && block.timestamp < votingEnd);
    }

    function getRemainingTime() public view returns (uint256) {
        if (block.timestamp < votingStart) {
            return 0;
        }
        if (block.timestamp >= votingEnd) {
            return 0;
        }
        return votingEnd - block.timestamp;
    }

    function getWinner() public view returns (string memory winnerName, uint256 winningVoteCount) {
        require(block.timestamp >= votingEnd, "Voting has not ended yet");
        require(candidates.length > 0, "No candidates");
        winningVoteCount = 0;
        winnerName = "";
        for (uint256 i = 0; i < candidates.length; i++) {
            if (candidates[i].voteCount > winningVoteCount) {
                winningVoteCount = candidates[i].voteCount;
                winnerName = candidates[i].name;
            }
        }
    }

    function endVoting() public onlyOwner {
        require(!isEnded, "Voting already ended");
        isEnded = true;
        votingEnd = block.timestamp;
        (string memory winnerName, uint256 winningVoteCount) = getVotingStatus() ? ("", 0) : _getWinnerInternal();
        emit VotingEnded(winnerName, winningVoteCount);
    }

    function _getWinnerInternal() internal view returns (string memory, uint256) {
        require(candidates.length > 0, "No candidates");
        uint256 winningVoteCount = 0;
        string memory winnerName = "";
        for (uint256 i = 0; i < candidates.length; i++) {
            if (candidates[i].voteCount > winningVoteCount) {
                winningVoteCount = candidates[i].voteCount;
                winnerName = candidates[i].name;
            }
        }
        return (winnerName, winningVoteCount);
    }
}