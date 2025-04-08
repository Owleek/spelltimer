// 1. Внешние зависимости.
// 2. Компоненты вашего проекта.
// 3. Утилиты и бизнес-логика.
// 4. Стили и ассеты.
import React from 'react';
import cn from 'classnames';
import './search.scss';

interface IProps {
  searchValue: string;
  onSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
}

const Search = ({searchValue, onSearch, onBlur, className = ''}: IProps) => {
  return (
    <div className={cn('Search', className)} >
      <input type='text' onChange={onSearch} value={searchValue} onBlur={onBlur}/>
    </div>
  )
}

export default Search;