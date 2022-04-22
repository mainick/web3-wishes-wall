import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import abi from '../../WishesWall.json';
import WishItem from './WishItem';

const WishesList = ({ totalWishes }) => {
  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
  const contractAbi = abi.abi;
  const [allWishes, setAllWishes] = useState([]);
  const [loadingAllWishes, setLoadingAllWishes] = useState(false);

  const retrieveAllWishes = async () => {
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

      setLoadingAllWishes(true);
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const wishesWallContract = new ethers.Contract(contractAddress, contractAbi, signer);

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
    let wishesWallContract;

    const onNewWish = (from, timestamp, message) => {
      console.log('New wish:', from, timestamp, message);
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

    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const wishesWallContract = new ethers.Contract(contractAddress, contractAbi, signer);
      wishesWallContract.on('NewWish', onNewWish);
    }

    return () => {
      if (wishesWallContract) {
        wishesWallContract.off('NewWish', onNewWish);
      }
    };
  }, [totalWishes]);

  if (loadingAllWishes) return <progress className="progress w-56"></progress>;

  return (
    <div className="grid grid-cols-1 justify-items-center gap-6">
      {allWishes.map((wish) => (
        <WishItem key={wish.id} wish={wish} />
      ))}
    </div>
  );
};

export default WishesList;
