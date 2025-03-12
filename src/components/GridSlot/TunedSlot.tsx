import React, { useState, useRef, useEffect } from 'react';
import './GridSlot.scss';
import { ITimerData, EAbility } from '../../data/data';
import fetchData from '../../data/data';

interface IProps {
  data: ITimerData
  handleRemove: (slot: ITimerData) => void
}

const TunedSlot = ({data, handleRemove}: IProps) => {
  const{ heroes } = fetchData;
  const currentHero = data.owner && data.type === EAbility.ARTIFACTS ? heroes.find(hero => hero.name === data.owner) : null;
  
  return (
    <div className="TunedSlot" style={{backgroundImage: `url("${data.img}")`}}>
      { 
        currentHero && 
          <div className="TunedSlot__ownerBox">
              <img className="TunedSlot__ownerImg" src={currentHero.img}/>
              <span className="TunedSlot__ownerName">{currentHero.name}</span>
          </div> 
      }
      <div className="TunedSlot__RemoveButton" onClick={() => handleRemove(data)}></div>
    </div>
  );
};

export default TunedSlot;