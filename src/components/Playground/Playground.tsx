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
          <div className="Controller">
              {
                /* <div className="Controller__time">
                  <div><span>{minutes}</span> : <span>{secons}</span></div>
                </div>
                <div className="Controller__tool" onClick={handleClickControl}>
                  {
                    isRuns ? 
                            <div className="pause">
                              <span className="pause__stick"></span>
                              <span className="pause__stick"></span>
                            </div>
                          : 
                            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http:www.w3.org/2000/svg">
                              <path fillRule="evenodd" clipRule="evenodd" d="M4 4.11493C4 1.61163 6.88508 0.209383 8.85346 1.75597L18.8535 9.61312C19.5773 10.1819 20 11.0515 20 11.9721V12.0279C20 12.9485 19.5773 13.8181 18.8535 14.3869L8.85346 22.244C6.88507 23.7906 4 22.3884 4 19.8851V4.11493ZM7.61782 3.32861C6.96169 2.81308 6 3.2805 6 4.11493V19.8851C6 20.7195 6.96169 21.1869 7.61782 20.6714L17.6178 12.8142C17.8591 12.6247 18 12.3348 18 12.0279V11.9721C18 11.6652 17.8591 11.3753 17.6178 11.1858L7.61782 3.32861Z"/>
                            </svg>
                  }
                </div> */
              }
          </div>
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