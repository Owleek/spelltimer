// 1. Внешние зависимости.
// 2. Компоненты вашего проекта.
// 3. Утилиты и бизнес-логика.
// 4. Стили и ассеты.
import { useState } from 'react';
import './activity.scss';

interface IProps {
    handleClick: () => void;
}

const Supplier = (props: IProps) => {
  return <div className="add" onClick={props.handleClick}></div>
}

export default Supplier;