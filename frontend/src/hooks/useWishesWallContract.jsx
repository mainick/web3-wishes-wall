import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import abi from '../WishesWall.json';

const useWishesWallContract = () => {
  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
  const contractAbi = abi.abi;
  let wishesWallContract = null;

  try {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      wishesWallContract = new ethers.Contract(contractAddress, contractAbi, provider.getSigner());
    } else {
      toast('Make sure you have MetaMask!', {
        position: toast.POSITION.TOP_RIGHT,
        type: toast.TYPE.WARNING,
        theme: 'light'
      });
    }
  } catch (error) {
    toast(error.message, {
      position: toast.POSITION.TOP_RIGHT,
      type: toast.TYPE.WARNING,
      theme: 'light'
    });
  }

  return { wishesWallContract };
};

export default useWishesWallContract;
