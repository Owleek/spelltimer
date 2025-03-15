import React, { JSX, useState, useCallback, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {TStoreState} from '../../../store/store';
import EmptySlot from '../../GridSlot/EmptySlot';
import TunedSlot from '../../GridSlot/TunedSlot';
import MainTime from '../../MainTime/MainTime';
import PlayButton from '../../PlayButton/PlayButton';
import ConstructorComponent from '../../ConstructorComponent/ConstructorComponent';
import {ITimerData} from '../../../data/data';
import {removeTimerFromSlot, mapTimerToSlot, updateHotKey, updateManyHotkeys, ISlot} from '../../../store/slotSlice';
import './SettingsStage.scss';
import EmptyMainTime from '../../MainTime/EmptyMainTime';

enum EState {
    INITIAL = 'initial',
    SETTINGS = 'settings'
}

const InfoText = () => {
    return (
        <div className="SettingsStage__info">
            <span className="SettingsStage__infoMain">Добавьте в ячеки способности или предметы которые хотите отслеживать</span>
            <span className="SettingsStage__infoSecondary">Измените горячие клавиши по желанию для запуска таймеров или времени</span>
        </div>
    )
}

const SettingsStage = (): JSX.Element => {
    // TODO - нужно сделать нормальную функцию сравнения или по другому использовать стейт
    const slotList = useSelector((state: TStoreState) => state.slotList, (prev, next) => JSON.stringify(prev) === JSON.stringify(next));
    const isReadyToStart: boolean = slotList.some(el => 'name' in el);

    const [state, setState] = useState<EState>(EState.INITIAL);

    const [currentSlot, setCurrnetSlot] = useState<ISlot | null>(null);
    const dispatch = useDispatch();
    const slotListRef = useRef<ISlot[]>(slotList);

    useEffect(() => {
        const keys = slotList.map((slot) => {
            const storageKey = localStorage.getItem(`pos_${slot.position}`);
            if (storageKey || storageKey === '') return {position: slot.position, boundKey: storageKey};
            localStorage.setItem(`pos_${slot.position}`, `${slot.boundKey}`);
            return {position: slot.position, boundKey: slot.boundKey};
        });
        
        dispatch(updateManyHotkeys(keys));
    }, []);

    useEffect(() => { slotListRef.current = slotList }, [slotList]);

    const removeAbility = (slot: ITimerData) => dispatch(removeTimerFromSlot(slot));

    const handleClickEmptySlot = (slot: ISlot) => { setCurrnetSlot(slot) };

    const onSelectAbility = (ability: ITimerData) => {
        if(!currentSlot) return;

        const updData = {
            ...ability,
            position: currentSlot.position,
            boundKey: currentSlot.boundKey
        }

        setCurrnetSlot(null);
        dispatch(mapTimerToSlot(updData));
    };

    const onConstructorCancel = () => { setCurrnetSlot(null) };

    const bindKey = useCallback((position: number, boundKey: string) => {
        const __slotList = slotListRef.current;

        if (__slotList.every(item => item.boundKey !== boundKey)) {
            localStorage.setItem(`pos_${position}`, `${boundKey}`);
            return dispatch(updateHotKey([{position, boundKey}]));
        }

        const matchedSlot = __slotList.find(slot => slot.boundKey === boundKey);
        if (!matchedSlot) throw new Error('Error with key bindigs');
        
        localStorage.setItem(`pos_${matchedSlot.position}`, '');
        localStorage.setItem(`pos_${position}`, `${boundKey}`);

        return dispatch(updateHotKey([{position, boundKey}, {position: matchedSlot.position, boundKey: ''}]));
    }, []); //TODO - проверить почему не получается без useRef с зависимостью [slotList] 

    if (state === EState.INITIAL) return (
        <div className="SettingsStage">
            <div className="SettingsStage__header">
                <InfoText />
                <EmptyMainTime />
            </div>
            <div className="SettingsStage__grid">
                {
                    slotList.map(slot => <EmptySlot key={slot.position} data={slot} onClick={handleClickEmptySlot} bindKey={bindKey}/>)
                }
            </div>
        </div>
    );

    return (
        <div className="SettingsStage">
            { currentSlot && <ConstructorComponent currentSlot={currentSlot as ISlot} onSelectAbility={onSelectAbility} onCancel={onConstructorCancel}/> }

            <div className="SettingsStage__header">
                <MainTime isRun={false} seconds="00" minutes="00" onClickSettings={() => null} onClickTrigger={() => null}/>                
            </div>

            <div className="SettingsStage__grid">
                {
                    slotList.map(slot => {
                        return 'name' in slot 
                        ? <TunedSlot key={slot.position} data={slot} handleRemove={removeAbility}/>
                        : <EmptySlot key={slot.position} data={slot} onClick={handleClickEmptySlot} bindKey={bindKey}/> 
                    })
                }
            </div>
        </div>
    )
}

export default SettingsStage;