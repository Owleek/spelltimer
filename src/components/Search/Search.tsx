import React from 'react';
import cn from 'classnames';
import './search.scss';
import SpriteIcon from '@shared/ui/SpriteIcon';

interface IProps {
  searchValue: string
  disabled?: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onClickClear: () => void
  handleFocus: () => any
  handleBlur: () => any
  className?: string
}

const Search = ({searchValue, onChange, disabled, onClickClear, className, handleFocus, handleBlur}: IProps) => {
  return (
    <div className={cn('Search', {disabled: !!disabled}, className)}>
      <input autoFocus={true} type='text' onChange={onChange} value={searchValue} onFocus={handleFocus} onBlur={handleBlur}/>
      {
        !!searchValue && 
        <span className="Search__clear" onClick={onClickClear}>
          <SpriteIcon id="components-search-search-1" />
        </span>
      }
    </div>
  )
}

export default Search;