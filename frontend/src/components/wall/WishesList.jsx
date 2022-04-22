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
        const wishesArray = wishes.map((item) => ({
          id: item.timestamp.toNumber(),
          owner: item.owner,
          timestamp: new Date(item.timestamp * 1000),
          message: item.message
        }));
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
    const onNewWish = (from, timestamp, message) => {
      setAllWishes((prevWishes) => [
        ...prevWishes,
        {
          id: timestamp.toNumber(),
          owner: from,
          timestamp: new Date(timestamp * 1000),
          message
        }
      ]);
    };

    if (wishesWallContract) {
      wishesWallContract.on('NewWish', onNewWish);
    }

    return () => {
      if (wishesWallContract) {
        wishesWallContract.off('NewWish', onNewWish);
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
