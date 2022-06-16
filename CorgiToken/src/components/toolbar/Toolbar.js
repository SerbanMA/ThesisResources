import React from 'react';
import './Toolbar.css';
import { useDispatch, useSelector } from 'react-redux';
import { setTabName } from '../../redux/data/dataActions';

import { GiTwoCoins } from 'react-icons/gi';
import { Tooltip } from '@mui/material';

const main = '#ffa600b3';
const side = 'rgba(0, 0, 0, 0.5)';

function Toolbar() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.data);

  return (
    <div className="toolbar">
      <div className="toolbar-elements">
        <div
          className="tab gallery"
          style={{
            backgroundColor: data.currentTab === 'gallery' ? main : side,
            color: data.currentTab === 'gallery' ? 'black' : 'orange',
          }}
          onClick={(e) => {
            e.preventDefault();
            if (data.currentTab !== 'gallery') {
              dispatch(setTabName('gallery'));
            }
          }}
        >
          Gallery
        </div>

        <div
          className="tab"
          style={{
            backgroundColor: data.currentTab === 'battle' ? main : side,
            color: data.currentTab === 'battle' ? 'black' : 'orange',
          }}
          onClick={(e) => {
            e.preventDefault();
            if (data.currentTab !== 'battle') {
              dispatch(setTabName('battle'));
            }
          }}
        >
          Battle
        </div>

        <div
          className="tab market"
          style={{
            backgroundColor: data.currentTab === 'market' ? main : side,
            color: data.currentTab === 'market' ? 'black' : 'orange',
          }}
          onClick={(e) => {
            e.preventDefault();
            if (data.currentTab !== 'market') {
              dispatch(setTabName('market'));
            }
          }}
        >
          Market
        </div>
      </div>
      <Tooltip title="Coins" placement="top">
        <div className="toolbar-rank">
          <div>
            <GiTwoCoins />
          </div>
          <div style={{ marginLeft: '20px', marginRight: '20px' }}>{data.rank}</div>
          <div>
            <GiTwoCoins />
          </div>
        </div>
      </Tooltip>
    </div>
  );
}

export default Toolbar;
