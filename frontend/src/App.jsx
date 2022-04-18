import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import abi from './WishesWall.json';

function App() {
  const [currenctAccount, setCurrentAccount] = useState('');
  const contractAddress = '0x811f6FA2Eb1de6B2811F4DB0969b2A5f3B678714';
  const contractAbi = abi.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        console.log('We have the ethereum object', ethereum);
      } else {
        console.warn('Make sure you have MetaMask!');
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        const account = accounts[0];
        console.log('Found an authorized account:', account);
        setCurrentAccount(account);
      } else {
        console.log('No authorized accounts found');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.warn('Make sure you have MetaMask!');
        return;
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) {
        const account = accounts[0];
        console.log('Connected to account:', accounts[0]);
        setCurrentAccount(account);
      } else {
        console.log('No accounts found');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const wishesWall = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.warn('Make sure you have MetaMask!');
        return;
      }

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const wishesWallContract = new ethers.Contract(contractAddress, contractAbi, signer);

      let countWishes = await wishesWallContract.getTotalWishes();
      console.log('Total wishes:', countWishes.toNumber());

      const wishTnx = await wishesWallContract.wish();
      console.log('Mining...', wishTnx.hash);

      await wishTnx.wait();
      console.log('Mined!', wishTnx.hash);

      countWishes = await wishesWallContract.getTotalWishes();
      console.log('Total wishes:', countWishes.toNumber());
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">👋 Hey there!</div>

        <div className="bio">Connect your Ethereum wallet and send a special wish!</div>

        {currenctAccount ? (
          <div className="account">
            <div className="accountHeader">Your account:</div>
            <div className="accountAddress">{currenctAccount}</div>
            <button type="button" className="waveButton" onClick={wishesWall}>
              Send your wish
            </button>
          </div>
        ) : (
          <button type="button" className="connectWalletButton" onClick={connectWallet}>
            Connect your wallet
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
