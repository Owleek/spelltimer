// 1. Внешние зависимости.
// 2. Компоненты вашего проекта.
// 3. Утилиты и бизнес-логика.
// 4. Стили и ассеты.
import React, { JSX } from 'react';
import { IAbility } from '../../data/fillData';
import './ImageGrid.scss';

interface IProps {
    abilities: Array<IAbility>
    onClick: (ability: IAbility) => void
}


const ImageGrid = ({abilities, onClick}: IProps): JSX.Element => {
    return (
        <div className='AbilityGrid'>
            { abilities.map(ability => <span key={ability.id} className="AbilityItem" onClick={() => onClick(ability)}>
                    <img key={ability.id} src={ability.image} />
                </span>) 
            }
        </div>
    );
}

export default ImageGrid;