import React, { JSX, useState, useCallback, useEffect, useRef, useContext } from 'react';
import ReactDOM from 'react-dom';
import { useSelector, useDispatch } from 'react-redux';
import cn from 'classnames';
import {TStoreState} from '../../../store/store';
import EmptySlot from '../../GridSlot/EmptySlot';
import ConstructorComponent from '../../ConstructorComponent/ConstructorComponent';
import {EAbility, ITimerData} from '../../../data/data';
import {removeTimerFromSlot, mapSpellToSlot, mapItemToSlot, mapFeatureToSlot, resetState, ISlot} from '../../../store/slotSlice';
import { addRefresh } from '../../../store/refreshSlice';
import StageContext, {EStages} from '../../../store/StageContext';
import { translate } from '../../../utils/utils';
import DumbTimer from '../../Timer/DumbTimer';
import LevelController from '../../LevelController/LevelController';
import LevelControllerView from '../../LevelController/LevelControllerView';
import SpellReducer from '../../SpellReducer/SpellReducer';
import BindingOverlay from '../../BindingOverlay/BindingOverlay';
import CountdownEditor from '../../CoundownEditor/CountdownEditor';
import Notification from '../../Notification/Notification';
import './SettingsStage.scss';

export enum EAppStatus {
    RUNNING = 'runnig',
    PAUSED = 'paused',
    INITIAL = 'initial'
}

