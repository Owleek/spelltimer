// 1. Внешние зависимости.
// 2. Компоненты вашего проекта.
// 3. Утилиты и бизнес-логика.
// 4. Стили и ассеты.
import { useState } from 'react';
import './activity.scss';
import Constructor from './Constructor';
import Supplier from './Supplier';

const Activity = () => {
  const [isEdit, setIsEdit] = useState(false);

  const addAbility = () => {
    setIsEdit(true);
  }

  const applyChanges = () => {
    setIsEdit(false);
  }


  return <div className="Activity innerContainer">
    
    { isEdit && <Constructor onChange={applyChanges}/> }

  
    <div className="Activity__container">
      <div className="Activity__time">
        00:00
      </div>
      <div className="Activity__grid">
        <div className="filled"></div>
        <Supplier handleClick={addAbility}/>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
</div>

}

export default Activity;