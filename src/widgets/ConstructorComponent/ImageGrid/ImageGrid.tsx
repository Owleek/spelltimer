import React, { JSX } from 'react';
import { ITimerData } from '../../../shared/data/data';
import cn from 'classnames';
import './ImageGrid.scss';

interface IProps {
    abilities: Array<ITimerData>
    onClick: (ability: ITimerData) => void
    disableItemsExceptCurrent: ITimerData | null
    onLoad: (key: string) => void
}

const ImageGrid = ({abilities, onClick, disableItemsExceptCurrent, onLoad}: IProps): JSX.Element => {
    return (
        <div className='AbilityGrid'>
            { abilities.map(ability => <span key={ability.id} className={cn('AbilityItem', {disabled: disableItemsExceptCurrent && disableItemsExceptCurrent !== ability})} onClick={() => onClick(ability)} title={ability.name}>
                    <img key={ability.id} alt="" src={ability.img} onLoad={() => onLoad(ability.id)}/>
            </span>)
            }
        </div>
    );
}

export default ImageGrid;

