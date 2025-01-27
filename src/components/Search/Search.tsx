// 1. Внешние зависимости.
// 2. Компоненты вашего проекта.
// 3. Утилиты и бизнес-логика.
// 4. Стили и ассеты.
import React, { useState } from 'react';
import cn from 'classnames';
import './search.scss';

interface IProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => any;
}

const Search = (props: IProps) => {

  return (
    <div className="Search">
      <input type='text' onChange={props.onChange}/>
    </div>
  )
}

export default Search;