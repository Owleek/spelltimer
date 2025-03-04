import React, { useState, useRef, useEffect } from 'react';
import { IEmptySlot, ISlot } from '../../store/slotSlice';
import './TimerSlot.scss';

interface IProps {
  data: IEmptySlot
  onClick: (slot: ISlot) => void
}

const EmptySlot = ({data, onClick}: IProps) => {

  return (
    <div className="EmptySlot" onClick={() => onClick(data)}>

    </div>
  );
};

export default EmptySlot;