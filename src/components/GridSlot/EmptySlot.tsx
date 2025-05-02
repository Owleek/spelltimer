import React, { useState, useRef, useEffect, useCallback, useContext } from 'react';
import cn from 'classnames';
import ReactDOM from 'react-dom';
import { IEmptySlot, ISlot } from '../../store/slotSlice';
import {setHotkey} from '../../store/hotkeySlice';
import StageContext, {EStages} from '../../store/StageContext';
import { translate } from '../../utils/utils';
import { useDispatch } from 'react-redux';
import './GridSlot.scss';


interface IProps {
  data: IEmptySlot
  onClick: (slot: ISlot) => void
  className: string
}

const EmptySlot = ({data, onClick, className}: IProps) => {
  const [isBinding, setIsBinding] = useState<boolean>(false);
  const {currentStage, changeStage} = useContext(StageContext);
  const isVoid = currentStage === EStages.PLAY;
  
  const handleClick= (data: IEmptySlot) => {
    if (isVoid) return; // не знаю когда значение может не обновиться из за замыкания
    onClick(data);
  }

  return (
    <div className={cn('EmptySlot', {fixHoverStyles: isBinding}, {void: isVoid}, className)} onClick={() => handleClick(data)}>
      {
        isBinding && ReactDOM.createPortal(<div className="GeneralOverlay"></div>, document.getElementById('root') as HTMLElement)
      }
    </div>
  );
};

export default EmptySlot;