import React, { JSX } from 'react';
import cn from 'classnames';
import { IRequiredFields } from '../../data/data';
import './LevelController.scss';

interface IProps {
    slot: IRequiredFields
}

const LevelControllerView = ({slot}: IProps): JSX.Element => {
    const {cooldown: levels, cooldownIndex: activeLevelIndex} = slot;

    return (
        <div className="LevelController view">
            <div className="LevelController__holder">
                <div className="LevelController__indicatorsContainer">
                    {
                        levels.map((level, index) => 
                            <div key={level} className={cn('LevelController__indicatorBox', {active: index <= activeLevelIndex})} title={String(level)}>
                                <span className="LevelController__indicator"></span>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default LevelControllerView;