const SettingsStage = (): JSX.Element => {
    // TODO - нужно сделать нормальную функцию сравнения или по другому использовать стейт
    const slotList = useSelector((state: TStoreState) => state.slotList, (prev, next) => JSON.stringify(prev) === JSON.stringify(next));
    const runningSlots = useSelector((state: TStoreState) => state.runningSlice);
    const someOneIsBinding = useSelector((state: TStoreState) => state.bindingSlice.value);

    const [currentSlot, setCurrnetSlot] = useState<ISlot | null>(null);
    const {currentStage, changeStage} = useContext(StageContext);
    const [appStatus, setAppStatus] = useState<EAppStatus>(EAppStatus.INITIAL);
    const [editLevelControllers, setIsEditLevelController] = useState<number[]>([]);

    const dispatch = useDispatch();
    const slotListRef = useRef<ISlot[]>(slotList);
    const appStatusRef = useRef<EAppStatus>(appStatus);
    const currentStageRef = useRef<EStages>(currentStage);

    const [animatedSlot, setAnimatedSlot] = useState<number>(1);
    const animatedSlotRef = useRef<number>(1);

    useEffect(() => {
        currentStageRef.current = currentStage;
    }, [currentStage]);

    useEffect(() => { 
        slotListRef.current = slotList;
        const notEmpty = slotList.some(slot => 'name' in slot);

        if (notEmpty && currentStage === EStages.INITIAL) return changeStage(EStages.EDIT);
        if (!notEmpty && currentStage !== EStages.INITIAL) {
            setAppStatus(EAppStatus.INITIAL);
            changeStage(EStages.INITIAL);
        };
        
     }, [slotList]);

    const removeTimer = useCallback((slot: ITimerData) => dispatch(removeTimerFromSlot(slot)), []);

    useEffect(() => {
        appStatusRef.current = appStatus;
    }, [appStatus]);

    useEffect(() => {
        const parent = document.querySelector('#parentIdforFreezeAnimation');

        const timerId = setInterval(() => {
            if (currentStageRef.current !== EStages.INITIAL) {
                animatedSlotRef.current = 0;
                return setAnimatedSlot(animatedSlotRef.current);
            }

            if (!parent || parent.classList.contains('#parentIdforFreezeAnimation')) return;
            
            if (animatedSlotRef.current === slotListRef.current.length) {
                animatedSlotRef.current = 0;
            }

            setAnimatedSlot(animatedSlotRef.current + 1);
            animatedSlotRef.current += 1;
        }, 3600);

        
        const localOnKeyDown = (event: KeyboardEvent) => {
            if (event.code === 'CapsLock' || 
                event.code === 'Tab' ||
                event.code === 'Ctrl'
            ) {
                event.preventDefault();
            }
        }

        document.addEventListener('keydown', localOnKeyDown);

        return () => {
            clearInterval(timerId);
            animatedSlotRef.current = 1;
            setAnimatedSlot(animatedSlotRef.current);
            document.removeEventListener('keydown', localOnKeyDown);
        };
    }, []);

    const handleClickEmptySlot = (slot: ISlot) => setCurrnetSlot(slot);

    const onSelectAbility = (ability: ITimerData) => {
        if(!currentSlot) return;
        // if (currentStage !== EStages.EDIT) changeStage(EStages.EDIT);

        const updData = {
            ...ability,
            position: currentSlot.position,
            boundKey: currentSlot.boundKey
        }

        setCurrnetSlot(null);
        if (ability.type === EAbility.SPELLS) return dispatch(mapSpellToSlot(updData));
        if ('owner' in ability) return dispatch(mapItemToSlot(updData));
        dispatch(mapFeatureToSlot(updData));
    };

    const onConstructorCancel = () => setCurrnetSlot(null);

    const reset = () => {
        dispatch(resetState(null));
        changeStage(EStages.INITIAL);
        setAppStatus(EAppStatus.INITIAL);
    }

    const handleClickPause = useCallback(() => {
        if (appStatusRef.current !== EAppStatus.PAUSED) return setAppStatus(EAppStatus.PAUSED);
    }, []);
    
    const handleClickPlay = useCallback(() => {
        if (appStatusRef.current !== EAppStatus.RUNNING) return setAppStatus(EAppStatus.RUNNING);
    }, []);

    const editLevelController = (position: number) => {
        const upd = editLevelControllers.slice().filter(item => item !== position);
        upd.push(position);
        setIsEditLevelController(upd);
    }

    const cancelEditLevelController = (position: number) => {
        const upd = editLevelControllers.slice().filter(item => item !== position);
        setIsEditLevelController(upd);
    }

    const handleRefresh = () => {
        dispatch(addRefresh());
    }

    return (
        <div className="Playground__inner">
            { someOneIsBinding && <BindingOverlay /> }
            { currentSlot && <ConstructorComponent currentSlot={currentSlot as ISlot} onSelectAbility={onSelectAbility} onCancel={onConstructorCancel}/> }
            
            <Notification />

            <div className="TimerGear">
                <div className="TimerGear__header">

                    <div className={cn('Playground__leftBtnContainer', {hidden: currentStage !== EStages.EDIT})}>
                        <div className={cn('Playground__button')} title={translate('Clean slots')} onClick={reset}>
                            <svg viewBox="0 0 122.88 120.01">
                                <path d="M110.97,1.27L70.02,42.73l10.67,10.36l41.25-41.56C125.58,3.7,117.92-2.85,110.97,1.27L110.97,1.27z M54.04,46.81c0.4-0.31,0.81-0.58,1.22-0.81l0.15-0.08c2.35-1.28,4.81-1.24,7.39,0.53l7.17,6.98l0.11,0.11l6.6,6.42 c2.73,2.78,3.34,5.88,1.83,9.31l-19.35,50.75C24.02,112.99-0.34,87.94,0,49.73C19.23,55.35,37.75,57.19,54.04,46.81L54.04,46.81z"/>
                            </svg>
                        </div>
                        {
                            !!runningSlots.running.length &&
                            <div className={cn('Playground__button refreshButton')} title={translate('Refresh timers')} onClick={handleRefresh}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
                                    <path d="M16.5 9C15.7381 9 15.3769 9.53688 15.25 10.1038C14.7931 12.1438 12.8544 15.25 9 15.25C5.54813 15.25 2.75 12.4512 2.75 9C2.75 5.54875 5.54813 2.75 9 2.75C10.4 2.75 11.6844 3.22063 12.725 4H11.5C10.81 4 10.25 4.56 10.25 5.25C10.25 5.94 10.81 6.5 11.5 6.5H15.25C15.94 6.5 16.5 5.94 16.5 5.25V1.5C16.5 0.81 15.94 0.25 15.25 0.25C14.56 0.25 14 0.81 14 1.5V1.82375C12.5831 0.8325 10.8606 0.25 9 0.25C4.1675 0.25 0.25 4.1675 0.25 9C0.25 13.8325 4.1675 17.75 9 17.75C15.2369 17.75 17.75 11.8125 17.75 10.3281C17.75 9.42 17.0863 9 16.5 9Z"/>
                                </svg>
                            </div>
                        }
                    </div>

                    { currentStage !== EStages.INITIAL && <CountdownEditor /> }

                    {
                        currentStage === EStages.EDIT &&
                        <div className={cn('Playground__button play')} onClick={() => changeStage(EStages.PLAY)}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 26" >
                                <path d="M23 0C23.5523 0 24 0.447715 24 1V25C24 25.5523 23.5523 26 23 26H12C11.4477 26 11 25.5523 11 25V23C11 22.4477 11.4477 22 12 22H20V4H12C11.4477 4 11 3.55228 11 3V1C11 0.447715 11.4477 2.0133e-08 12 0H23Z" />
                                <path d="M0.5 5.20605C0.5 4.43625 1.33333 3.95494 2 4.33984L15.5 12.1338C16.1667 12.5187 16.1667 13.4813 15.5 13.8662L2 21.6602C1.33333 22.0451 0.5 21.5637 0.5 20.7939V5.20605Z" />
                            </svg>
                        </div>
                    }
                    {
                        currentStage ===  EStages.PLAY && 
                        <div className={cn('Playground__button')} onClick={() => changeStage(EStages.EDIT)}>
                            <svg viewBox="0 0 24 24">
                                <path d="M22.2,14.4L21,13.7c-1.3-0.8-1.3-2.7,0-3.5l1.2-0.7c1-0.6,1.3-1.8,0.7-2.7l-1-1.7c-0.6-1-1.8-1.3-2.7-0.7   L18,5.1c-1.3,0.8-3-0.2-3-1.7V2c0-1.1-0.9-2-2-2h-2C9.9,0,9,0.9,9,2v1.3c0,1.5-1.7,2.5-3,1.7L4.8,4.4c-1-0.6-2.2-0.2-2.7,0.7   l-1,1.7C0.6,7.8,0.9,9,1.8,9.6L3,10.3C4.3,11,4.3,13,3,13.7l-1.2,0.7c-1,0.6-1.3,1.8-0.7,2.7l1,1.7c0.6,1,1.8,1.3,2.7,0.7L6,18.9   c1.3-0.8,3,0.2,3,1.7V22c0,1.1,0.9,2,2,2h2c1.1,0,2-0.9,2-2v-1.3c0-1.5,1.7-2.5,3-1.7l1.2,0.7c1,0.6,2.2,0.2,2.7-0.7l1-1.7   C23.4,16.2,23.1,15,22.2,14.4z M12,16c-2.2,0-4-1.8-4-4c0-2.2,1.8-4,4-4s4,1.8,4,4C16,14.2,14.2,16,12,16z"/>
                            </svg>
                        </div>
                    }
                </div>
                <div className={cn('TimerGear__main appStyledScroll')} id={'parentIdforFreezeAnimation'}>
                    {
                        slotList.map(slot => 
                            <div key={slot.position} className={cn('Playground__slotBox', {void: currentStage === EStages.PLAY})}>
                                <div className="timerBox">
                                    {
                                        !('name' in slot)
                                        ? <EmptySlot animate={(animatedSlot === slot.position) && (currentStage === EStages.INITIAL)} 
                                                        key={slot.position} 
                                                        data={slot}
                                                        onClick={handleClickEmptySlot} /> 
                                        : <React.Fragment>
                                            <DumbTimer ability={slot}
                                                        appStatus={appStatus} 
                                                        runApp={handleClickPlay} 
                                                        pauseApp={handleClickPause}
                                                        currentStage={currentStage}
                                                        removeTimer={removeTimer}/>
                                        {
                                            currentStage === EStages.EDIT ?
                                            <div className="Playground__slotSettings">
                                                <LevelController slot={slot}
                                                                    editLevelController={editLevelController}
                                                                    cancelEditLevelController={cancelEditLevelController}
                                                                    isEdit={editLevelControllers.includes(slot.position)} />
                                                { !editLevelControllers.includes(slot.position) && !slot.customCooldown && <SpellReducer slot={slot}/> }
                                            </div>
                                            : <React.Fragment>
                                                <LevelControllerView slot={slot}/>
                                                { !slot.customCooldown && <SpellReducer slot={slot} view={true}/> }
                                            </React.Fragment>
                                        }
                                        </React.Fragment>
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default SettingsStage;