import React, { useState, useRef, useEffect, useCallback, useContext, MouseEventHandler } from 'react';
import cn from 'classnames';
import { IEmptySlot, ISlot } from '../../store/slotSlice';
import StageContext, {EStages} from '../../store/StageContext';
import './GridSlot.scss';


interface IProps {
  data: IEmptySlot
  onClick: (slot: ISlot) => void
  className?: string
  animate: boolean
}

const EmptySlot = ({data, onClick, className, animate}: IProps) => {
  const {currentStage, changeStage} = useContext(StageContext);
  const isVoid = currentStage === EStages.PLAY;

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

  const handleClick= (data: IEmptySlot, event: any) => {
    if (isVoid) return;
    onClick(data);
    setTimeout(() => handleMouseEnter(event), 0);  // hack для того чтобы обойти handleMouseLeave
  }

  return (
    <div className={cn('EmptySlot', {void: isVoid}, className)} onClick={(event) => handleClick(data, event)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {
          isVoid && 
          <div className="EmptySlot__placeholder">
            {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 114 123">
              <path d="M78.7601 5.5C78.7601 2.73858 76.5215 0.5 73.7601 0.5H38.7601C35.9986 0.5 33.7601 2.73857 33.7601 5.5V13.3307C16.4303 20.9821 3.63097 37.0151 0.5 56.2918C-0.134964 60.2011 3.07948 63.5 7.04004 63.5H11.1551C14.8839 63.5 17.8912 60.5495 18.7088 56.9115C22.5505 39.8174 37.6162 26.9692 55.7601 26.5126V65.5L85.8623 91.4632C78.7202 99.4633 68.3283 104.5 56.7601 104.5C51.6518 104.5 46.7601 108.209 46.7601 113.318V121.626C50.0068 122.2 53.3484 122.5 56.7601 122.5C88.2403 122.5 113.76 96.9802 113.76 65.5C113.76 41.818 99.3177 21.5091 78.7601 12.9007V5.5Z" fill="#9FC87E"/>
            </svg> */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 31 31">
              <path d="M30.2 3.6V2.2C30.2 1.8136 29.8871 1.5 29.5 1.5H26.7C26.4228 1.5 26.2002 1.5182 26 1.57V1.5C26 1.1136 25.6871 0.8 25.3 0.8H21.1C19.8862 0.8 19.4473 1.4888 19.1897 2.2H18.6213C18.4582 1.9823 18.3 1.7002 18.3 1.5C18.3 1.1136 17.9871 0.8 17.6 0.8H12.7C12.3423 0.8 12.042 1.0751 12.0035 1.43C11.9874 1.577 11.6899 2.2 11.2272 2.2H9.3092C9.2637 2.1461 9.1979 2.046 9.1412 1.9179C9.0292 1.6638 8.7772 1.5 8.5 1.5H1.5C1.1129 1.5 0.800003 1.8136 0.800003 2.2V7.8C0.800003 9.7761 1.3775 12.2779 1.4993 12.7826L1.4937 13.8431L1.0191 14.2918C0.879103 14.4234 0.800003 14.6075 0.800003 14.8V17.6C0.800003 17.7862 0.873503 17.964 1.0051 18.0949L1.5 18.5898V21.6866L0.836403 23.6788C0.793703 23.8055 0.788803 23.9406 0.821703 24.0701L1.472 26.6727L0.837103 28.5795C0.765003 28.793 0.801403 29.0282 0.933003 29.2102C1.0639 29.3922 1.2753 29.5 1.5 29.5H11.3C11.4862 29.5 11.664 29.4265 11.7949 29.2949L11.8579 29.2319C12.2296 29.7401 12.7469 30.2 13.4 30.2H15.5C16.0152 30.2 16.466 29.9753 16.8629 29.7765C17.1345 29.64 17.4152 29.5 17.6 29.5H21.1C21.2862 29.5 21.464 29.4265 21.5949 29.2949L21.765 29.1248C21.8091 29.1808 21.8511 29.2361 21.8924 29.2893C22.2361 29.7373 22.591 30.2 23.2 30.2H26.7C27.0871 30.2 27.4 29.8871 27.4 29.5V28.9967L29.3306 29.4783C29.5399 29.5322 29.7618 29.4832 29.9326 29.3495C30.1027 29.2165 30.2014 29.0114 30.2 28.7944C30.1993 28.7258 30.1559 21.8574 30.2 18.3084C30.2021 18.1194 30.1279 17.9381 29.9949 17.8044L29.5 17.3102V14.1C29.5 13.9145 29.4265 13.736 29.2949 13.6051L28.9519 13.2621L29.3754 12.4151L29.9949 11.7956C30.1265 11.664 30.2 11.4855 30.2 11.3L30.1895 7.793C30.1895 7.7363 30.1825 7.6803 30.1692 7.625L29.542 5.0826L30.1265 3.9136C30.1748 3.8163 30.2 3.7085 30.2 3.6ZM21.8623 6.4L23.9931 7.8L23.2826 12L17.6 7.8L21.8623 6.4ZM8.5 24.6L5.7 22.5L7.1 17.6L12.7 23.2L8.5 24.6ZM23.34 23.9H20.0731L5.7 7.0482L8.3131 6.4L25.3 19.3626L23.34 23.9Z" />
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