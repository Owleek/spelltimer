// 1. Внешние зависимости.
// 2. Компоненты вашего проекта.
// 3. Утилиты и бизнес-логика.
// 4. Стили и ассеты.
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import cn from 'classnames';
import Constructor from './Constructor';
import { TStoreState } from '../../store/store';
import { ISlot, mapAbilityToSlot, removeAbilityFromSlot } from '../../store/slotsSlice';
import { IAbility } from '../../data/fillData';
import './activity.scss';
import Timer from '../../components/Timer/Timer';
import TickNotifier from '../../utils/TickNotifier';

const Activity = () => {
  const dispatch = useDispatch();
  const slots = useSelector((state: TStoreState) => state.slots);
  const [editableSlot, setEditableSlot] = useState<ISlot | null>(null);
  const [editMode, setEditMode] = useState<boolean>(true);
  const [isGeneralRuns, setIsGeneralRuns] = useState<boolean>(false);
  const [isRun, setIsRun] = useState<boolean>(true);
  let countOfNotife = 0;
  const [counter, setCounter] = useState<number>(120);  

  useEffect(() => {
    const instance = TickNotifier.getInstance();
    instance.subscribeUpdatesAndNotife(onTickNotifierUpdate);

    return () => {
      instance.unsubscribe(onTickNotifierUpdate);
    }
  }, []);

  const onTickNotifierUpdate = () => {
    if (countOfNotife < 40) {
      return countOfNotife++;
    }

    debugger;

    countOfNotife = 0;
    if (counter === 0 || !isRun) return;
    setCounter(counter - 1);
  }
  
  const onSelectAbility = (ability: IAbility) => {
    if (!editableSlot) return;
    
    const data = {
      position: editableSlot.position,
      ability: {...ability}
    };

    setEditableSlot(null);
    dispatch(mapAbilityToSlot(data));
  }

  const removeAbility = (slot: ISlot) => dispatch(removeAbilityFromSlot(slot));
  const handleClickSlot = (slot: ISlot) => setEditableSlot(slot);
  const onCancel = () => setEditableSlot(null);
  const handleEditMode = () => setEditMode(!editMode);
  const canSave = slots.some(slot => !!slot.ability?.name);

  const handleClickControl = () => {
    const sa = isRun;
    debugger;
    setIsRun(!isRun);
  }

  const renderEditSlots = (slots: Array<ISlot>) => {

    return slots.map(slot => 
        <div className="Activity__slot" key={slot.position}>
          {
            slot.ability ? 
                          <div className="Activity__ability" style={{backgroundImage: `url('${slot.ability?.image}')`}}>
                            <span className="Activity__remove" onClick={() => removeAbility(slot)}></span>
                          </div>
                         : 
                          <div className="Activity__emptyContainer" onClick={() => handleClickSlot(slot)}></div>
          }
        </div>)
  }

  const renderTimerSLots = (slots: Array<ISlot>) => {
    return slots.map(slot => {
      return <div className="Activity__ability" style={{backgroundImage: `url('${slot.ability?.image}')`}}>
        
      </div>
    })
  }

  return <div className="Activity innerContainer">
    {editableSlot && <Constructor onSelectAbility={onSelectAbility} onCancel={onCancel}/>}

    <div className="Activity__container">
      <div className={cn('ToolBox', {success: editMode})}>
        <span className="ToolBox__icon" onClick={handleEditMode}>
          <span className='ToolBox__save'>
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 72 72">
                <path d="M57.658,12.643c1.854,1.201,2.384,3.678,1.183,5.532l-25.915,40c-0.682,1.051-1.815,1.723-3.064,1.814	C29.764,59.997,29.665,60,29.568,60c-1.146,0-2.241-0.491-3.003-1.358L13.514,43.807c-1.459-1.659-1.298-4.186,0.36-5.646	c1.662-1.46,4.188-1.296,5.646,0.361l9.563,10.87l23.043-35.567C53.329,11.971,55.806,11.442,57.658,12.643z"></path>
            </svg>
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 72 72">
              <path d="M57.531,30.556C58.96,30.813,60,32.057,60,33.509v4.983c0,1.452-1.04,2.696-2.469,2.953l-2.974,0.535	c-0.325,1.009-0.737,1.977-1.214,2.907l1.73,2.49c0.829,1.192,0.685,2.807-0.342,3.834l-3.523,3.523	c-1.027,1.027-2.642,1.171-3.834,0.342l-2.49-1.731c-0.93,0.477-1.898,0.889-2.906,1.214l-0.535,2.974	C41.187,58.96,39.943,60,38.491,60h-4.983c-1.452,0-2.696-1.04-2.953-2.469l-0.535-2.974c-1.009-0.325-1.977-0.736-2.906-1.214	l-2.49,1.731c-1.192,0.829-2.807,0.685-3.834-0.342l-3.523-3.523c-1.027-1.027-1.171-2.641-0.342-3.834l1.73-2.49	c-0.477-0.93-0.889-1.898-1.214-2.907l-2.974-0.535C13.04,41.187,12,39.943,12,38.491v-4.983c0-1.452,1.04-2.696,2.469-2.953	l2.974-0.535c0.325-1.009,0.737-1.977,1.214-2.907l-1.73-2.49c-0.829-1.192-0.685-2.807,0.342-3.834l3.523-3.523	c1.027-1.027,2.642-1.171,3.834-0.342l2.49,1.731c0.93-0.477,1.898-0.889,2.906-1.214l0.535-2.974C30.813,13.04,32.057,12,33.509,12	h4.983c1.452,0,2.696,1.04,2.953,2.469l0.535,2.974c1.009,0.325,1.977,0.736,2.906,1.214l2.49-1.731	c1.192-0.829,2.807-0.685,3.834,0.342l3.523,3.523c1.027,1.027,1.171,2.641,0.342,3.834l-1.73,2.49	c0.477,0.93,0.889,1.898,1.214,2.907L57.531,30.556z M36,45c4.97,0,9-4.029,9-9c0-4.971-4.03-9-9-9s-9,4.029-9,9	C27,40.971,31.03,45,36,45z"></path>
          </svg>
        </span>
      </div>
      <div className="Activity__time">
        {
           editMode ? 
                    'Set the required abilities to these slots' 
                    : 
                     <div className="Controller">
                        <div className="Controller__time">
                          <Timer isTriggeredByMainControl={isGeneralRuns} tick={counter}/>
                        </div>
                        <div className="Controller__tool" onClick={handleClickControl}>
                          {
                            isGeneralRuns ? 
                                            <div className="pause">
                                              <span className="pause__stick"></span>
                                              <span className="pause__stick"></span>
                                            </div>
                                          : 
                                            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                              <path fill-rule="evenodd" clip-rule="evenodd" d="M4 4.11493C4 1.61163 6.88508 0.209383 8.85346 1.75597L18.8535 9.61312C19.5773 10.1819 20 11.0515 20 11.9721V12.0279C20 12.9485 19.5773 13.8181 18.8535 14.3869L8.85346 22.244C6.88507 23.7906 4 22.3884 4 19.8851V4.11493ZM7.61782 3.32861C6.96169 2.81308 6 3.2805 6 4.11493V19.8851C6 20.7195 6.96169 21.1869 7.61782 20.6714L17.6178 12.8142C17.8591 12.6247 18 12.3348 18 12.0279V11.9721C18 11.6652 17.8591 11.3753 17.6178 11.1858L7.61782 3.32861Z"/>
                                            </svg>
                          }
                        </div>
                     </div>
        }
      </div>
      <div className="Activity__grid">
        {
          editMode ? renderEditSlots(slots) : renderTimerSLots(slots)
        }
      </div>
    </div>
</div>

}

export default Activity;