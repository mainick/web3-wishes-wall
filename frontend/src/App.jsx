import { useEffect, useMemo, useReducer } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import Like from './assets/like.svg';
import SocialIcon from './components/SocialIcon/SocialIcon';
import SMWishesWallContext from './contexts/SMWishesWallContext';
import WalletAccountReducer from './reducers/WalletAccountReducer';
import Wall from './components/wall/Wall';
import 'react-toastify/dist/ReactToastify.min.css';
import useWishesWallContract from './hooks/useWishesWallContract';

function App() {
  const { wishesWallContract } = useWishesWallContract();
  const [walletAccount, dispatchWalletAccount] = useReducer(WalletAccountReducer, {
    currentAccount: '',
    totalWishes: 0
  });
  const valueWalletAccountContext = useMemo(
    () => [walletAccount, dispatchWalletAccount],
    [walletAccount, dispatchWalletAccount]
  );

  const retrieveTotalWishes = async () => {
    try {
      const countWishes = await wishesWallContract.getTotalWishes();
      dispatchWalletAccount({ type: 'SET_TOTAL_WISHES', payload: countWishes.toNumber() });
    } catch (error) {
      toast("I can't query the smart contract", {
        position: toast.POSITION.TOP_RIGHT,
        type: toast.TYPE.WARNING,
        theme: 'light'
      });
    }
  };

  const checkIfWalletIsConnected = async () => {
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

      const accounts = await ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        const account = accounts[0];
        dispatchWalletAccount({ type: 'SET_WALLET_ACCOUNT', payload: account });

        retrieveTotalWishes();
      }
    } catch (error) {
      toast(error.message, {
        position: toast.POSITION.TOP_RIGHT,
        type: toast.TYPE.ERROR,
        theme: 'light'
      });
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <SMWishesWallContext.Provider value={valueWalletAccountContext}>
      <div className="container mx-auto py-4">
        <Wall />

        <footer className="footer footer-center mt-4 bg-primary p-10 text-primary-content">
          <div>
            <img alt="Wishes Wall" src={Like} className="h-12 w-12 fill-current" />
            <p>
              &copy; 2022 -{' '}
              <a
                href="https://www.mainickweb.com"
                target="_blank"
                className="text-white-500 hover:text-white-600 text-sm transition"
                rel="noopener noreferrer">
                Maico Orazio
              </a>
            </p>
          </div>
          <div>
            <div className="grid grid-flow-col gap-4">
              <SocialIcon kind="blog" url="https://www.mainickweb.com" />
              <SocialIcon kind="github" url="https://github.com/mainick" />
              <SocialIcon kind="linkedin" url="http://www.linkedin.com/in/maicoorazio" />
              <SocialIcon kind="twitter" url="http://twitter.com/mainick" />
            </div>
          </div>
        </footer>
      </div>
      <ToastContainer />
    </SMWishesWallContext.Provider>
  );
}

export default App;
