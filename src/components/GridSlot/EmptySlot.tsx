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
          isVoid && 
          <div className="EmptySlot__placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 114 123">
              <path d="M78.7601 5.5C78.7601 2.73858 76.5215 0.5 73.7601 0.5H38.7601C35.9986 0.5 33.7601 2.73857 33.7601 5.5V13.3307C16.4303 20.9821 3.63097 37.0151 0.5 56.2918C-0.134964 60.2011 3.07948 63.5 7.04004 63.5H11.1551C14.8839 63.5 17.8912 60.5495 18.7088 56.9115C22.5505 39.8174 37.6162 26.9692 55.7601 26.5126V65.5L85.8623 91.4632C78.7202 99.4633 68.3283 104.5 56.7601 104.5C51.6518 104.5 46.7601 108.209 46.7601 113.318V121.626C50.0068 122.2 53.3484 122.5 56.7601 122.5C88.2403 122.5 113.76 96.9802 113.76 65.5C113.76 41.818 99.3177 21.5091 78.7601 12.9007V5.5Z" fill="#9FC87E"/>
            </svg>
          </div>
        }

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