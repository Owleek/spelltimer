// 1. Внешние зависимости.
// 2. Компоненты вашего проекта.
// 3. Утилиты и бизнес-логика.
// 4. Стили и ассеты.
import React, { JSX, useEffect, useRef, useState, useContext } from 'react';
import cn from 'classnames';
import StageContext, {EStages} from '../../store/StageContext';
import { ITimerData, IRequiredFields } from '../../data/data';
import { EAppStatus } from '../Playground/SettingsStage/SettingsStage';
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