// 1. Внешние зависимости.
// 2. Компоненты вашего проекта.
// 3. Утилиты и бизнес-логика.
// 4. Стили и ассеты.
import React, { JSX } from 'react';
import { ITimerData } from '../../data/data';
import './ImageGrid.scss';

interface IProps {
    abilities: Array<ITimerData>
    onClick: (ability: ITimerData) => void
}

const ImageGrid = ({abilities, onClick}: IProps): JSX.Element => {
    return (
        <div className='AbilityGrid'>
            { abilities.map(ability => <span key={ability.id} className="AbilityItem" onClick={() => onClick(ability)}>
                    <img key={ability.id} src={ability.img} />
                </span>) 
            }
        </div>
    );
}

export default ImageGrid;