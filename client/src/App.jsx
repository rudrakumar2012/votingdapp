import { useState, useEffect } from 'react';
import abi from "./contractJson/Voting.json"
import { ethers } from 'ethers';
import Login from "./Components/Login";
import Connected from "./Components/Connected"

function App() {
  const VotingContractAddress = "0xC07d5Eb6b92ae853151BFA093334048A7c541b77";
  const VotingAbi = abi.abi;
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [VotingStatus, setVotingStatus] = useState(true);
  const [RemainingTime, setRemainingTime] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidateIndex, setSelectedCandidateIndex] = useState('');
  const [CanVote, setCanVote] = useState(true);

   // Initialize provider only if it hasn't been initialized yet
   useEffect(() => {
    if (!provider && window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);
      // Call getCandidates, getRemainingTime, and getCurrentStatus after setting the provider
      getCandidates();
      getRemainingTime();
      getCurrentStatus();
    }
  }, []); // <-- Empty dependency array to run only once

  useEffect(() => {
    if (provider) {
      getCandidates();
    }
  }, [provider]);
  
  useEffect(() => {
    // Set up account change listener
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }

    // Clean up listener on unmount
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  }, []); // <-- Empty dependency array to run only once

  function handleAccountsChanged(accounts) {
    if (accounts.length > 0 && account !== accounts[0]) {
      setAccount(accounts[0]);
      canVote();
    } else {
      setIsConnected(false);
      setAccount(null);
    }
  }

  async function vote() {
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      VotingContractAddress, VotingAbi, signer
    );
    const tx = await contractInstance.vote(selectedCandidateIndex);
    await tx.wait();
    canVote();
  }

  async function canVote() {
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      VotingContractAddress, VotingAbi, signer
    );
    const voteStatus = await contractInstance.voters(await signer.getAddress());
    setCanVote(voteStatus);
  }

  async function getCandidates() {
    if (provider) {
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(
        VotingContractAddress, VotingAbi, signer
      );
      const candidatesList = await contractInstance.getAllVotesOfCandiates();
      const formattedCandidates = candidatesList.map((candidate, index) => {
        return {
          index: index,
          name: candidate.name,
          voteCount: candidate.voteCount.toNumber()
        };
      });
      setCandidates(formattedCandidates);
    }
  }

   // Basic implementation of handleNumberChange
  const handleNumberChange = (event) => {
    setSelectedCandidateIndex(event.target.value);
  };

  async function getCurrentStatus() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract (
      VotingContractAddress, VotingAbi, signer
    );
    const status = await contractInstance.getVotingStatus();
    setVotingStatus(status);
  }

  async function getRemainingTime() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract (
      VotingContractAddress, VotingAbi, signer
    );
    const time = await contractInstance.getRemainingTime();
    setRemainingTime(parseInt(time, 16));
  }
  
  async function connectToMetamask() {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        console.log("Metamask Connected: " + address);
        setIsConnected(true);
        canVote();
      } catch (error) {
        alert(error);
      }
    } else {
      alert("Metamask is not detected in the browser");
    }
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 flex flex-col justify-center items-center">
      {isConnected ? (
        <Connected
          account={account}
          candidates={candidates}
          RemainingTime={RemainingTime}
          selectedCandidateIndex={selectedCandidateIndex}
          handleNumberChange={handleNumberChange}
          voteFunction={vote}
          showButton={CanVote}
        />
        ) : (
        <Login connectWallet={connectToMetamask} />
      )}
    </div>
  )
}

export default App
