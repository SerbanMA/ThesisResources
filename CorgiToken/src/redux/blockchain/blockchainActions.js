import Web3 from 'web3';
import CorgiToken from '../../contracts/CorgiToken.json';

const connectRequest = () => {
  return {
    type: 'CONNECTION_REQUEST',
  };
};

const connectSuccess = (payload) => {
  return {
    type: 'CONNECTION_SUCCESS',
    payload: payload,
  };
};

const connectFailed = (payload) => {
  return {
    type: 'CONNECTION_FAILED',
    payload: payload,
  };
};

export const connect = () => {
  return async (dispatch) => {
    dispatch(connectRequest());
    if (window.ethereum) {
      let web3 = new Web3(window.ethereum);
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        const networkId = window.ethereum.networkVersion;

        const corgiTokenNetworkData = await CorgiToken.networks[networkId];
        if (corgiTokenNetworkData) {
          const corgiToken = new web3.eth.Contract(
            CorgiToken.abi,
            corgiTokenNetworkData.address
          );
          dispatch(
            connectSuccess({
              account: accounts[0],
              corgiToken: corgiToken,
              web3: web3,
            })
          );

          window.ethereum.on('accountsChanged', () => {
            window.location.reload();
          });
          window.ethereum.on('chainChanged', () => {
            window.location.reload();
          });

        } else {
          dispatch(connectFailed('Change Network ID'));
        }
      } catch (err) {
        dispatch(
          connectFailed('Something went wrong. Please try again or check MetaMask')
        );
      }
    } else {
      dispatch(connectFailed('You need to have MetaMask installed'));
    }
  };
};
