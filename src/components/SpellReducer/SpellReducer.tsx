import React, { JSX } from 'react';
import { useDispatch } from 'react-redux';
import { ITimerData, IReducer } from '../../data/data';
import {applyReducer, removeReducer, toggleUpgradeCooldown} from '../../store/slotSlice';
import fetchData from '../../data/data';
import cn from 'classnames';
import './SpellReducer.scss';

interface IProps {
    slot: ITimerData
    view?: boolean
}

const SpellReducer = ({slot, view}: IProps): JSX.Element => {
    const { cooldown: levels, cooldownIndex: activeLevelIndex, reducers: slotReducers, upgradeByScepter, isUpgrade } = slot;  
    const { reducers } = fetchData;

    const dispatch = useDispatch();

    const reducersForView = reducers.filter(rdr => !!slotReducers?.find(reducer => reducer.name === rdr.name));

    const handleClickReducer = (reducer: IReducer, isActive: boolean) => {
        dispatch(isActive ? removeReducer({position: slot.position, name: reducer.name}) : applyReducer({position: slot.position, name: reducer.name, percent: reducer.percent}));
    }

    const recalculateReducingAfterUpgrade = () => dispatch(toggleUpgradeCooldown({position: slot.position}));

    return (
        <React.Fragment>
            {
                view ?
                <ul className="SpellReducer view">
                    {
                        upgradeByScepter?.length && 
                        <div className={cn('SpellReducer__itemWrapper active')}>
                            <div className="SpellReducer__item" style={{backgroundImage: `url("/assets/reducers/aghanim's_scepter.webp")`}} title={`${String(upgradeByScepter)}`}>
                            </div>
                        </div>
                    }
                    {
                        reducersForView.map(reducer => {
                            return (
                                <div key={reducer.percent} className={cn('SpellReducer__itemWrapper active')}>
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
                        upgradeByScepter?.length && 
                        <div className={cn('SpellReducer__itemWrapper', {active: !!isUpgrade})} onClick={recalculateReducingAfterUpgrade}>
                            <div className="SpellReducer__item" style={{backgroundImage: `url("/assets/reducers/aghanim's_scepter.webp")`}} title={`${String(upgradeByScepter)}`}>
                            </div>
                        </div>
                    }
                    {
                        reducers.map(reducer => {
                            const active = slotReducers?.find(rdr => rdr.name === reducer.name);
        
                            return (
                                <div key={reducer.percent} className={cn('SpellReducer__itemWrapper', {active: !!active})} onClick={() => handleClickReducer(reducer, !!active)}>
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