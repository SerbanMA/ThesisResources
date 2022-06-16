const initialState = {
  account: null,
  corgiToken: null,
  web3: null,
  errorMsg: '',
};

const blockchainReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CONNECTION_REQUEST':
      return {
        ...state,
        loading: true,
        errorMsg: '',
      };
    case 'CONNECTION_SUCCESS':
      return {
        ...state,
        loading: false,
        account: action.payload.account,
        corgiToken: action.payload.corgiToken,
        web3: action.payload.web3,
      };
    case 'CONNECTION_FAILED':
      return {
        ...initialState,
        loading: false,
        errorMsg: action.payload,
      };
    default:
      return state;
  }
};

export default blockchainReducer;
