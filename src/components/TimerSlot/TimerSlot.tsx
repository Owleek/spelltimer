import React, { useState, useRef, useEffect } from 'react';
import './TimerSlot.scss';
import { ITimerData } from '../../data/data';

interface IProps {
  data: ITimerData
  handleRemove: (slot: ITimerData) => void
}

const TimerSlot = ({data, handleRemove}: IProps) => {

  return (
    <div className="TimerSlot" style={{backgroundImage: `url("${data.img}")`}}>
      <div className="TimerSlot__RemoveButton" onClick={() => handleRemove(data)}></div>
    </div>
  );
};

export default TimerSlot;