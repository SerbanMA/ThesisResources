import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './Team.css';

import CorgiCard from '../../components/corgiCard/CorgiCard';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { fetchData, removeSelectedCorgi } from '../../redux/data/dataActions';

import { AiFillPlayCircle } from 'react-icons/ai';
import { GiPointySword, GiBorderedShield, GiStaryu } from 'react-icons/gi';
import { FaEthereum } from 'react-icons/fa';

import { Dialog, Fab } from '@mui/material';
import { shuffleArray, sleep } from '../battle/fight/Fight';

function Team() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);

  const [open, setOpen] = useState(false);
  const plusRank = 5;
  const minusRank = -2;

  const play = [<AiFillPlayCircle />, 'play'];
  const sword = [<GiPointySword />, 'sword'];
  const shield = [<GiBorderedShield />, 'shield'];
  const star = [<GiStaryu style={{ color: 'orange' }} />, 'star'];
  const level = [<div style={{ color: 'orange' }}>lvl</div>, 'level'];

  let abilities = [sword, shield, star, level];

  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [selected, setSelected] = useState(play);
  const [matchWin, setMatchWin] = useState(undefined);

  const openFightCorgi = () => {
    setOpen(true);
  };

  const closeFightCorgi = () => {
    setOpen(false);
    setStarted(false);
    setEnded(false);
    setSelected(play);
    setMatchWin(undefined);
  };

  function unselectCorgi(corgiId) {
    if (data.selectedCorgis.length <= 3) {
      dispatch(removeSelectedCorgi(corgiId));
    }
  }

  const isWin = (winner) => {
    if (winner[1] === sword[1]) {
      setMatchWin(true);
      return true;
    } else if (winner[1] === shield[1]) {
      setMatchWin(true);
      return true;
    } else if (winner[1] === star[1]) {
      setMatchWin(false);
      return false;
    } else if (winner[1] === level[1]) {
      setMatchWin(false);
      return false;
    }

    return false;
  };

  const fight = () => {
    if (started) return;
    setStarted(true);

    shuffleArray(abilities);
    let winner = abilities[0];

    increaseRank(isWin(winner) ? plusRank : minusRank, winner);
  };

  const increaseRank = (rank, winner) => {
    blockchain.corgiToken.methods
      .setRank(blockchain.account, rank)
      .send({
        from: blockchain.account,
        value: blockchain.web3.utils.toWei(
          0.005 * (1 + parseInt(data.rank / 100)) + '',
          'ether'
        ),
      })
      .once('error', () => {
        setStarted(false);
      })
      .then(() => {
        dispatch(fetchData(blockchain.account));
        startRumble(winner);
      });
  };

  const startRumble = (winner) => {
    setSelected('');
    sleep(500);

    for (let i = 1; i <= 4; i += 1) {
      setTimeout(() => {
        shuffleArray(abilities);
        setSelected(abilities[0]);
      }, 500 * i);
    }
    setTimeout(() => {
      setSelected(winner);
    }, 500 * 5);
    setTimeout(() => {
      setEnded(true);
    }, 500 * 5 + 2000);

    sleep(300);

    for (let i = 1; i <= 4; i += 1) {
      setTimeout(() => {
        shuffleArray(abilities);
        setSelected(['']);
      }, 500 * i);
    }
  };

  return (
    <div className="team">
      <div className="team-selection">
        {data.selectedCorgis.map((corgi, index) => {
          return (
            <div
              className="team-card"
              key={index}
              onClick={(e) => {
                e.preventDefault();
                unselectCorgi(corgi.id);
              }}
            >
              <CorgiCard corgi={corgi} />
            </div>
          );
        })}
      </div>

      <Fab
        disabled={data.selectedCorgis.length < 3}
        variant="extended"
        className="team-fight"
        onClick={(e) => {
          e.preventDefault();
          openFightCorgi();
        }}
      >
        {data.selectedCorgis.length === 3 && (
          <>
            <PlayArrowIcon /> FIGHT
          </>
        )}
        {data.selectedCorgis.length < 3 && (
          <>
            <ArrowDropDownIcon />
            SELECT CORGIS
            <ArrowDropDownIcon />
          </>
        )}
      </Fab>

      <Dialog
        fullWidth={true}
        maxWidth={'lg'}
        open={open}
        onClose={() => {
          if (ended || !started) closeFightCorgi();
        }}
      >
        <div className="fight">
          <div className="fight-buttons">
            <div className="fight-team">
              <div className="fight-team">
                {data.selectedCorgis.map((corgi, index) => {
                  return (
                    <div className="fight-battle-card" key={index}>
                      <CorgiCard corgi={corgi} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="fight-results">
            <div
              onClick={fight}
              className="fight-random-ability"
              style={{ cursor: started ? 'default' : 'pinter' }}
            >
              {selected[0]}
            </div>
            <div>
              {ended && (
                <>
                  {matchWin ? (
                    <div className="fight-results-text">
                      <div>
                        You won {0.005 * (1 + parseInt((data.rank - plusRank) / 100)) * 2}{' '}
                        <FaEthereum /> {' - fees'}
                      </div>
                      <div>And {plusRank} points</div>
                    </div>
                  ) : (
                    <div className="fight-results-text">
                      <div>
                        You lost {0.005 * (1 + parseInt((data.rank - minusRank) / 100))}{' '}
                        <FaEthereum /> {' + fees'}
                      </div>
                      <div>And {-minusRank} points</div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default Team;
