import React from 'react';
import './Connect.css';

import { connect } from '../../redux/blockchain/blockchainActions';
import { useDispatch, useSelector } from 'react-redux';

import { Fab, Tooltip } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { AiFillGithub } from 'react-icons/ai';
import Snack from '../../helper/helper';

function Connect() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);

  function callConnect(event) {
    event.preventDefault();
    dispatch(connect());
  }

  return (
    <div className="connect">
      <div className="border">
        <div className="text">Connect to Corgi Game</div>

        <Fab className="play" onClick={(e) => callConnect(e)}>
          <PlayArrowIcon />
        </Fab>
      </div>
      <div className="connect-help">
        <Tooltip title="GitHub" placement="bottom">
          <Fab
            style={{ fontSize: '32px' }}
            onClick={() => {
              window.open('https://github.com/SerbanMA/ThesisResources', '_blank');
            }}
          >
            <AiFillGithub />
          </Fab>
        </Tooltip>
      </div>
      <Snack open={blockchain.errorMsg !== ''} message={blockchain.errorMsg}></Snack>
    </div>
  );
}

export default Connect;
