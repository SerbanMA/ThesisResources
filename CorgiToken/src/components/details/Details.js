import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchData } from '../../redux/data/dataActions';
import CorgiCard from '../corgiCard/CorgiCard';
import './Details.css';

import background from '../../image/background.png';
import { Button, Dialog } from '@mui/material';
import Snack from '../../helper/helper';
import { FaPaperPlane } from 'react-icons/fa';
import { RiMoneyDollarCircleFill } from 'react-icons/ri';
import { GrRevert } from 'react-icons/gr';
import { ENDURANCE } from '../../redux/constants';
import { FaEthereum } from 'react-icons/fa';

function Details({ corgi }) {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);

  const [pending, setPending] = useState(false);

  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formName, setFormName] = useState(corgi?.name);
  const [formNameActive, setFormNameActive] = useState(false);
  const [formAddress, setFormAddress] = useState('');
  const [formAddressActive, setFormAddressActive] = useState(false);
  const [formValue, setFormValue] = useState('');
  const [formValueActive, setFormValueActive] = useState(false);

  const levelUp = () => {
    setPending(true);
    blockchain.corgiToken.methods
      .levelUp(corgi.id)
      .send({
        from: blockchain.account,
        value: blockchain.web3.utils.toWei('0.001', 'ether'),
      })
      .once('error', () => {
        setPending(false);
      })
      .then(() => {
        dispatch(fetchData(blockchain.account));
        setPending(false);
      });
  };

  const setName = () => {
    setPending(true);
    if (formName.length > 12 || formName === corgi.name) {
      setFormName(corgi.name);
      setErrorMsg('Same or too long name.');
      return;
    }

    blockchain.corgiToken.methods
      .setName(corgi.id, formName)
      .send({
        from: blockchain.account,
        value: blockchain.web3.utils.toWei('0.005', 'ether'),
      })
      .once('error', () => {
        setPending(false);
      })
      .then(() => {
        dispatch(fetchData(blockchain.account));
        setErrorMsg('');
        setPending(false);
      });
  };

  const feed = () => {
    setPending(true);
    blockchain.corgiToken.methods
      .feed(corgi.id)
      .send({
        from: blockchain.account,
        value: blockchain.web3.utils.toWei('0.001', 'ether'),
      })
      .once('error', () => {
        setPending(false);
      })
      .then(() => {
        dispatch(fetchData(blockchain.account));
        setPending(false);
      });
  };

  const initiateTransfer = () => {
    setFormAddressActive(true);
  };

  const closeTransfer = () => {
    setFormAddressActive(false);
    setErrorMsg('');
    setPending(false);
  };

  const transfer = () => {
    if (blockchain.account === formAddress) {
      setErrorMsg(`Cannot send it to yourself`);
      return;
    }

    setPending(true);
    try {
      blockchain.corgiToken.methods
        .transferTo(corgi.id, formAddress)
        .send({
          from: blockchain.account,
        })
        .once('error', () => {
          setPending(false);
        })
        .then(() => {
          dispatch(fetchData(blockchain.account));
          closeTransfer();
          setSent(true);
          setPending(false);
        });
    } catch (error) {
      setErrorMsg(`Invalid address: '${formAddress}'`);
      setPending(false);
    }
  };

  const initiateSell = () => {
    setFormValueActive(true);
  };

  const closeSell = () => {
    setFormValueActive(false);
    setErrorMsg('');
    setPending(false);
  };

  const sell = () => {
    var price = parseInt(parseFloat(formValue) * 100);
    if (price === 0) {
      setErrorMsg(`Invalid value: '${formValue}'`);
      return;
    }

    setPending(true);
    blockchain.corgiToken.methods
      .sell(corgi.id, price)
      .send({
        from: blockchain.account,
      })
      .once('error', () => {
        setPending(false);
      })
      .then(() => {
        dispatch(fetchData(blockchain.account));
        closeTransfer();
        setSent(true);
        setPending(false);
      });
  };

  const buyBack = () => {
    setPending(true);
    blockchain.corgiToken.methods
      .cancelOnMarket(corgi.id)
      .send({
        from: blockchain.account,
      })
      .once('error', () => {
        setPending(false);
      })
      .then(() => {
        dispatch(fetchData(blockchain.account));
        setPending(false);
      });
  };

  return (
    <>
      {!sent ? (
        <div className="details" style={{ backgroundImage: `url(${background})` }}>
          <div className="details-shadow">
            <div style={{ margin: '25px' }}>
              <CorgiCard corgi={corgi} />
            </div>
            <div className="details-atributes">
              {corgi.onMarket ? (
                <>
                  <div className="details-atribute">Name: {corgi.name}</div>
                </>
              ) : (
                <>
                  {formNameActive ? (
                    <div className="details-atribute">
                      Name:{' '}
                      <input
                        type="text"
                        autoComplete="off"
                        value={formName}
                        onChange={(e) => {
                          setFormName(e.target.value);
                        }}
                      />
                      <div
                        className="details-edit-action"
                        onClick={() => {
                          setFormNameActive(false);
                          setName();
                        }}
                      >
                        ✔️
                      </div>
                      <div
                        className="details-edit-action"
                        onClick={() => {
                          setFormNameActive(false);
                          setFormName(corgi?.name);
                        }}
                      >
                        ❌
                      </div>
                    </div>
                  ) : (
                    <div className="details-atribute">
                      Name: {corgi?.name}{' '}
                      <div
                        className="details-edit-action"
                        onClick={() => {
                          if (!pending) {
                            setFormNameActive(true);
                          }
                        }}
                      >
                        ✏️
                      </div>
                    </div>
                  )}
                </>
              )}
              <div className="details-atribute">Id: {corgi?.id}</div>
              <div className="details-atribute">Rarity: {corgi?.rarity}</div>
              <div className="details-atribute">
                Damage: {corgi?.damage} + {corgi?.level} ={' '}
                {parseInt(corgi?.damage) + parseInt(corgi?.level)}
              </div>
              <div className="details-atribute">
                Health: {corgi?.health} + {corgi?.level} ={' '}
                {parseInt(corgi?.health) + parseInt(corgi?.level)}
              </div>

              <br />

              <div className="details-atribute">
                Die on :{' '}
                {new Date(corgi?.lastMeal + ENDURANCE).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  second: 'numeric',
                })}
              </div>

              <br />

              <div className="details-actions">
                {!corgi.onMarket ? (
                  <>
                    <Button disabled={pending} onClick={levelUp}>
                      LEVEL UP
                    </Button>
                    <Button disabled={pending} onClick={feed}>
                      FEED
                    </Button>
                    <Button
                      className="details-power-button"
                      disabled={pending}
                      onClick={initiateTransfer}
                    >
                      <FaPaperPlane style={{ fontSize: '20px' }} />
                    </Button>
                    <Button
                      className="details-power-button"
                      disabled={pending}
                      onClick={initiateSell}
                    >
                      <RiMoneyDollarCircleFill style={{ fontSize: '28px' }} />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button disabled={pending} onClick={levelUp}>
                      LEVEL UP
                    </Button>
                    <Button disabled={pending} onClick={feed}>
                      FEED
                    </Button>
                    <Button
                      className="details-power-button"
                      disabled={pending}
                      style={{ width: '135px' }}
                      onClick={() => {}}
                    >
                      <div style={{ marginRight: '10px' }} onClick={buyBack}>
                        BUYBACK
                      </div>{' '}
                      <GrRevert />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          <Dialog
            style={{ backgroundColor: 'rgba(0, 0, 0, 0) !important' }}
            open={formAddressActive}
            onClose={closeTransfer}
          >
            <div className="details-form">
              <div className="details-form-shadow">
                <div style={{ marginBottom: '10px', color: 'orange' }}>Address</div>
                <div
                  style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
                >
                  <input
                    className="input-confirmation"
                    style={{ width: '250px' }}
                    type="text"
                    autoComplete="off"
                    value={formAddress}
                    onChange={(e) => {
                      setFormAddress(e.target.value);
                    }}
                  />
                </div>
                <Button disabled={pending} onClick={transfer}>
                  {' '}
                  OK{' '}
                </Button>
              </div>
            </div>
          </Dialog>

          <Dialog open={formValueActive} onClose={closeSell}>
            <div className="details-form">
              <div className="details-form-shadow">
                <div style={{ marginBottom: '10px', color: 'orange' }}>
                  {'Value >= 0.01'} <FaEthereum />{' '}
                </div>
                <div
                  style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
                >
                  <input
                    className="input-confirmation"
                    style={{ width: '250px' }}
                    type="text"
                    autoComplete="off"
                    value={formValue}
                    onChange={(e) => {
                      setFormValue(e.target.value);
                    }}
                  />
                </div>
                <Button disabled={pending} onClick={sell}>
                  {' '}
                  PLACE ON MARKET{' '}
                </Button>
              </div>
            </div>
          </Dialog>

          <Snack open={errorMsg !== ''} message={errorMsg} />
        </div>
      ) : (
        <div className="details-send-confirmation">
          <div className="details-form-shadow">👍</div>
        </div>
      )}
    </>
  );
}

export default Details;
