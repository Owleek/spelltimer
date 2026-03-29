import React, { JSX, useEffect, useRef, useState, useContext, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {TStoreState} from '../../store/store';
import {createPortal} from 'react-dom';
import cn from 'classnames';
import TickNotifier, {COUNT_OF_BLINKS_EQUIVALENT_TO_ONE_SECOND} from '../../utils/TickNotifier';
import {addRunning, removeRunning} from '../../store/runningSlice';
import {removeShift, EDirection, IShift} from '../../store/shiftSlice';
import {EStages} from '../../widgets/playground/model/stage-context';
import { ITimerData } from '../../data/data';
import { EAppStatus } from '../../widgets/playground/model/app-status';
import fetchData from '../../data/data';
import { IRefresh, removeRefresh } from '../../store/refreshSlice';
import { getKeyFromCode } from '../../data/keyCodeDictionary';
import {setHotkey} from '../../store/hotkeySlice';
import { setBindingSlice } from '../../store/bindingSlice';
import { translateText } from '../../utils/utils';
import { playSound, preloadSound, unlockAudio, AUTOEND, END_SOUND, RUN_SOUND, SOUND } from '../../utils/sound';
import './Timer.scss';
import SpriteIcon from '@shared/ui/SpriteIcon';

interface IProps {
    ability: ITimerData
    appStatus: EAppStatus
    runApp: () => any
    pauseApp: () => any
    currentStage: EStages
    removeTimer: (slot: ITimerData) => void
    withSound?: boolean
}

enum ETimerStatus {
    READY = 'ready',
    RUNNING = 'running',
    PAUSED = 'paused'
}

const STROKEWIDTH = 70;
const RADIUS = 35;
const LENGTH = 2 * Math.PI * RADIUS;

const Timer = ({ability, appStatus, runApp, pauseApp, currentStage, removeTimer, withSound = true}: IProps): JSX.Element => {
    if (!ability) throw new Error('ability not found [Timer]');
    const dispatch = useDispatch();

    const {dictionary} = useSelector((state: TStoreState) => state.localeSlice);

    const typigEntitiesSlice = useSelector((state: TStoreState) => state.typingSlice);
    const shiftSlice = useSelector((state: TStoreState) => state.shiftSlice[`slot_${ability.position}`]);
    const refreshSlice = useSelector((state: TStoreState) => state.refreshSlice[`slot_${ability.position}`]);
    const someOneIsBinding = useSelector((state: TStoreState) => state.bindingSlice.value);

    const [outerContainer, setOuterContainer] = useState<Element | null>(null);

    const initialTime = ability.customCooldown ? ability.customCooldown : ability.cooldown[ability.cooldownIndex];
    
    const initialCountdownRef = useRef<number>(initialTime);

    const [currentCountdown, setCurrentCountdown] = useState<number>(initialTime);
    const currentCountdownRef = useRef<number>(initialTime);

    const countMSRef = useRef<number>(0);

    const step = LENGTH / (COUNT_OF_BLINKS_EQUIVALENT_TO_ONE_SECOND * initialCountdownRef.current);
    const nextStepRef = useRef<number>(step);
    const stepRef = useRef<number>(step);

    const circleRef = useRef<SVGCircleElement | null>(null);
    const strokeDashoffsetRef = useRef<number>(0);

    const [timerStatus, setTimerStatus] = useState<ETimerStatus>(ETimerStatus.READY);
    const timerStatusRef = useRef<ETimerStatus>(ETimerStatus.READY);

    const [isBinding, setIsBinding] = useState<boolean>(false);
    const [keyPressed, setKeyPressed] = useState<boolean>(false);

    const [animateIndicator, setAnimateIndicator] = useState<boolean>(true);

    const{ heroes } = fetchData;
    const currentHero = ability.owner ? heroes.find(hero => hero.name === ability.owner) : null;

    const timerRef = useRef<HTMLDivElement | null>(null);
    const bindingRef = useRef<boolean>(someOneIsBinding);
    const boundKeyRef = useRef<string>(ability.boundKey);
    const isTypingRef = useRef<boolean>(!!typigEntitiesSlice.entities.length);
    const shiftRef = useRef<IShift | null>(shiftSlice);
    const refreshRef = useRef<IRefresh>(refreshSlice); 
    const withSoundRef = useRef<boolean>(withSound);

    useEffect(() => {
        if (timerRef.current?.parentNode) setOuterContainer(timerRef.current?.parentNode as Element); // чтобы renderControls корректно отрисовал содержимое

        const instance = TickNotifier.getInstance();
        instance.subscribe(onTickNotify);
        document.addEventListener('visibilitychange', onVisibilityChange);
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        return () => {
            instance.unsubscribe(onTickNotify);
            document.removeEventListener('visibilitychange', onVisibilityChange);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    useEffect(()=> {
        const nextInitialCountdown = ability.customCooldown ? ability.customCooldown : ability.cooldown[ability.cooldownIndex];
        boundKeyRef.current = ability.boundKey;

        if (nextInitialCountdown === initialCountdownRef.current) return;
        
        initialCountdownRef.current = nextInitialCountdown;
        nextStepRef.current = LENGTH / (COUNT_OF_BLINKS_EQUIVALENT_TO_ONE_SECOND * nextInitialCountdown);

        if (timerStatusRef.current === ETimerStatus.READY) refreshTimer();
    }, [ability]);

    useEffect(() => {

        if ((appStatus === EAppStatus.PAUSED) && timerStatusRef.current === ETimerStatus.RUNNING) {
            timerStatusRef.current = ETimerStatus.PAUSED;
        }

        if ((appStatus === EAppStatus.RUNNING) && timerStatusRef.current === ETimerStatus.PAUSED) {
            timerStatusRef.current = ETimerStatus.RUNNING;
        }

        setTimerStatus(timerStatusRef.current);

    }, [appStatus]);

    useEffect(() => {
        bindingRef.current = someOneIsBinding;
    }, [someOneIsBinding]);

    useEffect(() => {
        isTypingRef.current = !!typigEntitiesSlice.entities.length;
    }, [typigEntitiesSlice]);

    useEffect(() => {
        shiftRef.current = shiftSlice;
        if (timerStatusRef.current === ETimerStatus.PAUSED) shiftTimer();
        if (timerStatusRef.current === ETimerStatus.READY) dispatch(removeShift({position: ability.position}));
    }, [shiftSlice]);

    useEffect(() => {
        refreshRef.current = refreshSlice;
        if (refreshRef.current.value) refreshTimer();
    }, [refreshSlice]);

    useEffect(() => {
        withSoundRef.current = withSound;
    }, [withSound]);

    // Preload sounds asap and unlock audio context on first gesture
    useEffect(() => {
        // Предзагрузка снижает задержку до ~0ms при старте/окончании
        preloadSound(RUN_SOUND);
        preloadSound(END_SOUND);
        preloadSound(SOUND);
    }, []);

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.code !== boundKeyRef.current || bindingRef.current || isTypingRef.current) return;
        setKeyPressed(true);
    }, []);

    const handleKeyUp = useCallback((event: KeyboardEvent) => {
        if (event.code !== boundKeyRef.current || bindingRef.current || isTypingRef.current) return;
        setKeyPressed(false);
        handleClickTimer();
    }, []);

    const onTickNotify = useCallback(() => {
        if (timerStatusRef.current !== ETimerStatus.RUNNING || !circleRef.current) return;

        const _strokeDashoffset = strokeDashoffsetRef.current;

        if (shiftRef.current?.value) return shiftTimer();

        if (countMSRef.current === COUNT_OF_BLINKS_EQUIVALENT_TO_ONE_SECOND) {
            countMSRef.current = 0;
            currentCountdownRef.current -= 1;
            return currentCountdownRef.current === 0 ? refreshTimer(AUTOEND) : setCurrentCountdown(currentCountdownRef.current);
        }

        countMSRef.current += 1;
        strokeDashoffsetRef.current += _strokeDashoffset + stepRef.current < LENGTH ? stepRef.current : LENGTH - _strokeDashoffset;
        circleRef.current.style.strokeDashoffset = `${strokeDashoffsetRef.current}`;
    }, []);

    const onVisibilityChange = () => {
        if (!circleRef.current) return;

        if (document.hidden) {
            return circleRef.current.classList.remove('transition');
        }

        const timeoutID = setTimeout(() => {
            if (!circleRef.current) return;
            circleRef.current.classList.add('transition');
            clearTimeout(timeoutID);
        }, 10);
    }

    const shiftTimer = useCallback(() => {

        if (!shiftRef.current?.value || !circleRef.current || !initialCountdownRef.current) return;

        const {direction, value} = shiftRef.current;
        const _strokeDashoffset = strokeDashoffsetRef.current;

        if (direction === EDirection.FORWARD) {
            if (value >= currentCountdownRef.current) return refreshTimer();

            currentCountdownRef.current = currentCountdownRef.current - value;

            const nextStrokeDashoffset = _strokeDashoffset + (stepRef.current * COUNT_OF_BLINKS_EQUIVALENT_TO_ONE_SECOND * value);

            strokeDashoffsetRef.current = nextStrokeDashoffset < LENGTH ? nextStrokeDashoffset : (LENGTH - nextStrokeDashoffset);

            circleRef.current.style.strokeDashoffset = `${strokeDashoffsetRef.current}`;

            setCurrentCountdown(currentCountdownRef.current);
            return dispatch(removeShift({position: ability.position}));
        } 

        if (currentCountdownRef.current + value >= initialCountdownRef.current) {

            currentCountdownRef.current = initialCountdownRef.current;
            strokeDashoffsetRef.current = 0;
            circleRef.current.style.strokeDashoffset = `${strokeDashoffsetRef.current}`;
            setCurrentCountdown(currentCountdownRef.current);
            return dispatch(removeShift({position: ability.position}));
        }

        currentCountdownRef.current = currentCountdownRef.current + value;
        const nextStrokeDashoffset = _strokeDashoffset - (stepRef.current * COUNT_OF_BLINKS_EQUIVALENT_TO_ONE_SECOND * value);
        strokeDashoffsetRef.current = nextStrokeDashoffset <= 0 ? 0 : nextStrokeDashoffset;
        circleRef.current.style.strokeDashoffset = `${strokeDashoffsetRef.current}`;
        setCurrentCountdown(currentCountdownRef.current);
        return dispatch(removeShift({position: ability.position}));

    }, []);

    const refreshTimer = useCallback((autoend?: any) => {
        if (!circleRef.current) return;

        timerStatusRef.current = ETimerStatus.READY;
        currentCountdownRef.current = initialCountdownRef.current;
        stepRef.current = nextStepRef.current;

        if (autoend === AUTOEND) playSoundDecorator(END_SOUND);

        setTimerStatus(timerStatusRef.current);
        setCurrentCountdown(currentCountdownRef.current);

        const timeOutId = setTimeout(() => {
            if (!circleRef.current) return;

            circleRef.current.style.display = 'none';
            strokeDashoffsetRef.current = 0;
            circleRef.current.style.strokeDashoffset = `${strokeDashoffsetRef.current}`;
            clearTimeout(timeOutId);
        }, 10);

        setAnimateIndicator(true);
        dispatch(removeRunning({value: ability.position}));
        dispatch(removeShift({position: ability.position}));
        dispatch(removeRefresh({position: ability.position}));
    }, []);

    const handleClickTimer = () => {
        // Разблокируем аудио контекст на первое действие пользователя
        unlockAudio();
        if ((timerStatusRef.current === ETimerStatus.READY) && circleRef.current) {
            circleRef.current.style.display = 'block';
        }

        if (timerStatusRef.current === ETimerStatus.RUNNING) {
            timerStatusRef.current = ETimerStatus.PAUSED;
            pauseApp();
            return setTimerStatus(timerStatusRef.current);
        }

        timerStatusRef.current = ETimerStatus.RUNNING;
        setAnimateIndicator(false);
        setTimerStatus(timerStatusRef.current);
        playSoundDecorator(RUN_SOUND);
        runApp();
        dispatch(addRunning({value: ability.position}));
    }

    const getKey = useCallback((event: KeyboardEvent) => {
        const keyIs = event.code;
        setIsBinding(false);
        dispatch(setBindingSlice(false));
        document.removeEventListener('keyup', getKey);
        if (keyIs === 'Escape') return;
        dispatch(setHotkey({key: keyIs, id: ability.position, type: 'slot'}));
    }, []);

    const handleBindKey = () => {
        setIsBinding(true);
        dispatch(setBindingSlice(true));
        document.addEventListener('keyup', getKey);
    }

    const hotkey = getKeyFromCode(ability.boundKey);

    const playSoundDecorator = useCallback((str: string) => playSound(str, withSoundRef.current), []);

    return <div className="Timer" style={{backgroundImage: `url("${ability.img}")`}} ref={timerRef}>
                {        
                    currentHero &&
                    <div className="Timer__ownerBox">
                        <img className="Timer__ownerImg" src={currentHero.img}/>
                        <span className="Timer__ownerName">{currentHero.name}</span>
                    </div>
                }
                {
                    currentStage === EStages.PLAY &&
                    <div className={cn('Timer__hint', {highlight: keyPressed})}>
                        <span className="Timer__hintText">{hotkey}</span>
                    </div>
                }
                <div className="Timer__innerWrapper">

                    <svg className="Timer__svg" viewBox="0 0 120 120">
                        <circle
                            className="Timer__circle transition"
                            ref={circleRef}
                            r={RADIUS}
                            strokeDasharray={LENGTH}
                            strokeWidth={STROKEWIDTH}
                            cx="60"
                            cy="60"
                            strokeDashoffset="0"
                            transform="rotate(-90 60 60)"
                            fill="transparent"
                        />
                    </svg>

                    <div className="Timer__countdown">{currentCountdown}</div>
                    
                    {
                        currentStage === EStages.PLAY &&
                        <div className="Timer__cover" onClick={handleClickTimer} title={translateText(dictionary, timerStatus === ETimerStatus.RUNNING ? 'pause' : 'start')}>
                            <div className={cn('Timer__play')}>
                                {
                                    timerStatus === ETimerStatus.RUNNING ?
                                        <SpriteIcon id="components-timer-timer-2" />
                                    :
                                        <SpriteIcon id="components-timer-timer-3" />
                                }
                            </div>
                        </div>
                    }

                    {
                        currentStage === EStages.EDIT && !!outerContainer &&
                        createPortal(
                            <React.Fragment>
                                <div className="Timer__disabled"></div>

                                <div className={cn('Timer__slotHotkey', {isBinding: isBinding, highlight: keyPressed})} onClick={handleBindKey} title={translateText(dictionary, 'hotkey_toggle_timer')}>
                                    <div className='Timer__slotHotKeyTextBox'>
                                        <span className="Timer__slotHotKeyText">
                                            { isBinding ? <span>...</span> : hotkey }
                                        </span>
                                    </div>
                                </div>

                                <div className="Timer__controls">
                                    <div className={cn('Timer__controlButton refresh', {hidden: timerStatus === ETimerStatus.READY})} onClick={refreshTimer} title={translateText(dictionary, 'reset_timer')}>
                                        <SpriteIcon id="components-timer-timer-4" />
                                    </div>
                                    <div className="Timer__controlButton remove" onClick={() => removeTimer(ability)} title={translateText(dictionary, 'delete')}>
                                        <SpriteIcon id="components-timer-timer-5" />
                                    </div>
                                </div>

                            </React.Fragment>
                            , outerContainer as Element)
                    }
                    {
                        currentStage === EStages.PLAY && timerStatus === ETimerStatus.READY &&
                        createPortal(
                        <div className={cn('Timer__statusBox', {animateIndicator})}>
                            <div className={cn('Timer__statusInnerWrapper')}>
                                <div className="Timer__statusIndicatorBackground"></div>
                                <div className="Timer__statusIndicatorBackground"></div>
                                <div className="Timer__statusIndicatorBackground"></div>
                                <div className="Timer__statusIndicatorBackground"></div>
                                <span className="Timer__statusIndicator"></span>
                                <span className="Timer__statusIndicator"></span>
                                <span className="Timer__statusIndicator"></span>
                                <span className="Timer__statusIndicator"></span>
                            </div>
                        </div>, outerContainer as Element)
                    }
                </div>
    </div>
}

export default Timer;