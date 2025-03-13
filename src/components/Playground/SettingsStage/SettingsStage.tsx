import React, { JSX, useState, useCallback, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {TStoreState} from '../../../store/store';
import EmptySlot from '../../GridSlot/EmptySlot';
import TunedSlot from '../../GridSlot/TunedSlot';
import PlayButton from '../../PlayButton/PlayButton';
import ConstructorComponent from '../../ConstructorComponent/ConstructorComponent';
import {ITimerData} from '../../../data/data';
import {removeTimerFromSlot, mapTimerToSlot, updateHotKey, updateManyHotkeys, ISlot} from '../../../store/slotSlice';
import './SettingsStage.scss';

const InfoText = () => {
    return (
        <div className="SettingsStage__info">
            <span className="SettingsStage__infoMain">Установите в ячеки (способности, предметы, функции) игры который хотите отслеживать</span>
            <span className="SettingsStage__infoSecondary">Так же вы можете изменить горячие клавиши для запуска таймера способности</span>
        </div>
    )
}

const SettingsStage = (): JSX.Element => {
    // TODO - нужно сделать нормальную функцию сравнения или по другому использовать стейт
    const slotList = useSelector((state: TStoreState) => state.slotList, (prev, next) => JSON.stringify(prev) === JSON.stringify(next));
    const isReadyToStart: boolean = slotList.some(el => 'name' in el);
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

    return (
        <div className="SettingsStage">
            {currentSlot && <ConstructorComponent currentSlot={currentSlot as ISlot} onSelectAbility={onSelectAbility} onCancel={onConstructorCancel}/> }

            <div className="SettingsStage__header">
                {
                    isReadyToStart 
                        ? <PlayButton onClick={() => null}/>
                        : <InfoText />
                }
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