import React, { useContext } from 'react';
import { IEmptySlot, ISlot } from '../../store/slotSlice';
import StageContext, {EStages} from '../../store/StageContext';
import {useSelector} from 'react-redux';
import {TStoreState} from '../../store/store';
import { translateText } from '../../utils/utils';
import cn from 'classnames';
import './GridSlot.scss';
import SpriteIcon from '@shared/ui/SpriteIcon';

interface IProps {
  data: IEmptySlot
  onClick: (slot: ISlot) => void
  className?: string
  animate: boolean
}

const EmptySlot = ({data, onClick, className, animate}: IProps) => {
  const {currentStage, changeStage} = useContext(StageContext);
  const isVoid = currentStage === EStages.PLAY;

  const {dictionary} = useSelector((state: TStoreState) => state.localeSlice);


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
    <div className={cn('EmptySlot', {void: isVoid}, className)} onClick={(event) => handleClick(data, event)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} title={translateText(dictionary, 'add_tracked_item')}>
        {
          isVoid && 
          <div className="EmptySlot__placeholder">
            <SpriteIcon id="components-gridslot-emptyslot-1" />
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