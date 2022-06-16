import React from 'react';
import './CorgiCard.css';

import { parts } from '../../image/parts';
import { GiBorderedShield, GiPointySword } from 'react-icons/gi';

function CorgiCard({ corgi = null }) {
  if (!corgi) {
    return null;
  }

  let dnaString = String(corgi.dna);

  while (dnaString.length < 5) {
    dnaString = '0' + dnaString;
  }

  let corgiRarity = 0;
  if (corgi.rarity > 7) corgiRarity = 1;
  if (corgi.rarity > 12) corgiRarity = 2;

  let corgiDetails = {
    name: corgi.name,
    body: 0,
    earing: dnaString[0],
    background: dnaString[1],
    elemental: dnaString[2],
    rarity: corgiRarity,

    weapon: dnaString[3],
    damage: corgi.damage,
    armor: dnaString[4],
    health: corgi.health,
  };

  return (
    <div
      className="corgi-card"
      style={{ backgroundColor: parts.color[corgiDetails.elemental] }}
    >
      <div className="corgi-card-header">
        <div className="corgi-card-name">- {corgi.name} -</div>
      </div>

      <div className="corgi-card-image">
        <img
          className="corgi-card-corgi-style"
          alt={'background'}
          src={parts.background[corgiDetails.background]}
        />
        <img
          className="corgi-card-corgi-style"
          alt={'elemental'}
          src={parts.elemental[corgiDetails.elemental]}
        />
        <img
          className="corgi-card-corgi-style"
          alt={'rarity'}
          src={parts.rarity[corgiDetails.rarity]}
        />
        <img
          className="corgi-card-corgi-style"
          alt={'weapon'}
          src={parts.weapon[corgiDetails.weapon]}
        />
        <img
          className="corgi-card-corgi-style"
          alt={'body'}
          src={parts.body[corgiDetails.body]}
        />
        <img
          className="corgi-card-corgi-style"
          alt={'earing'}
          src={parts.earing[corgiDetails.earing]}
        />
        <img
          className="corgi-card-corgi-style"
          alt={'armor'}
          src={parts.armor[corgiDetails.armor]}
        />
      </div>

      <div className="corgi-card-footer" color={parts.color[corgiDetails.elemental]}>
        <div className="corgi-card-description">
          <div className="corgi-card-ability corgi-card-damage">
            <GiPointySword style={{ fontSize: '20px' }} />
            {parseInt(corgi.damage) + parseInt(corgi.level)}
          </div>
          <div className="corgi-card-ability corgi-card-health">
            {parseInt(corgi.health) + parseInt(corgi.level)}
            <GiBorderedShield style={{ fontSize: '20px' }} />
          </div>
        </div>

        <div className="corgi-card-level">- {corgi.level} -</div>
      </div>
    </div>
  );
}

export default CorgiCard;
