import React, { JSX, useState, useCallback, useEffect, useRef, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import cn from 'classnames';
import {TStoreState} from '../../../store/store';
import EmptySlot from '../../../components/GridSlot/EmptySlot';
import ConstructorComponent from '../../../components/ConstructorComponent/ConstructorComponent';
import {EAbility, ITimerData} from '../../../data/data';
import {removeTimerFromSlot, mapSpellToSlot, mapItemToSlot, mapFeatureToSlot, resetState, ISlot} from '../../../store/slotSlice';
import { addRefresh } from '../../../store/refreshSlice';
import StageContext, {EStages} from '../../../widgets/playground/model/stage-context';
import Timer from '../../../components/Timer/Timer';
import LevelController from '../../../components/LevelController/LevelController';
import LevelControllerView from '../../../components/LevelController/LevelControllerView';
import SpellReducer from '../../../components/SpellReducer/SpellReducer';
import BindingOverlay from '../../../components/BindingOverlay/BindingOverlay';
import CountdownEditor from '../../../components/CountdownEditor/CountdownEditor';
import Notification from '../../../components/Notification/Notification';
import { translateText } from '../../../utils/utils';
import { playSound, SOUND } from '../../../utils/sound';
import ImageCover from '../../../components/ImageCover/ImageCover';
import { EAppStatus } from '../../../widgets/playground/model/app-status';
import './SettingsStage.scss';
import SpriteIcon from '@shared/ui/SpriteIcon';

const SettingsStage = (): JSX.Element => {
    // TODO - нужно сделать нормальную функцию сравнения или по другому использовать стейт
    const slotList = useSelector((state: TStoreState) => state.slotList, (prev, next) => JSON.stringify(prev) === JSON.stringify(next));
    const runningSlots = useSelector((state: TStoreState) => state.runningSlice);
    const someOneIsBinding = useSelector((state: TStoreState) => state.bindingSlice.value);

    const [currentSlot, setCurrnetSlot] = useState<ISlot | null>(null);
    const {currentStage, changeStage} = useContext(StageContext);
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
                                <SpriteIcon id="pages-playgroundpage-settingsstage-settingsstage-1" />
                            </div>
                        }
                        {
                            !!runningSlots.running.length && currentStage === EStages.EDIT &&
                            <div className={cn('Playground__button refreshButton')} title={translateText(dictionary, 'reset_timers')} onClick={handleRefresh}>
                                <SpriteIcon id="pages-playgroundpage-settingsstage-settingsstage-2" />
                            </div>
                        }
                        {
                            currentStage === EStages.PLAY &&
                            <div className={cn('Playground__button')} title={translateText(dictionary, withSound ? 'with_sound' : 'without_sound')} onClick={() => handleMute(!withSound)}>
                                {
                                    withSound 
                                    ? <SpriteIcon id="pages-playgroundpage-settingsstage-settingsstage-3" />
                                    : <SpriteIcon id="pages-playgroundpage-settingsstage-settingsstage-4" />
                                }
                            </div>
                        }
                    </div>

                    { currentStage !== EStages.INITIAL && <CountdownEditor /> }

                    {
                        currentStage === EStages.EDIT &&
                        <div className={cn('Playground__button play')} onClick={() => changeStage(EStages.PLAY)} title={translateText(dictionary, 'start_mode')}>
                            <SpriteIcon id="pages-playgroundpage-settingsstage-settingsstage-5" />
                        </div>
                    }
                    {
                        currentStage === EStages.PLAY && 
                        <div className={cn('Playground__button')} onClick={() => changeStage(EStages.EDIT)} title={translateText(dictionary, 'setup_mode')}>
                            <SpriteIcon id="pages-playgroundpage-settingsstage-settingsstage-6" />
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
    )
}

export default SettingsStage;

