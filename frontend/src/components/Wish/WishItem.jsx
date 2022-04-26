import { useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import PropTypes from 'prop-types';
import { BiInfoCircle, BiLinkExternal } from 'react-icons/bi';
import useWishesWallContract from '../../hooks/useWishesWallContract';
import { toast } from 'react-toastify';
import SMWishesWallContext from '../../contexts/SMWishesWallContext';

const WishItem = ({ wish }) => {
  const { wishesWallContract } = useWishesWallContract();
  const [walletAccount, dispatchWalletAccount] = useContext(SMWishesWallContext);
  const [loadingVoteMining, setLoadingVoteMining] = useState(false);

  const handleVoteWish = async (wishId, rate) => {
    try {
      setLoadingVoteMining(true);
      const voteTnx = await wishesWallContract.vote(wishId, rate, {
        gasLimit: ethers.utils.parseUnits('210000', 'wei')
      });
      await voteTnx.wait();

      setLoadingVoteMining(false);
      toast('Your vote has been registered successfully!', {
        toastId: voteTnx.hash,
        position: toast.POSITION.TOP_RIGHT,
        type: toast.TYPE.SUCCESS,
        theme: 'light'
      });

      const countVotes = await wishesWallContract.getTotalVotes();
      dispatchWalletAccount({ type: 'SET_TOTAL_VOTES', payload: countVotes });
    } catch (error) {
      setLoadingVoteMining(false);
      toast(error.message, {
        position: toast.POSITION.TOP_RIGHT,
        type: toast.TYPE.WARNING,
        theme: 'light'
      });
    }
  };

  return (
    <div className="card w-80 bg-neutral text-neutral-content">
      <div className="card-body items-center text-center">
        <h2 className="card-title">{wish.timestamp.toLocaleString()}</h2>
        <p className="text-lg">{wish.message}</p>
        <a
          href={`https://rinkeby.etherscan.io/address/${wish.owner}`}
          target="_blank"
          className="link-hover link font-semibold text-slate-50 hover:text-slate-100"
          rel="noopener noreferrer">
          owner{` `}
          <BiLinkExternal className="inline-block h-4 w-4 stroke-current" />
        </a>

        <div className="alert shadow-lg">
          <div>
            <BiInfoCircle className="inline-block h-4 w-4 stroke-current text-blue-600" />
            <div>
              <h3 className="font-bold text-gray-800">Rating!</h3>
              <div className="tooltip text-xs text-gray-800">{wish.voteCount} times</div>
            </div>
          </div>
          <div className="flex-none">
            <div className="rating gap-1">
              <input
                type="radio"
                name="wish-rating"
                className="mask mask-heart bg-red-400"
                checked={wish.avgRating === 1}
                disabled={loadingVoteMining}
                onClick={() => handleVoteWish(wish.id, 1)}
              />
              <input
                type="radio"
                name="wish-rating"
                className="mask mask-heart bg-orange-400"
                checked={wish.avgRating === 2}
                disabled={loadingVoteMining}
                onClick={() => handleVoteWish(wish.id, 2)}
              />
              <input
                type="radio"
                name="wish-rating"
                className="mask mask-heart bg-yellow-400"
                checked={wish.avgRating === 3}
                disabled={loadingVoteMining}
                onClick={() => handleVoteWish(wish.id, 3)}
              />
              <input
                type="radio"
                name="wish-rating"
                className="mask mask-heart bg-lime-400"
                checked={wish.avgRating === 4}
                disabled={loadingVoteMining}
                onClick={() => handleVoteWish(wish.id, 4)}
              />
              <input
                type="radio"
                name="wish-rating"
                className="mask mask-heart bg-green-400"
                checked={wish.avgRating === 5}
                disabled={loadingVoteMining}
                onClick={() => handleVoteWish(wish.id, 5)}
              />
            </div>
          </div>
        </div>

        {loadingVoteMining && <progress className="progress progress-primary w-full" />}
      </div>
    </div>
  );
};

WishItem.propTypes = {
  wish: PropTypes.exact({
    id: PropTypes.number.isRequired,
    owner: PropTypes.string.isRequired,
    timestamp: PropTypes.instanceOf(Date).isRequired,
    message: PropTypes.string.isRequired,
    voteSum: PropTypes.number,
    voteCount: PropTypes.number,
    avgRating: PropTypes.number
  }).isRequired
};

export default WishItem;
