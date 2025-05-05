// 1. Внешние зависимости.
// 2. Компоненты вашего проекта.
// 3. Утилиты и бизнес-логика.
// 4. Стили и ассеты.
import React, { JSX, useEffect, useRef, useState, useContext } from 'react';
import cn from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import StageContext, {EStages} from '../../store/StageContext';
import { ITimerData, IRequiredFields, IReducer } from '../../data/data';
import {removeTimerFromSlot, mapSpellToSlot, mapItemToSlot, mapFeatureToSlot, resetState, ISlot, applyReducer, removeReducer} from '../../store/slotSlice';
import { EAppStatus } from '../Playground/SettingsStage/SettingsStage';
import './SpellReducer.scss';
import fetchData from '../../data/data';

interface IProps {
    slot: ITimerData
    view?: boolean
}

const SpellReducer = ({slot, view}: IProps): JSX.Element => {
    const { cooldown: levels, cooldownIndex: activeLevelIndex, reducers: slotReducers } = slot;  
    const { reducers } = fetchData;

    const dispatch = useDispatch();

    const reducersForView = reducers.filter(rdr => !!slotReducers?.find(reducer => reducer.name === rdr.name));

    const handleClickReducer = (reducer: IReducer, isActive: boolean) => {
        dispatch(isActive ? removeReducer({position: slot.position, name: reducer.name}) : applyReducer({position: slot.position, name: reducer.name, percent: reducer.percent}));
    }

    return (
        <React.Fragment>
            {
                view ?
                <ul className="SpellReducer view">
                    {
                        reducersForView.map(reducer => {
                            return (
                                <div className={cn('SpellReducer__itemWrapper active')}>
                                    <div className="SpellReducer__item" style={{backgroundImage: `url('${reducer.img}')`}} title={`-${reducer.percent}%`}>
                                    </div>
                                </div>
                            )
                        })
                    }
                </ul>
                :
                <ul className="SpellReducer">
                    {
                        reducers.map(reducer => {
                            const active = slotReducers?.find(rdr => rdr.name === reducer.name);
        
                            return (
                                <div className={cn('SpellReducer__itemWrapper', {active: !!active})} onClick={() => handleClickReducer(reducer, !!active)}>
                                    <div className="SpellReducer__item" style={{backgroundImage: `url('${reducer.img}')`}} title={`-${reducer.percent}%`}>
                                    </div>
                                </div>
                            )
                        })
        
                    }
                </ul>
            }
        </React.Fragment>
    )
}

export default SpellReducer;