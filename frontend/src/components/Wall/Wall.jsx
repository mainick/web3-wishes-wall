import { useContext, useEffect } from 'react';
import WalletAccount from './WalletAccount';
import SMWishesWallContext from '../../contexts/SMWishesWallContext';
import WishesList from '../Wish/WishesList';
import WishesCountStat from '../Wish/WishesCountStat';
import VotesCountStat from '../Vote/VotesCountStat';
import { toast } from 'react-toastify';
import useWishesWallContract from '../../hooks/useWishesWallContract';

const Wall = () => {
  const [walletAccount, dispatchWalletAccount] = useContext(SMWishesWallContext);
  const { wishesWallContract } = useWishesWallContract();

  const retrieveTotalWishes = async () => {
    if (walletAccount.currentAccount) {
      try {
        const countWishes = await wishesWallContract.getTotalWishes();
        dispatchWalletAccount({ type: 'SET_TOTAL_WISHES', payload: countWishes });
      } catch (error) {
        toast("I can't query the smart contract for count wishes", {
          position: toast.POSITION.TOP_RIGHT,
          type: toast.TYPE.WARNING,
          theme: 'light'
        });
      }
    }
  };

  const retrieveTotalVotes = async () => {
    if (walletAccount.currentAccount) {
      try {
        const countVotes = await wishesWallContract.getTotalVotes();
        dispatchWalletAccount({ type: 'SET_TOTAL_VOTES', payload: countVotes });
      } catch (error) {
        toast("I can't query the smart contract for count votes", {
          position: toast.POSITION.TOP_RIGHT,
          type: toast.TYPE.WARNING,
          theme: 'light'
        });
      }
    }
  };

  useEffect(() => {
    if (walletAccount.currentAccount !== '') {
      retrieveTotalWishes();
      retrieveTotalVotes();
    }
  }, [walletAccount.currentAccount]);

  return (
    <>
      <div className="hero mb-4 h-auto min-h-max bg-base-200 py-14">
        <div className="hero-content min-w-full flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-bold">👋 Hey there!</h1>
            <p className="py-6">Connect your Ethereum wallet and send a special wish!</p>

            <div className="stats shadow">
              <WishesCountStat totalWishes={walletAccount.totalWishes} />
              <VotesCountStat totalVotes={walletAccount.totalVotes} />
            </div>
          </div>
          <WalletAccount />
        </div>
      </div>
      {walletAccount.currentAccount && <WishesList />}
    </>
  );
};

export default Wall;
