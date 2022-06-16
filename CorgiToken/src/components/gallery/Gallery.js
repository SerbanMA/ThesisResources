import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './Gallery.css';

import { fetchData, updateDeadCorgi } from '../../redux/data/dataActions';
import CorgiCard from '../../components/corgiCard/CorgiCard';
import Snack, { reverse } from '../../helper/helper.js';

import plus from '../../image/plus.png';
import Dialog from '@mui/material/Dialog';
import Details from '../details/Details';
import { ENDURANCE } from '../../redux/constants';
import { FaEthereum } from 'react-icons/fa';

function Gallery() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);

  const [open, setOpen] = useState(false);
  const [openCorgi, setOpenCorgi] = useState(undefined);

  useEffect(() => {
    setOpenCorgi(data.allOwnerCorgis.filter((item) => item.id === openCorgi?.id)[0]);
  }, [data.allOwnerCorgis, openCorgi?.id]);

  useEffect(() => {
    if (blockchain.account !== '' && blockchain.corgiToken !== null) {
      dispatch(fetchData(blockchain.account));
    }
  }, [blockchain.corgiToken, blockchain.account, dispatch]);

  const mintNFT = () => {
    blockchain.corgiToken.methods
      .createRandomCorgi('Unknown')
      .send({
        from: blockchain.account,
        value: blockchain.web3.utils.toWei('0.01', 'ether'),
      })
      .once('error', () => {})
      .then(() => {
        dispatch(fetchData(blockchain.account));
      });
  };

  const openDetailsCorgi = (corgi) => {
    if (corgi.lastMeal + ENDURANCE < new Date().getTime()) {
      dispatch(updateDeadCorgi(corgi.id));
      return;
    }
    setOpen(true);
    setOpenCorgi(corgi);
  };

  const closeDetailsCorgi = () => {
    setOpen(false);
  };

  let allAliveCorgis = reverse(
    data.allOwnerCorgis.filter((corgi) => !corgi.dead && !corgi.onMarket)
  );

  let allDeadCorgis = reverse(data.allOwnerCorgis.filter((corgi) => corgi.dead));

  let allMarketCorgis = reverse(
    data.allOwnerCorgis.filter((corgi) => !corgi.dead && corgi.onMarket)
  );

  return (
    <div className="gallery">
      {data.allCorgis.length < 900 && (
        <div
          className="gallery-add-button"
          onClick={() => {
            mintNFT();
          }}
        >
          <img alt={'plus'} style={{ width: '128px' }} src={plus} />
          <div className="gallery-corgis-remained">
            Corgis: {data.allCorgis.length} / 900
          </div>
        </div>
      )}
      {allAliveCorgis.map((corgi, index) => {
        return (
          <div
            className="gallery-card"
            key={index}
            onClick={(e) => {
              e.preventDefault();
              openDetailsCorgi(corgi);
            }}
          >
            <CorgiCard corgi={corgi} />
          </div>
        );
      })}

      {allMarketCorgis.map((corgi, index) => {
        return (
          <div
            className="gallery-card"
            key={index}
            onClick={(e) => {
              e.preventDefault();
              openDetailsCorgi(corgi);
            }}
          >
            <div className="gallery-corgi-market-mask">
              <br />
              <div>MARKET</div>
              <div>
                {corgi.price} <FaEthereum style={{ fontSize: '34px' }} />
              </div>
              <br />
            </div>
            <CorgiCard corgi={corgi} />
          </div>
        );
      })}

      {allDeadCorgis.map((corgi, index) => {
        return (
          <div
            className="gallery-card"
            style={{ pointerEvents: 'none' }}
            key={index}
            onClick={(e) => {
              e.preventDefault();
              openDetailsCorgi(corgi);
            }}
          >
            <div className="gallery-corgi-mask">
              <>DEAD</>
            </div>
            <CorgiCard corgi={corgi} />
          </div>
        );
      })}

      <Dialog open={open} onClose={closeDetailsCorgi}>
        <Details corgi={openCorgi} />
      </Dialog>

      <Snack open={data.errorMsg !== ''} message={data.errorMsg} />
    </div>
  );
}

export default Gallery;
