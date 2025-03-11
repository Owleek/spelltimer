import React, { useState, useRef, useEffect } from 'react';
import './GridSlot.scss';
import { ITimerData } from '../../data/data';
import fetchData from '../../data/data';

interface IProps {
  data: ITimerData
  handleRemove: (slot: ITimerData) => void
}

const TunedSlot = ({data, handleRemove}: IProps) => {
  const{ heroes } = fetchData;
  const currentHero = data.owner ? heroes.find(hero => hero.name === data.owner) : null;
  

  return (
    <div className="TunedSlot" style={{backgroundImage: `url("${data.img}")`}}>
      { data.owner && <div className="TunedSlot__ownerBox"><img src={currentHero?.img}/></div> }
      <div className="TunedSlot__ownerBox">
      </div>
      <div className="TunedSlot__RemoveButton" onClick={() => handleRemove(data)}></div>
      <div className="TunedSlot__boundKey">
        <span>{data.boundKey}</span>
      </div>
    </div>
  );
};

export default TunedSlot;