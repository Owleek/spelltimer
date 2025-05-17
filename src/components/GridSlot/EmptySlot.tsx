import React, { useState, useRef, useEffect, useCallback, useContext, MouseEventHandler } from 'react';
import cn from 'classnames';
import { IEmptySlot, ISlot } from '../../store/slotSlice';
import StageContext, {EStages} from '../../store/StageContext';
import './GridSlot.scss';


interface IProps {
  data: IEmptySlot
  onClick: (slot: ISlot) => void
  className: string
  animate: boolean
}

const EmptySlot = ({data, onClick, className, animate}: IProps) => {
  const {currentStage, changeStage} = useContext(StageContext);
  const isVoid = currentStage === EStages.PLAY;
  
  const handleClick= (data: IEmptySlot) => {
    if (!isVoid) onClick(data);
  }

  const handleMouseEnter = (e: any) => {
    const parent = e.target.closest('#parentIdforFreezeAnimation');
    if (!parent) return;
    if (parent.classList.contains('stopAnimation')) return;
    parent.classList.add('stopAnimation');
  }

  const handleMouseLeave = (e: any) => {
    const parent = e.target.closest('#parentIdforFreezeAnimation');
    if (!parent) return;
    parent.classList.remove('stopAnimation');
  }

  return (
    <div className={cn('EmptySlot', {void: isVoid}, className)} onClick={() => handleClick(data)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {
          currentStage !== EStages.PLAY &&
          <React.Fragment>
              <span className={cn('EmptySlot__bar vertical', {animate})}></span>
              <span className={cn('EmptySlot__bar horizontal', {animate})}></span>
          </React.Fragment>
        }
    </div>
  );
};

export default EmptySlot;