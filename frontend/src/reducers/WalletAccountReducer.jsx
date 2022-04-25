const WalletAccountReducer = (state, action) => {
  switch (action.type) {
    case 'RETRIEVE_WALLET_ACCOUNT':
      return state.currentAccount;
    case 'SET_WALLET_ACCOUNT':
      return {
        ...state,
        currentAccount: action.payload
      };
    case 'RETRIEVE_TOTAL_WISHES':
      return state.totalWishes;
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
    case 'RETRIEVE_TOTAL_VOTES':
      return state.totalVotes;
    case 'SET_TOTAL_VOTES':
      return {
        ...state,
        totalVotes: action.payload
      };
    default:
      return state;
  }
};

export default WalletAccountReducer;
