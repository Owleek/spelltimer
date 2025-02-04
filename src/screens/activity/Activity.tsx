// 1. Внешние зависимости.
// 2. Компоненты вашего проекта.
// 3. Утилиты и бизнес-логика.
// 4. Стили и ассеты.
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Constructor from './Constructor';
import { TStoreState } from '../../store/store';
import { ISlot, mapAbilityToSlot, removeAbilityFromSlot } from '../../store/slotsSlice';
import './activity.scss';
import { IAbility } from '../../data/fillData';


const Activity = () => {
  const dispatch = useDispatch();
  const slots = useSelector((state: TStoreState) => state.slots);
  const [editableSlot, setEditableSlot] = useState<ISlot | null>(null);
  
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

  return <div className="Activity innerContainer">
    {editableSlot && <Constructor onSelectAbility={onSelectAbility} onCancel={onCancel}/>}

    <div className="Activity__container">
      <div className="Activity__time">Set favorite abilities to these slots</div>
      <div className="Activity__grid">
        {
          slots.map(slot => 
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
      </div>
    </div>
</div>

}

export default Activity;