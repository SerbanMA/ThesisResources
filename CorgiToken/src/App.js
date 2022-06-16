import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';

import background from './image/background.png';
import Connect from './components/connect/Connect';
import Toolbar from './components/toolbar/Toolbar';
import Gallery from './components/gallery/Gallery';
import Battle from './components/battle/Battle';
import { fetchData } from './redux/data/dataActions';
import Market from './components/market/Market';

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);

  useEffect(() => {
    window.setInterval(function () {
      if (blockchain.account !== null && blockchain.corgiToken !== null) {
        dispatch(fetchData(blockchain.account));
      }
    }, 5 * 1000);
  }, [blockchain.account, blockchain.corgiToken, dispatch]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        backgroundImage: `url(${background})`,
      }}
    >
      <div className="side-separator" />

      <div className="screen">
        {blockchain.account === null || blockchain.corgiToken === null ? (
          <Connect />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Toolbar />
            {data.currentTab === 'gallery' && <Gallery />}
            {data.currentTab === 'battle' && <Battle />}
            {data.currentTab === 'market' && <Market />}
          </div>
        )}
      </div>

      <div className="side-separator" />
    </div>
  );
}

export default App;
