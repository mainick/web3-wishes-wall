import { useEffect, useMemo, useReducer } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import Like from './assets/like.svg';
import SocialIcon from './components/SocialIcon/SocialIcon';
import SMWishesWallContext from './contexts/SMWishesWallContext';
import WalletAccountReducer from './reducers/WalletAccountReducer';
import Wall from './components/Wall/Wall';
import 'react-toastify/dist/ReactToastify.min.css';
import { AiFillGithub } from 'react-icons/ai';

function App() {
  const [walletAccount, dispatchWalletAccount] = useReducer(WalletAccountReducer, {
    currentAccount: '',
    totalWishes: 0,
    totalVotes: 0
  });
  const valueWalletAccountContext = useMemo(
    () => [walletAccount, dispatchWalletAccount],
    [walletAccount, dispatchWalletAccount]
  );

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

        <footer className="footer footer-center relative mt-4 bg-primary p-10 text-primary-content">
          <div className="absolute top-0 right-0 p-4">
            <a
              href="https://github.com/mainick/web3-wishes-wall"
              target="_blank"
              className="link-hover link tooltip tooltip-bottom hover:underline-offset-0"
              data-tip="Repository Wishes Wall">
              <AiFillGithub className="inline-block h-8 w-8 stroke-current" />
            </a>
          </div>
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
