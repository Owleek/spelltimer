// 1. Внешние зависимости.
// 2. Компоненты вашего проекта.
// 3. Утилиты и бизнес-логика.
// 4. Стили и ассеты.
import React, { useState } from 'react';
import { IAbility } from '../../data/fillData';
import './ImageGrid.scss';


const ImageGrid = ({abilities}: {abilities: Array<IAbility>}) => {
    return (
        <div className='AbilityGrid'>
            { abilities.map(ability => <span className='AbilityItem'>
                    <img key={ability.id} src={ability.image} />
                </span>) 
            }
        </div>
    );
}

export default ImageGrid;