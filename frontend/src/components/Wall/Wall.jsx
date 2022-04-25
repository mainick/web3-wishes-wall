import { useContext } from 'react';
import { BsHeart } from 'react-icons/bs';
import WalletAccount from './WalletAccount';
import SMWishesWallContext from '../../contexts/SMWishesWallContext';
import WishesList from '../Wish/WishesList';
import WishesCountStat from '../Wish/WishesCountStat';
import VotesCountStat from '../Vote/VotesCountStat';

const Wall = () => {
  const [walletAccount] = useContext(SMWishesWallContext);
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
