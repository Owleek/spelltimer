// 1. Внешние зависимости.
// 2. Компоненты вашего проекта.
// 3. Утилиты и бизнес-логика.
// 4. Стили и ассеты.
import { useEffect, useState } from 'react';
import './activity.scss';
import Constructor from './Constructor';
import Supplier from './Supplier';

const Activity = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isConstructorMode, setIsConstructorMode] = useState(false);

  useEffect(() => {
    document.body.addEventListener('keyup', (keyboardEvent) => {
      
      if (keyboardEvent.code === 'Escape') {
        const asdas = isConstructorMode;
        setIsConstructorMode(false);
      }

    });
  }, []);
  

  const addAbility = () => {
    setIsConstructorMode(true);
  }

  const applyChanges = () => {
    setIsConstructorMode(false);
  }


  return <div className="Activity innerContainer">
    
    { isConstructorMode && <Constructor onChange={applyChanges}/> }

  
    <div className="Activity__container">
      <div className="Activity__time">
        00:00
      </div>
      <div className="Activity__grid">
        <div className="filled"></div>
        {[1, 2, 3, 4, 5].map(num => <div onClick={addAbility}></div>)}
      </div>
    </div>
</div>

}

export default Activity;