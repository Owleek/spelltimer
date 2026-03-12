import React, { JSX } from 'react';
import { ITimerData } from '../../data/data';
import cn from 'classnames';
import './ImageGrid.scss';
import ProgressiveImage from '../ConstructorComponent/ProgressiveImage/ProgressiveImage';

interface IProps {
    abilities: Array<ITimerData>
    onClick: (ability: ITimerData) => void
    disableItemsExceptCurrent: ITimerData | null
}

const ImageGrid = ({abilities, onClick, disableItemsExceptCurrent}: IProps): JSX.Element => {
    return (
        <div className='AbilityGrid'>
            { abilities.map(ability => <span key={ability.id} className={cn('AbilityItem', {disabled: disableItemsExceptCurrent && disableItemsExceptCurrent !== ability})} onClick={() => onClick(ability)} title={ability.name}>
                    <ProgressiveImage altName={ability.name} img={ability.img} compressedImg={ability.compressedImg}/>
                </span>)
            }
        </div>
    );
}

export default ImageGrid;