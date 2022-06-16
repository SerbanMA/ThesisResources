const initialState = {
  allCorgis: [],
  allOwnerCorgis: [],
  allMarketCorgis: [],
  selectedCorgis: [],
  currentTab: 'gallery',
  errorMsg: '',
  rank: 0,
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_DATA_REQUEST':
      return {
        ...state,
        errorMsg: '',
      };
    case 'FETCH_DATA_SUCCESS':
      return {
        ...state,
        allCorgis: action.payload.allCorgis,
        allOwnerCorgis: action.payload.allOwnerCorgis,
        allMarketCorgis: action.payload.allMarketCorgis,
        rank: action.payload.rank,
      };
    case 'FETCH_DATA_FAILED':
      return {
        ...initialState,
        errorMsg: action.payload,
      };
    case 'CHANGE_TAB_NAME':
      return {
        ...state,
        currentTab: action.payload,
      };
    case 'ADD_SELECTED_CORGI':
      return {
        ...state,
        selectedCorgis: [...state.selectedCorgis, action.payload],
      };
    case 'REMOVE_SELECTED_CORGI':
      return {
        ...state,
        selectedCorgis: state.selectedCorgis.filter((item) => item.id !== action.payload),
      };
    case 'UPDATE_DEAD_CORGI':
      const newOwnerCorgis = state.allOwnerCorgis;
      const corgiId = newOwnerCorgis.findIndex((corgi) => corgi.id === action.payload);
      newOwnerCorgis[corgiId].dead = true;

      return {
        ...state,
        allOwnerCorgis: newOwnerCorgis,
      };

    default:
      return state;
  }
};

export default dataReducer;
