'use client';
import React, { JSX, useState, useCallback, useEffect, useRef, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import cn from 'classnames';
import {TStoreState} from '../../shared/store/store';
import EmptySlot from '../../widgets/TimerPanel/GridSlot/EmptySlot';
import ConstructorComponent from '../../widgets/ConstructorComponent/ConstructorComponent';
import {EAbility, ITimerData} from '../../shared/data/data';
import {removeTimerFromSlot, mapSpellToSlot, mapItemToSlot, mapFeatureToSlot, resetState, ISlot} from '../../shared/store/slotSlice';
import { addRefresh } from '../../shared/store/refreshSlice';
import StageContext, {EStages} from '../../shared/store/StageContext';
import Timer from '../../widgets/TimerPanel/Timer/Timer';
import LevelController from '../../widgets/TimerPanel/LevelController/LevelController';
import LevelControllerView from '../../widgets/TimerPanel/LevelController/LevelControllerView';
import SpellReducer from '../../widgets/TimerPanel/SpellReducer/SpellReducer';
import BindingOverlay from '../../shared/ui/BindingOverlay/BindingOverlay';
import CountdownEditor from '../../widgets/TimerPanel/CountdownEditor/CountdownEditor';
import Notification from '../../widgets/Notification/Notification';
import { translateText } from '../../shared/lib/utils';
import { playSound, SOUND } from '../../shared/lib/sound';
import ImageCover from '../../shared/ui/ImageCover/ImageCover';
import './Playground.scss';

export enum EAppStatus {
    RUNNING = 'runnig',
    PAUSED = 'paused',
    INITIAL = 'initial'
}

const Playground = (): JSX.Element => {
    const [currentStage, setCurrentStage] = useState<EStages>(EStages.INITIAL);
    const changeStage = (stage: EStages) => setCurrentStage(stage);
    const payload = { currentStage, changeStage };

    // TODO - нужно сделать нормальную функцию сравнения или по другому использовать стейт
    const slotList = useSelector((state: TStoreState) => state.slotList, (prev, next) => JSON.stringify(prev) === JSON.stringify(next));
    const runningSlots = useSelector((state: TStoreState) => state.runningSlice);
    const someOneIsBinding = useSelector((state: TStoreState) => state.bindingSlice.value);

    const [currentSlot, setCurrnetSlot] = useState<ISlot | null>(null);
    const [appStatus, setAppStatus] = useState<EAppStatus>(EAppStatus.INITIAL);
    const [editLevelControllers, setIsEditLevelController] = useState<number[]>([]);
    const [withSound, setWithSound] = useState<boolean>(true);

    const dispatch = useDispatch();
    const slotListRef = useRef<ISlot[]>(slotList);
    const appStatusRef = useRef<EAppStatus>(appStatus);
    const currentStageRef = useRef<EStages>(currentStage);

    const [animatedSlot, setAnimatedSlot] = useState<number>(1);
    const animatedSlotRef = useRef<number>(1);

    const {dictionary} = useSelector((state: TStoreState) => state.localeSlice);

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

    const handleMute = (val: boolean) => {
        if (!withSound) playSound(SOUND, true);
        setWithSound(!withSound);
    }

    return (
    <div className="Playground">
      <StageContext.Provider value={payload}>
        <div className="Playground__inner">
            <ImageCover image="playground.webp" />

            { someOneIsBinding && <BindingOverlay /> }
            { currentSlot && <ConstructorComponent currentSlot={currentSlot as ISlot} onSelectAbility={onSelectAbility} onCancel={onConstructorCancel}/> }
            
            <Notification />

            <div className="TimerGear">
                <div className="TimerGear__header">

                    <div className={cn('Playground__leftBtnContainer', {hidden: currentStage === EStages.INITIAL})}>
                        {
                            currentStage === EStages.EDIT &&
                            <div className={cn('Playground__button')} title={translateText(dictionary, 'clear_slots')} onClick={reset}>
                                <svg viewBox="0 0 122.88 120.01">
                                    <path d="M110.97,1.27L70.02,42.73l10.67,10.36l41.25-41.56C125.58,3.7,117.92-2.85,110.97,1.27L110.97,1.27z M54.04,46.81c0.4-0.31,0.81-0.58,1.22-0.81l0.15-0.08c2.35-1.28,4.81-1.24,7.39,0.53l7.17,6.98l0.11,0.11l6.6,6.42 c2.73,2.78,3.34,5.88,1.83,9.31l-19.35,50.75C24.02,112.99-0.34,87.94,0,49.73C19.23,55.35,37.75,57.19,54.04,46.81L54.04,46.81z"/>
                                </svg>
                            </div>
                        }
                        {
                            !!runningSlots.running.length && currentStage === EStages.EDIT &&
                            <div className={cn('Playground__button refreshButton')} title={translateText(dictionary, 'reset_timers')} onClick={handleRefresh}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
                                    <path d="M16.5 9C15.7381 9 15.3769 9.53688 15.25 10.1038C14.7931 12.1438 12.8544 15.25 9 15.25C5.54813 15.25 2.75 12.4512 2.75 9C2.75 5.54875 5.54813 2.75 9 2.75C10.4 2.75 11.6844 3.22063 12.725 4H11.5C10.81 4 10.25 4.56 10.25 5.25C10.25 5.94 10.81 6.5 11.5 6.5H15.25C15.94 6.5 16.5 5.94 16.5 5.25V1.5C16.5 0.81 15.94 0.25 15.25 0.25C14.56 0.25 14 0.81 14 1.5V1.82375C12.5831 0.8325 10.8606 0.25 9 0.25C4.1675 0.25 0.25 4.1675 0.25 9C0.25 13.8325 4.1675 17.75 9 17.75C15.2369 17.75 17.75 11.8125 17.75 10.3281C17.75 9.42 17.0863 9 16.5 9Z"/>
                                </svg>
                            </div>
                        }
                        {
                            currentStage === EStages.PLAY &&
                            <div className={cn('Playground__button')} title={translateText(dictionary, withSound ? 'with_sound' : 'without_sound')} onClick={() => handleMute(!withSound)}>
                                {
                                    withSound 
                                    ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 30">
                                        <path d="M19.0205 0.38368C20.6439 -0.65632 22.75 0.540469 22.75 2.50184V26.7489C22.75 28.7103 20.6439 29.9061 19.0205 28.8661L7.3125 22.7499V6.49989L19.0205 0.38368ZM31.4141 4.20888C31.7821 3.9522 32.2882 4.04201 32.5449 4.41005C34.6419 7.41627 35.75 10.9484 35.75 14.6249C35.75 18.3014 34.642 21.8335 32.5449 24.8397C32.3874 25.0663 32.1346 25.1873 31.8779 25.1874C31.7179 25.1874 31.5554 25.1399 31.4141 25.0409C31.046 24.7842 30.9553 24.2781 31.2119 23.91C33.1172 21.1785 34.125 17.9675 34.125 14.6249C34.125 11.2823 33.1172 8.07217 31.2119 5.33973C30.9552 4.97167 31.046 4.46563 31.4141 4.20888ZM5.6875 22.7499H2.84375C1.27322 22.7499 5.90119e-05 21.4767 0 19.9061V9.34364C0 7.77308 1.27319 6.49989 2.84375 6.49989H5.6875V22.7499ZM26.2236 8.38856C26.5917 8.13204 27.0978 8.22176 27.3545 8.58973C28.5943 10.365 29.249 12.4527 29.249 14.6268C29.2489 16.8008 28.5942 18.8878 27.3545 20.663C27.1969 20.8888 26.9442 21.0106 26.6875 21.0106L26.6885 21.0087C26.5276 21.0087 26.3658 20.9613 26.2236 20.8622C25.8556 20.6055 25.7658 20.0986 26.0225 19.7313C27.0705 18.2307 27.6249 16.4653 27.625 14.6259C27.625 12.7864 27.0706 11.0201 26.0225 9.51942C25.7661 9.15139 25.8557 8.64522 26.2236 8.38856Z" />
                                      </svg>
                                    : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 30">
                                        <path d="M2.30078 2.0811C2.72323 1.55711 3.48981 1.47414 4.01465 1.89653L33.2627 25.4571C33.7867 25.8795 33.8696 26.6479 33.4473 27.1719C33.2068 27.4709 32.8529 27.626 32.4971 27.626C32.229 27.626 31.9584 27.5376 31.7334 27.3565L22.749 20.1182V26.7481C22.7487 28.7139 20.6443 29.9081 19.0195 28.8682L7.3125 22.75V7.68266L2.48535 3.79497C1.96138 3.37254 1.87844 2.60512 2.30078 2.0811ZM31.4092 4.21098C31.7829 3.951 32.2862 4.04039 32.5381 4.41411C34.6423 7.42012 35.748 10.9538 35.748 14.626C35.748 17.7539 34.9431 20.7845 33.3994 23.4737L32.1162 22.4415C33.4323 20.0611 34.123 17.3801 34.123 14.626C34.123 11.2869 33.1153 8.06968 31.2061 5.33989C30.9543 4.97438 31.0438 4.47101 31.4092 4.21098ZM5.6875 22.75H2.84375C1.27348 22.75 0.000184906 21.4775 0 19.9073V9.34477C0.000235011 7.77457 1.27351 6.50207 2.84375 6.502H5.6875V22.75ZM26.2256 8.38677C26.5912 8.13491 27.0955 8.22429 27.3555 8.58989C28.5902 10.3691 29.248 12.4488 29.248 14.626C29.248 16.2589 28.8825 17.8349 28.1758 19.2647L26.8682 18.2168C27.3637 17.0958 27.623 15.8771 27.623 14.626C27.623 12.7899 27.0705 11.0184 26.0225 9.52348C25.763 9.14992 25.8523 8.6467 26.2256 8.38677ZM19.0195 0.383836C20.6444 -0.65604 22.749 0.538842 22.749 2.50493V14.8946L10.3594 4.90923L19.0195 0.383836Z" />
                                      </svg>
                                }
                            </div>
                        }
                    </div>

                    { currentStage !== EStages.INITIAL && <CountdownEditor /> }

                    {
                        currentStage === EStages.EDIT &&
                        <div className={cn('Playground__button play')} onClick={() => changeStage(EStages.PLAY)} title={translateText(dictionary, 'start_mode')}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 26" >
                                <path d="M23 0C23.5523 0 24 0.447715 24 1V25C24 25.5523 23.5523 26 23 26H12C11.4477 26 11 25.5523 11 25V23C11 22.4477 11.4477 22 12 22H20V4H12C11.4477 4 11 3.55228 11 3V1C11 0.447715 11.4477 2.0133e-08 12 0H23Z" />
                                <path d="M0.5 5.20605C0.5 4.43625 1.33333 3.95494 2 4.33984L15.5 12.1338C16.1667 12.5187 16.1667 13.4813 15.5 13.8662L2 21.6602C1.33333 22.0451 0.5 21.5637 0.5 20.7939V5.20605Z" />
                            </svg>
                        </div>
                    }
                    {
                        currentStage === EStages.PLAY && 
                        <div className={cn('Playground__button')} onClick={() => changeStage(EStages.EDIT)} title={translateText(dictionary, 'setup_mode')}>
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
                                            <Timer ability={slot}
                                                    appStatus={appStatus} 
                                                    runApp={handleClickPlay}
                                                    pauseApp={handleClickPause}
                                                    currentStage={currentStage}
                                                    removeTimer={removeTimer}
                                                    withSound={withSound}/>
                                        {
                                            currentStage === EStages.EDIT ?
                                            <div className="Playground__slotSettings">
                                                <LevelController slot={slot}
                                                                    editLevelController={editLevelController}
                                                                    cancelEditLevelController={cancelEditLevelController}
                                                                    isEdit={editLevelControllers.includes(slot.position)} />
                                                { !editLevelControllers.includes(slot.position) && !slot.customCooldown && slot.type !== EAbility.FEATURES && <SpellReducer slot={slot}/> }
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
      </StageContext.Provider>
    </div>
    )
}

export default Playground;
