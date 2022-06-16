import { Button, Dialog } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { reverse } from '../../helper/helper';
import { fetchData } from '../../redux/data/dataActions';
import CorgiCard from '../corgiCard/CorgiCard';
import './Market.css';
import { FaEthereum } from 'react-icons/fa';

function Market() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);

  const [pending, setPending] = useState(false);

  const [open, setOpen] = useState(false);
  const [openCorgi, setOpenCorgi] = useState(undefined);

  useEffect(() => {
    if (blockchain.account !== '' && blockchain.corgiToken !== null) {
      dispatch(fetchData(blockchain.account));
    }
  }, [blockchain.corgiToken, blockchain.account, dispatch]);

  const buyCorgi = () => {
    setPending(true);
    blockchain.corgiToken.methods
      .buy(openCorgi.id)
      .send({
        from: blockchain.account,
        value: blockchain.web3.utils.toWei(openCorgi.price.toString(), 'ether'),
      })
      .once('error', () => {
        setPending(false);
      })
      .then(() => {
        dispatch(fetchData(blockchain.account));
        closeBuyCorgi();
      });
  };

  const openBuyCorgi = (corgi) => {
    setOpen(true);
    setOpenCorgi(corgi);
  };

  const closeBuyCorgi = () => {
    setOpen(false);
    setPending(false);
  };

  let allMarketCorgis = reverse(data.allMarketCorgis.filter((corgi) => !corgi.dead));

  return (
    <div className="market">
      {allMarketCorgis.map((corgi, index) => {
        return (
          <div
            className="gallery-card"
            key={index}
            onClick={(e) => {
              e.preventDefault();
              openBuyCorgi(corgi);
            }}
          >
            {corgi.dead && <div className="gallery-corgi-mask"></div>}
            <CorgiCard corgi={corgi} />
            <div className="market-price-tag">
              Price: {corgi.price} <FaEthereum />
            </div>
          </div>
        );
      })}

      <Dialog open={open} onClose={closeBuyCorgi}>
        <div className="market-form">
          <div className="market-form-shadow">
            <div style={{ marginBottom: '10px', color: 'orange' }}>
              Are you sure you want to buy this corgi?
            </div>
            <div style={{ marginBottom: '10px', color: 'orange' }}>
              Price: {openCorgi?.price} <FaEthereum />
            </div>

            <Button disabled={pending} onClick={buyCorgi}>
              {' '}
              OK{' '}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default Market;
