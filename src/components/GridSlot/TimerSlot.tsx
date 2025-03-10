import React, { useState, useRef, useEffect } from 'react';
import './GridSlot.scss';
import { ITimerData } from '../../data/data';

interface IProps {
  data: ITimerData
  handleRemove: (slot: ITimerData) => void
}

const TimerSlot = ({data, handleRemove}: IProps) => {

  return (
    <div className="TimerSlot" style={{backgroundImage: `url("${data.img}")`}}>
      <div className="TimerSlot__RemoveButton" onClick={() => handleRemove(data)}></div>
      <div className="TimerSlot__boundKey">
        <span>{data.boundKey}</span>
      </div>
    </div>
  );
};

export default TimerSlot;