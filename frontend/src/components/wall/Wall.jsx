import { useContext } from 'react';
import { BsHeart } from 'react-icons/bs';
import WalletAccount from './WalletAccount';
import SMWishesWallContext from '../../contexts/SMWishesWallContext';
import WishesList from './WishesList';

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
              <div className="stat">
                <div className="stat-figure text-primary">
                  <BsHeart className="stat-icon inline-block h-8 w-8 stroke-current" />
                </div>
                <div className="stat-title">Total Wishes Sent</div>
                <div className="stat-value text-primary">{walletAccount.totalWishes}</div>
              </div>
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
