import React, { useContext, useState } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import { BiLinkExternal } from 'react-icons/bi';
import abi from '../../WishesWall.json';
import SMWishesWallContext from '../../contexts/SMWishesWallContext';

const WalletAccount = () => {
  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
  const contractAbi = abi.abi;
  const [walletAccount, dispatchWalletAccount] = useContext(SMWishesWallContext);
  const [loadingMining, setLoadingMining] = useState(false);
  const [wishTnxHash, setWishTnxHash] = useState('');

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        toast('Make sure you have MetaMask!', {
          position: toast.POSITION.TOP_RIGHT,
          type: toast.TYPE.WARNING,
          theme: 'light'
        });
        return;
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) {
        const account = accounts[0];
        dispatchWalletAccount({ type: 'SET_WALLET_ACCOUNT', payload: account });
      } else {
        toast('No authorized accounts found', {
          position: toast.POSITION.TOP_RIGHT,
          type: toast.TYPE.WARNING,
          theme: 'light'
        });
      }
    } catch (error) {
      toast(error.message, {
        position: toast.POSITION.TOP_RIGHT,
        type: toast.TYPE.ERROR,
        theme: 'light'
      });
    }
  };

  const wishesWall = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        toast('Make sure you have MetaMask!', {
          position: toast.POSITION.TOP_RIGHT,
          type: toast.TYPE.WARNING,
          theme: 'light'
        });
        return;
      }

      setLoadingMining(true);
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const wishesWallContract = new ethers.Contract(contractAddress, contractAbi, signer);

      const wishTnx = await wishesWallContract.wish();
      console.log('Mining...', wishTnx.hash);
      setWishTnxHash(wishTnx.hash);

      await wishTnx.wait();
      setLoadingMining(false);
      setWishTnxHash('');
      toast('Wish sent!', {
        toastId: wishTnx.hash,
        position: toast.POSITION.TOP_RIGHT,
        type: toast.TYPE.SUCCESS,
        theme: 'light'
      });

      const countWishes = await wishesWallContract.getTotalWishes();
      dispatchWalletAccount({ type: 'SET_TOTAL_WISHES', payload: countWishes.toNumber() });
    } catch (error) {
      setLoadingMining(false);
      setWishTnxHash('');
      toast(error.message, {
        position: toast.POSITION.TOP_RIGHT,
        type: toast.TYPE.WARNING,
        theme: 'light'
      });
    }
  };

  return (
    <div className="card w-full max-w-sm flex-shrink-0 bg-base-100 shadow-2xl">
      <div className="card-body">
        <div className="form-control mt-6">
          {walletAccount.currentAccount ? (
            <div className="account">
              <div className="font-bold">Your account:</div>
              <div className="text-gray-500">{walletAccount.currentAccount}</div>
              <button
                type="button"
                className={`btn btn-primary btn-block ${loadingMining && 'btn-disabled'}`}
                onClick={wishesWall}>
                Send your wish
              </button>
              {loadingMining && (
                <>
                  <progress className="progress progress-primary w-full" />
                  {wishTnxHash && (
                    <a
                      href={`https://rinkeby.etherscan.io/tx/${wishTnxHash}`}
                      target="_blank"
                      className="link-neutral link"
                      rel="noopener noreferrer">
                      go to transaction{' '}
                      <BiLinkExternal className="inline-block h-4 w-4 stroke-current" />
                    </a>
                  )}
                </>
              )}
            </div>
          ) : (
            <button type="button" className="btn btn-primary btn-block" onClick={connectWallet}>
              <span className="btn-text">Connect your wallet</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletAccount;
