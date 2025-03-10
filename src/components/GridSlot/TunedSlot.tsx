import React, { useState, useRef, useEffect } from 'react';
import './GridSlot.scss';
import { ITimerData } from '../../data/data';

interface IProps {
  data: ITimerData
  handleRemove: (slot: ITimerData) => void
}

const TunedSlot = ({data, handleRemove}: IProps) => {

  return (
    <div className="TunedSlot" style={{backgroundImage: `url("${data.img}")`}}>
      <div className="TunedSlot__RemoveButton" onClick={() => handleRemove(data)}></div>
      <div className="TunedSlot__boundKey">
        <span>{data.boundKey}</span>
      </div>
    </div>
  );
};

export default TunedSlot;