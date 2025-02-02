// 1. Внешние зависимости.
// 2. Компоненты вашего проекта.
// 3. Утилиты и бизнес-логика.
// 4. Стили и ассеты.
import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Constructor from './Constructor';
import { TStoreState } from '../../store/store';
import { addActivity, removeActivity, ISlot } from '../../store/slotsSlice';
import useTestHook from '../../utils/testHook';
import './activity.scss';


const Activity = () => {
  const slots = useSelector((state: TStoreState) => state.slots);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const message = useTestHook();

  const addAbility = (slot: ISlot) => {
    // navigate('constructor');

    const newObj = {
      position: slot.position,
      ability: { name: 'Black Hole'}
    }

    debugger;

    dispatch(addActivity(newObj));
  }

  const removeAbility = (slot: ISlot) => {
    // navigate('');

    const newObj = {
      position: slot.position,
      ability: null,
    }

    dispatch(removeActivity(newObj));
  }

  return <div className="Activity innerContainer">
    
    <Routes>
      <Route path='constructor/*' element={<Constructor onChange={() => console.log('.')} />} />
    </Routes>

    <div className="Activity__container">
      <div className="Activity__time" onClick={() => removeAbility(slots[2])}>
        {message}
      </div>
      <div className="Activity__grid">
        <div className="filled"></div>
        {slots.map(slot => <div key={slot.position} onClick={() => addAbility(slot)}><div>{slot.ability?.name}</div></div>)}
      </div>
    </div>
</div>

}

export default Activity;