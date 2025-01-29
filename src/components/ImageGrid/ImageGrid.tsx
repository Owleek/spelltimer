// 1. Внешние зависимости.
// 2. Компоненты вашего проекта.
// 3. Утилиты и бизнес-логика.
// 4. Стили и ассеты.
import React, { useState } from 'react';
import getData from '../../data/fillData';
import './ImageGrid.scss';


const ImageGrid = () => {
    const {fullData, plainData} = getData();

    return (
        <div className='AbilityGrid'>
            { plainData.map(ability => <span className='AbilityItem'>
                    <img key={ability.id} src={ability.image} />
                </span>) 
            }
        </div>
    );
}

export default ImageGrid;