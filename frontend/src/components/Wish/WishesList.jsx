import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import WishItem from './WishItem';
import useWishesWallContract from '../../hooks/useWishesWallContract';

const WishesList = () => {
  const { wishesWallContract } = useWishesWallContract();
  const [allWishes, setAllWishes] = useState([]);
  const [loadingAllWishes, setLoadingAllWishes] = useState(false);

  const retrieveAllWishes = async () => {
    try {
      setLoadingAllWishes(true);
      const wishes = await wishesWallContract.getAllWishes();
      if (wishes) {
        const wishesArray = [];
        for (let wishId = 0; wishId < wishes.length; wishId++) {
          let message = wishes[wishId].message;
          if (message.trim() === '') message = 'No message';
          let avgRating =
            wishes[wishId].voteCount > 0
              ? await wishesWallContract.getAverageRatingOfWish(wishId)
              : 0;
          wishesArray.push({
            id: wishId,
            owner: wishes[wishId].owner,
            timestamp: new Date(wishes[wishId].timestamp * 1000),
            message: message,
            voteSum: wishes[wishId].voteSum,
            voteCount: wishes[wishId].voteCount,
            avgRating
          });
        }
        setAllWishes(wishesArray);
      }
      setLoadingAllWishes(false);
    } catch (e) {
      setLoadingAllWishes(false);
      setAllWishes([]);
      toast("I can't query the smart contract", {
        position: toast.POSITION.TOP_RIGHT,
        type: toast.TYPE.WARNING,
        theme: 'light'
      });
    }
  };

  useEffect(() => {
    if (wishesWallContract) {
      retrieveAllWishes();
    }
  }, []);

  useEffect(() => {
    const onNewWish = (id, from, timestamp, message) => {
      setAllWishes((prevWishes) => [
        ...prevWishes,
        {
          id: id,
          owner: from,
          timestamp: new Date(timestamp * 1000),
          message
        }
      ]);
    };

    const onNewVote = (wishId, from, timestamp, vote) => {
      setAllWishes((prevWishes) =>
        prevWishes.map((wish) => {
          if (wish.id === wishId) {
            if (wish.voteSum) {
              wish.voteSum += vote;
            } else {
              wish.voteSum = vote;
            }
            if (wish.voteCount) {
              wish.voteCount += 1;
            } else {
              wish.voteCount = 1;
            }
            wish.avgRating = wish.voteCount > 0 ? Math.floor(wish.voteSum / wish.voteCount) : 0;
          }
          return wish;
        })
      );
    };

    if (wishesWallContract) {
      wishesWallContract.on('NewWish', onNewWish);
      wishesWallContract.on('NewVote', onNewVote);
    }

    return () => {
      if (wishesWallContract) {
        wishesWallContract.off('NewWish', onNewWish);
        wishesWallContract.off('NewVote', onNewVote);
      }
    };
  }, []);

  if (loadingAllWishes) return <progress className="progress w-56"></progress>;

  return (
    <div className="grid grid-cols-4 justify-items-center gap-6">
      {allWishes.map((wish) => (
        <WishItem key={wish.id} wish={wish} />
      ))}
    </div>
  );
};

export default WishesList;
