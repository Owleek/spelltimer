// 1. Внешние зависимости.
// 2. Компоненты вашего проекта.
// 3. Утилиты и бизнес-логика.
// 4. Стили и ассеты.
import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Constructor from './Constructor';
import useTestHook from '../../utils/testHook';
import './activity.scss';

const Activity = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isConstructorMode, setIsConstructorMode] = useState(false);
  const navigate = useNavigate();
  const message = useTestHook();

  useEffect(() => {
    document.body.addEventListener('keyup', (keyboardEvent) => {
      
      if (keyboardEvent.code === 'Escape') {
        setIsConstructorMode(false);
      }
    });
  }, []);
  

  const addAbility = () => {
    navigate('constructor');
  }

  const applyChanges = () => {
    setIsConstructorMode(false);
  }


  return <div className="Activity innerContainer">
    
    <Routes>
      <Route path='constructor/*' element={<Constructor onChange={() => console.log('.')} />} />
    </Routes>

    <div className="Activity__container">
      <div className="Activity__time">
        {message}
      </div>
      <div className="Activity__grid">
        <div className="filled"></div>
        {[1, 2, 3, 4, 5].map(num => <div key={num} onClick={addAbility}></div>)}
      </div>
    </div>
</div>

}

export default Activity;