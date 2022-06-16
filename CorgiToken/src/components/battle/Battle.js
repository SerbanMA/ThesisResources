import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './Battle.css';

import CorgiCard from '../../components/corgiCard/CorgiCard';
import Team from '../team/Team';

import { addSelectedCorgi, fetchData } from '../../redux/data/dataActions';
import Snack, { reverse } from '../../helper/helper.js';

function Battle() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);

  useEffect(() => {
    if (blockchain.account !== '' && blockchain.corgiToken !== null) {
      dispatch(fetchData(blockchain.account));
    }
  }, [blockchain.corgiToken, blockchain.account, dispatch]);

  function selectCorgi(corgi) {
    if (data.selectedCorgis.length < 3) {
      if (data.selectedCorgis.filter((item) => item.id === corgi.id).length === 0) {
        dispatch(addSelectedCorgi(corgi));
      }
    }
  }

  let allValidCorgis = reverse(
    data.allOwnerCorgis.filter(
      (corgi) =>
        !corgi.dead &&
        !corgi.onMarket &&
        data.selectedCorgis.filter((selectedCorgi) => selectedCorgi.id === corgi.id)
          .length === 0
    )
  );

  return (
    <div className="battle">
      <Team />
      <div className="battle-gallery">
        {allValidCorgis.map((corgi, index) => {
          return (
            <div
              className="battle-card"
              key={index}
              onClick={(e) => {
                e.preventDefault();
                selectCorgi(corgi);
              }}
            >
              <CorgiCard corgi={corgi} />
            </div>
          );
        })}
      </div>

      <Snack open={data.errorMsg !== ''} message={data.errorMsg} />
    </div>
  );
}

export default Battle;
