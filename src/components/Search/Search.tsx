// 1. Внешние зависимости.
// 2. Компоненты вашего проекта.
// 3. Утилиты и бизнес-логика.
// 4. Стили и ассеты.
import React, {useRef, useEffect} from 'react';
import cn from 'classnames';
import './search.scss';

interface IProps {
  searchValue: string
  onSearch: (event: React.ChangeEvent<HTMLInputElement>) => void
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void
  disabled?: boolean
}

const Search = ({searchValue, onSearch, onBlur, disabled}: IProps) => {

  return (
    <div className={cn('Search', {disabled: !!disabled})} >
      <input disabled={!!disabled} autoFocus={true} type='text' onChange={onSearch} value={searchValue} onBlur={onBlur}/>
    </div>
  )
}

export default Search;