import { useContext, useState } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import { BiLinkExternal } from 'react-icons/bi';
import SMWishesWallContext from '../../contexts/SMWishesWallContext';
import useWishesWallContract from '../../hooks/useWishesWallContract';

const WalletAccount = () => {
  const { wishesWallContract } = useWishesWallContract();
  const [walletAccount, dispatchWalletAccount] = useContext(SMWishesWallContext);
  const [loadingMining, setLoadingMining] = useState(false);
  const [wishTnxHash, setWishTnxHash] = useState('');
  const [wishMessage, setWishMessage] = useState('');

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

  const handleChangeWishMessage = (e) => {
    setWishMessage(e.target.value);
  };

  const handleSendWish = async () => {
    if (wishMessage.trim() !== '') {
      try {
        setLoadingMining(true);
        const wishTnx = await wishesWallContract.wish(wishMessage, {
          gasLimit: ethers.utils.parseUnits('210000', 'wei')
        });
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
        dispatchWalletAccount({ type: 'SET_TOTAL_WISHES', payload: countWishes });
      } catch (error) {
        setLoadingMining(false);
        setWishTnxHash('');
        toast(error.message, {
          position: toast.POSITION.TOP_RIGHT,
          type: toast.TYPE.WARNING,
          theme: 'light'
        });
      }
    } else {
      toast('Write your wish', {
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
              <div className="font-bold">
                <a
                  href={`https://etherscan.io/address/${walletAccount.currentAccount}`}
                  target="_blank"
                  className="link-hover link"
                  rel="noopener noreferrer">
                  Your account{` `}
                  <BiLinkExternal className="inline-block h-4 w-4 stroke-current" />
                </a>
              </div>
              <textarea
                name="wishMessage"
                value={wishMessage}
                onChange={handleChangeWishMessage}
                className="textarea-bordered textarea my-1 w-full"
                placeholder="Write your wish here..."
                required={true}
              />
              <button
                type="button"
                className={`btn btn-primary btn-block ${loadingMining && 'btn-disabled'}`}
                onClick={handleSendWish}>
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
                      your wishes are granted by the smart contract
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
