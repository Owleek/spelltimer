import React, { useState, useRef, useEffect } from 'react';
import cn from 'classnames';
import './GridSlot.scss';
import { ITimerData, EAbility } from '../../data/data';
import fetchData from '../../data/data';

interface IProps {
  data: ITimerData
  className: string
}

const TunedSlot = ({data, className}: IProps) => {
  const{ heroes } = fetchData;
  const currentHero = data.owner ? heroes.find(hero => hero.name === data.owner) : null;
  
  return (
    <div className={cn('TunedSlot', className)} style={{backgroundImage: `url("${data.img}")`}}>
        { 
          currentHero && 
            <div className="TunedSlot__ownerBox">
                <img className="TunedSlot__ownerImg" src={currentHero.img}/>
                <span className="TunedSlot__ownerName">{currentHero.name}</span>
            </div> 
        }
    </div>
  );
};

export default TunedSlot;