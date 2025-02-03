// 1. Внешние зависимости.
// 2. Компоненты вашего проекта.
// 3. Утилиты и бизнес-логика.
// 4. Стили и ассеты.
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Constructor from './Constructor';
import { TStoreState } from '../../store/store';
import { ISlot, setAbility } from '../../store/slotsSlice';
import useTestHook from '../../utils/testHook';
import './activity.scss';


const Activity = () => {
  const dispatch = useDispatch();
  const slots = useSelector((state: TStoreState) => state.slots);
  const editableSlot = slots.find(slot => !!slot.isEdit);
  const handleClickSlot = (slot: ISlot) => dispatch(setAbility({...slot, isEdit: true}));

  return <div className="Activity innerContainer">    
    {editableSlot && <Constructor />}

    <div className="Activity__container">
      <div className="Activity__time">Set favorite abilities to these slots</div>
      <div className="Activity__grid">
        {slots.map(slot => <div key={slot.position} onClick={() => handleClickSlot(slot)}>{slot.ability?.name}</div>)}
      </div>
    </div>
</div>

}

export default Activity;