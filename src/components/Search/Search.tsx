// 1. Внешние зависимости.
// 2. Компоненты вашего проекта.
// 3. Утилиты и бизнес-логика.
// 4. Стили и ассеты.
import React from 'react';
import './search.scss';

interface IProps {
  searchValue: string;
  onSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
}

const Search = ({searchValue, onSearch, onBlur}: IProps) => {
  return (
    <div className="Search">
      <input type='text' onChange={onSearch} value={searchValue} onBlur={onBlur}/>
    </div>
  )
}

export default Search;