// 1. Внешние зависимости.
// 2. Компоненты вашего проекта.
// 3. Утилиты и бизнес-логика.
// 4. Стили и ассеты.
import React, {useRef, useEffect} from 'react';
import cn from 'classnames';
import './search.scss';

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
      <input disabled={!!disabled} autoFocus={true} type='text' onChange={onChange} value={searchValue} onFocus={handleFocus} onBlur={handleBlur}/>
      {
        !!searchValue && 
        <span className="Search__clear" onClick={onClickClear}>
          <svg viewBox="0 0 24 25">
            <path d="M0.305846 0.280175C-0.0917023 0.663547 -0.103196 1.29661 0.280175 1.69416L10.368 12.155L0.284589 22.4834C-0.10122 22.8786 -0.09362 23.5117 0.301564 23.8975C0.696747 24.2833 1.32987 24.2757 1.71567 23.8805L11.7569 13.5953L21.799 24.0087C22.1824 24.4063 22.8154 24.4178 23.213 24.0344C23.6105 23.651 23.622 23.018 23.2386 22.6204L13.1547 12.1636L23.3713 1.6987C23.7571 1.30352 23.7495 0.670398 23.3543 0.284589C22.9591 -0.10122 22.326 -0.0936207 21.9402 0.301563L11.7657 10.7233L1.71983 0.305846C1.33646 -0.0917026 0.703395 -0.103196 0.305846 0.280175Z"/>
          </svg>
        </span>
      }
    </div>
  )
}

export default Search;