// 1. Внешние зависимости.
// 2. Компоненты вашего проекта.
// 3. Утилиты и бизнес-логика.
// 4. Стили и ассеты.
import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useMatch } from 'react-router-dom';
import './activity.scss';

const Activity = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isConstructorMode, setIsConstructorMode] = useState(false);
  const navigate = useNavigate();

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
    
    <Outlet />

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