const WalletAccountReducer = (state, action) => {
  switch (action.type) {
    case 'RETRIEVE_WALLET_ACCOUNT':
      return state.currentAccount;
    case 'RETRIEVE_TOTAL_WISHES':
      return state.totalWishes;
    case 'SET_WALLET_ACCOUNT':
      return {
        ...state,
        currentAccount: action.payload
      };
    case 'SET_TOTAL_WISHES':
      return {
        ...state,
        totalWishes: action.payload
      };
    case 'ADD_WISH':
      return {
        ...state,
        totalWishes: state.totalWishes + 1
      };
    default:
      return state;
  }
};

export default WalletAccountReducer;
