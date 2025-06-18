// 1. Внешние зависимости.
// 2. Компоненты вашего проекта.
// 3. Утилиты и бизнес-логика.
// 4. Стили и ассеты.
import React, { JSX } from 'react';
import { ITimerData } from '../../data/data';
import cn from 'classnames';
import './ImageGrid.scss';

interface IProps {
    abilities: Array<ITimerData>
    onClick: (ability: ITimerData) => void
    disableItemsExceptCurrent: ITimerData | null
}

const ImageGrid = ({abilities, onClick, disableItemsExceptCurrent}: IProps): JSX.Element => {
    return (
        <div className='AbilityGrid'>
            { abilities.map(ability => <span key={ability.id} className={cn('AbilityItem', {disabled: disableItemsExceptCurrent && disableItemsExceptCurrent !== ability})} onClick={() => onClick(ability)} title={ability.name}>
                    <img key={ability.id} src={ability.img} />
                </span>) 
            }
        </div>
    );
}

export default ImageGrid;