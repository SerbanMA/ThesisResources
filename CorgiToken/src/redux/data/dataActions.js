import { ENDURANCE } from '../constants';
import store from '../store';

const fetchDataRequest = () => {
  return {
    type: 'FETCH_DATA_REQUEST',
  };
};

const fetchDataSuccess = (payload) => {
  return {
    type: 'FETCH_DATA_SUCCESS',
    payload: payload,
  };
};

const fetchDataFailed = (payload) => {
  return {
    type: 'FETCH_DATA_FAILED',
    payload: payload,
  };
};

export const fetchData = (account) => {
  return async (dispatch) => {
    dispatch(fetchDataRequest());
    try {
      let allCorgis = await store
        .getState()
        .blockchain.corgiToken.methods.getCorgis()
        .call();

      allCorgis = allCorgis.map((corgi) => {
        return corgiFormat(corgi);
      });

      let allOwnerCorgis = await store
        .getState()
        .blockchain.corgiToken.methods.getOwnerCorgis(account)
        .call();

      allOwnerCorgis = allOwnerCorgis.map((corgi) => {
        return corgiFormat(corgi);
      });

      let allMarketCorgis = allCorgis.filter(
        (corgi) =>
          corgi.onMarket === true &&
          allOwnerCorgis.filter((c) => c.id === corgi.id).length === 0
      );

      let rank = await store
        .getState()
        .blockchain.corgiToken.methods.getRank(account)
        .call();

      dispatch(
        fetchDataSuccess({
          allCorgis,
          allOwnerCorgis,
          allMarketCorgis,
          rank,
        })
      );
    } catch (err) {
      dispatch(fetchDataFailed('Could not load data from contract.'));
      console.log(err);
    }
  };
};

// -- TAB VARIABLE --

const changeTabName = (payload) => {
  return {
    type: 'CHANGE_TAB_NAME',
    payload: payload,
  };
};

export const setTabName = (tabName) => {
  return async (dispatch) => {
    dispatch(changeTabName(tabName));
  };
};

// -- CORGIS --

const addSelectedCorgiAction = (payload) => {
  return {
    type: 'ADD_SELECTED_CORGI',
    payload: payload,
  };
};

export const addSelectedCorgi = (corgi) => {
  return async (dispatch) => {
    dispatch(addSelectedCorgiAction(corgi));
  };
};

const removeSelectedCorgiAction = (payload) => {
  return {
    type: 'REMOVE_SELECTED_CORGI',
    payload: payload,
  };
};

export const removeSelectedCorgi = (corgiId) => {
  return async (dispatch) => {
    dispatch(removeSelectedCorgiAction(corgiId));
  };
};

const updateDeadCorgiAction = (payload) => {
  return {
    type: 'UPDATE_DEAD_CORGI',
    payload: payload,
  };
};

export const updateDeadCorgi = (corgiId) => {
  return async (dispatch) => {
    dispatch(updateDeadCorgiAction(corgiId));
  };
};

// -- HELPER --

const corgiFormat = (corgi) => {
  return {
    ...corgi,
    lastMeal: corgi.lastMeal * 1000,
    dead: corgi.lastMeal * 1000 + ENDURANCE < new Date().getTime(),
    price: corgi.price / 100,
  };
};
