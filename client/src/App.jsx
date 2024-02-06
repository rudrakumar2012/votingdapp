import { useState, useEffect } from 'react';
import abi from "./contractJson/Voting.json"
import { ethers } from 'ethers';
import Login from "./Components/Login";
import Connected from "./Components/Connected"

function App() {
  const VotingContractAddress = "0xA860b5865FB1cDA9bbc956dbF49F8ffac6D34C2D";
  const VotingAbi = abi.abi;
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  },[provider]);

  function handleAccountsChanged(accounts) {
    if (accounts.length > 0 && account !== accounts[0]) {
      setAccount(accounts[0]);
    } else {
      setIsConnected(false);
      setAccount(null);
    }
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
      } catch (error) {
        alert(error);
      }
    } else {
      alert("Metamask is not detected in the browser");
    }
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 to-pink-500 flex flex-col justify-center items-center">
      {isConnected ? (
        <Connected account={account}/>
      ) : (
        <Login connectWallet={connectToMetamask} />
      )}
    </div>
  )
}

export default App
