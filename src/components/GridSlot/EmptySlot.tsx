import React, { useState, useRef, useEffect, useCallback } from 'react';
import cn from 'classnames';
import ReactDOM from 'react-dom';
import { IEmptySlot, ISlot } from '../../store/slotSlice';
import {setHotkey} from '../../store/hotkeySlice';
import './GridSlot.scss';
import { translate } from '../../utils/utils';
import { useDispatch } from 'react-redux';

interface IProps {
  data: IEmptySlot
  onClick: (slot: ISlot) => void
}

const EmptySlot = ({data, onClick}: IProps) => {
  const [isBinding, setIsBinding] = useState<boolean>(false);
  const dispatch = useDispatch();

  const getKey = useCallback((event: KeyboardEvent) => {
    const keyIs = event.key.toUpperCase();
    setIsBinding(false);
    document.removeEventListener('keydown', getKey);
    dispatch(setHotkey({key: keyIs, id: data.position, type: 'slot'}));
  }, []);
  
  const handleClickBoundKey = () => {
    setIsBinding(true);
    document.addEventListener('keydown', getKey);
  }

  return (
    <div className={cn('EmptySlot', {fixHoverStyles: isBinding})}>
      {
        isBinding && ReactDOM.createPortal(<div className="GeneralOverlay"></div>, document.getElementById('root') as HTMLElement)
      }

      <div className="EmptySlot__inner" onClick={() => onClick(data)}></div>
      <div className={cn('EmptySlot__boundKey', {onTopOfTheSky: isBinding})} onClick={!isBinding ? handleClickBoundKey : () => null}>
        {
          isBinding ? <span className='EmptySlot__boundKeyInfo'>{translate('Press any key to bind')}</span> :
                        <span className='EmptySlot__boundKeyText'>{data.boundKey}</span>
        }
        
      </div>
    </div>
  );
};

export default EmptySlot;