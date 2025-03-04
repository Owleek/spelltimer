// 1. Внешние зависимости.
// 2. Компоненты вашего проекта.
// 3. Утилиты и бизнес-логика.
// 4. Стили и ассеты.
import React, { JSX, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import EmptySlot from '../TimerSlot/EmptySlot';
import TimerSlot from '../TimerSlot/TimerSlot';

import DumbTimer from '../Timer/DumbTimer';
import ConstructorComponent from '../ConstructorComponent/ConstructorComponent';
import MainTime from '../MainTime/MainTime';
import TimerController from '../Timer/TimerController';

import cn from 'classnames';
import { TStoreState } from '../../store/store';
import { IEmptySlot,  ISlot,  mapTimerToSlot, removeTimerFromSlot } from '../../store/slotSlice';
import { ITimerData } from '../../data/data';
import TickNotifier, {COUNT_OF_BLINKS_EQUIVALENT_TO_ONE_SECOND} from '../../utils/TickNotifier';
import cachekeys from '../../user_cache/keys';
import {makeSnakeCase} from '../../utils/utils';
import './Playground.scss';


const Playground = () => {
  const dispatch = useDispatch();
  const slotList = useSelector((state: TStoreState) => state.slotList);
  const [currentSlot, setCurrnetSlot] = useState<ISlot | null>(null);

  const handleClickEmptySlot = (slot: ISlot) => { setCurrnetSlot(slot) }

  const onSelectAbility = (ability: ITimerData) => {
    if(!currentSlot) return;

    const updData = {
      ...ability,
      position: currentSlot.position
    
    }

    setCurrnetSlot(null);
    dispatch(mapTimerToSlot(updData));
  }

  const onConstructorCancel = () => { setCurrnetSlot(null) }
  const removeAbility = (slot: ITimerData) => dispatch(removeTimerFromSlot(slot));

  const renderSlot = (slot: ISlot) => {
    if (!('name' in slot)) {
      return <EmptySlot key={slot.position} data={slot} onClick={handleClickEmptySlot}/>
    }

    return <TimerSlot key={slot.id} data={slot} handleRemove={removeAbility}/>
  }


  return (
    <div className="Playground" style={{backgroundImage: `url("/assets/other/${makeSnakeCase('Playground')}.jpg")`}}>
      {currentSlot && <ConstructorComponent currentSlot={currentSlot} onSelectAbility={onSelectAbility} onCancel={onConstructorCancel}/> }

      <div className="Playground__time">
          <MainTime isRun={false} minutes={'00'} seconds={'00'} onClickSettings={() => null} onClickTrigger={() => null}/>
      </div>
      <div className="Playground__grid">
        { slotList.map(renderSlot) }
      </div>
    </div>
  )

  // const [isRuns, setIsRuns] = useState<boolean>(false);
  // const [minutes, setMinutes] = useState<string>('00');
  // const [secons, setSeconds] = useState<string>('00');

  // const countMSRef = useRef<number>(0);
  // const isRunsRef = useRef<boolean>(false);
  // const secondsRef = useRef<number>(0);

  // useEffect(() => {
  //   const alreadyUsed = localStorage.getItem(`${cachekeys.alreadyUsed}`);
  //   if (!alreadyUsed) localStorage.setItem(`${cachekeys.alreadyUsed}`, 'true');

  //   const instance = TickNotifier.getInstance();
  //   instance.subscribe(onTickNotify);
  //   return () => instance.unsubscribe(onTickNotify);
  // }, []);

  // const onTickNotify = (): void => { 
  //   if (!isRunsRef.current) return;
  //   if (countMSRef.current < COUNT_OF_BLINKS_EQUIVALENT_TO_ONE_SECOND) {
  //     countMSRef.current += 1;
  //     return;
  //   }

  //   countMSRef.current = 0;
  //   secondsRef.current += 1;
  //   setTime(secondsRef.current);
  // };

  // const setTime = (seconds: number) => {
  //   const min = Math.floor(seconds / 60);
  //   const sec = seconds - (min * 60);

  //   const stringMin = min < 10 ? '0' + min : min + '';
  //   const stringSec = sec < 10 ? '0' + sec : sec + '';

  //   setMinutes(stringMin);
  //   setSeconds(stringSec);
  // }

  // const setIsRunMain = ():void => {
  //   isRunsRef.current = !isRunsRef.current;
  //   setIsRuns(isRunsRef.current);
  // }

  // const handleClickControl = () => setIsRunMain();
}

export default Playground;