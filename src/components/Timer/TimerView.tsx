import React, { JSX, useEffect, useRef, useState, useContext, useCallback, useLayoutEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {TStoreState} from '../../store/store';
import {createPortal} from 'react-dom';
import cn from 'classnames';
import {addRunning, removeRunning} from '../../store/runningSlice';
import {removeShift, EDirection, IShift} from '../../store/shiftSlice';
import {EStages} from '../../store/StageContext';
import { ITimerData } from '../../data/data';
import { EAppStatus } from '../../pages/PlaygroundPage/SettingsStage/SettingsStage';
import fetchData from '../../data/data';
import { IRefresh, removeRefresh } from '../../store/refreshSlice';
import { getKeyFromCode } from '../../data/keyCodeDictionary';
import {setHotkey} from '../../store/hotkeySlice';
import { setBindingSlice } from '../../store/bindingSlice';
import { translateText } from '../../utils/utils';
import { playSound, preloadSound, unlockAudio, AUTOEND, END_SOUND, RUN_SOUND, SOUND } from '../../utils/sound';
import TimerCircle from './components/TimerCircle';
import AnimatedBorder from './components/AnimatedBorder';
import './Timer.scss';
import ArtifactsOwner from './components/ArtifactsOwner';
import HotkeyHint from './components/HotkeyHint';
import PlayButton from './components/PlayButton';
import SpellTools from './components/SpellTools';

interface IProps {
    ability: ITimerData
    appStatus: EAppStatus
    runApp: () => any
    pauseApp: () => any
    currentStage: EStages
    removeTimer: (slot: ITimerData) => void
    withSound?: boolean
}

export enum ETimerStatus {
    READY = 'ready',
    RUNNING = 'running',
    PAUSED = 'paused'
}

const STROKEWIDTH = 70
const RADIUS = 35
const LENGTH = 2 * Math.PI * RADIUS

const TimerView = ({ability, appStatus, runApp, pauseApp, currentStage, removeTimer, withSound = true}: IProps): JSX.Element => {
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

    // Dangerous >>>
    const pixelStepRef = useRef<number>(0);
    const startIdRef = useRef<number | null>(null);
    const lastRenderRafRef = useRef<number | null>(null);
    const timeLeftRef = useRef<number>(initialCountdownRef.current);

    useEffect(() => {
        if (!ability) return;
        let _T = ability.customCooldown ? ability.customCooldown : ability.cooldown[ability.cooldownIndex];
        _T = 1000 * _T;
        const raf = (globalThis as any).frameRate;
        const _Nraf = _T / raf;
        const _l = LENGTH / _Nraf;
        pixelStepRef.current = _l;
    }, [ability]);
    // Dangerous <<<

    useEffect(() => {
        if (timerRef.current?.parentNode) setOuterContainer(timerRef.current?.parentNode as Element); // чтобы renderControls корректно отрисовал содержимое
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    useEffect(()=> {
        const nextInitialCountdown = ability.customCooldown ? ability.customCooldown : ability.cooldown[ability.cooldownIndex];
        boundKeyRef.current = ability.boundKey;

        if (nextInitialCountdown === initialCountdownRef.current) return;
        
        initialCountdownRef.current = nextInitialCountdown;
        // nextStepRef.current = LENGTH / (COUNT_OF_BLINKS_EQUIVALENT_TO_ONE_SECOND * nextInitialCountdown);

        // if (timerStatusRef.current === ETimerStatus.READY) refreshTimer();
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
        // if (timerStatusRef.current === ETimerStatus.PAUSED) shiftTimer();
        if (timerStatusRef.current === ETimerStatus.READY) dispatch(removeShift({position: ability.position}));
    }, [shiftSlice]);

    useEffect(() => {
        refreshRef.current = refreshSlice;
        // if (refreshRef.current.value) refreshTimer();
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

    // const shiftTimer = useCallback(() => {

    //     if (!shiftRef.current?.value || !circleRef.current || !initialCountdownRef.current) return;

    //     const {direction, value} = shiftRef.current;
    //     const _strokeDashoffset = strokeDashoffsetRef.current;

    //     if (direction === EDirection.FORWARD) {
    //         if (value >= currentCountdownRef.current) return refreshTimer();

    //         currentCountdownRef.current = currentCountdownRef.current - value;

    //         const nextStrokeDashoffset = _strokeDashoffset + (stepRef.current * COUNT_OF_BLINKS_EQUIVALENT_TO_ONE_SECOND * value);

    //         strokeDashoffsetRef.current = nextStrokeDashoffset < LENGTH ? nextStrokeDashoffset : (LENGTH - nextStrokeDashoffset);

    //         circleRef.current.style.strokeDashoffset = `${strokeDashoffsetRef.current}`;

    //         setCurrentCountdown(currentCountdownRef.current);
    //         return dispatch(removeShift({position: ability.position}));
    //     } 

    //     if (currentCountdownRef.current + value >= initialCountdownRef.current) {

    //         currentCountdownRef.current = initialCountdownRef.current;
    //         strokeDashoffsetRef.current = 0;
    //         circleRef.current.style.strokeDashoffset = `${strokeDashoffsetRef.current}`;
    //         setCurrentCountdown(currentCountdownRef.current);
    //         return dispatch(removeShift({position: ability.position}));
    //     }

    //     currentCountdownRef.current = currentCountdownRef.current + value;
    //     const nextStrokeDashoffset = _strokeDashoffset - (stepRef.current * COUNT_OF_BLINKS_EQUIVALENT_TO_ONE_SECOND * value);
    //     strokeDashoffsetRef.current = nextStrokeDashoffset <= 0 ? 0 : nextStrokeDashoffset;
    //     circleRef.current.style.strokeDashoffset = `${strokeDashoffsetRef.current}`;
    //     setCurrentCountdown(currentCountdownRef.current);
    //     return dispatch(removeShift({position: ability.position}));

    // }, []);

    // const refreshTimer = useCallback((autoend?: any) => {
    //     if (!circleRef.current) return;

    //     timerStatusRef.current = ETimerStatus.READY;
    //     currentCountdownRef.current = initialCountdownRef.current;
    //     stepRef.current = nextStepRef.current;

    //     if (autoend === AUTOEND) playSoundDecorator(END_SOUND);

    //     setTimerStatus(timerStatusRef.current);
    //     setCurrentCountdown(currentCountdownRef.current);

    //     const timeOutId = setTimeout(() => {
    //         if (!circleRef.current) return;

    //         circleRef.current.style.display = 'none';
    //         strokeDashoffsetRef.current = 0;
    //         circleRef.current.style.strokeDashoffset = `${strokeDashoffsetRef.current}`;
    //         clearTimeout(timeOutId);
    //     }, 10);

    //     setAnimateIndicator(true);
    //     dispatch(removeRunning({value: ability.position}));
    //     dispatch(removeShift({position: ability.position}));
    //     dispatch(removeRefresh({position: ability.position}));
    // }, []);


    const moveRaf = () => {
        if (!circleRef.current) return
        const currentTime = Date.now();
        let possibleOffset = strokeDashoffsetRef.current + pixelStepRef.current;

        if (lastRenderRafRef.current) {
            const timeDiff = currentTime - (lastRenderRafRef.current as number);
            const lostNraf = timeDiff / (globalThis as any).frameRate;
            const lostPixels = lostNraf * pixelStepRef.current;
            possibleOffset = lostPixels + strokeDashoffsetRef.current;
        }

        lastRenderRafRef.current = currentTime;


        if (possibleOffset >= LENGTH) {
            strokeDashoffsetRef.current = LENGTH;
            circleRef.current.style.strokeDashoffset = `${strokeDashoffsetRef.current}`;
            timerStatusRef.current = ETimerStatus.READY;
            cancelAnimationFrame(startIdRef.current as number);
            startIdRef.current = null;

            return requestAnimationFrame(() => {
                if (!circleRef.current) return
                circleRef.current.style.visibility = 'hidden';
                strokeDashoffsetRef.current = 0;
                lastRenderRafRef.current = null;
            })
        } 
        
        strokeDashoffsetRef.current = possibleOffset;
        circleRef.current.style.strokeDashoffset = `${strokeDashoffsetRef.current}`;
        startIdRef.current = requestAnimationFrame(moveRaf);
    }

    const handleClickTimer = () => {
        if (!circleRef.current) return;

        // Разблокируем аудио контекст на первое действие пользователя
        // unlockAudio();

        if (timerStatusRef.current === ETimerStatus.READY) {
            timerStatusRef.current = ETimerStatus.RUNNING;

            setAnimateIndicator(false); //TODO как работает обновление состояния относительно CRP ?
                                         //TODO как работает обновление состояния относительно CRP ?
                                            //TODO как работает обновление состояния относительно CRP ?

            return requestAnimationFrame(() => {
                if (!circleRef.current) return
                circleRef.current.style.display = 'block';
                lastRenderRafRef.current = Date.now();
                startIdRef.current = requestAnimationFrame(moveRaf);
            })
        }

        if (timerStatusRef.current === ETimerStatus.RUNNING) {
            timerStatusRef.current = ETimerStatus.PAUSED;
            cancelAnimationFrame(startIdRef.current as number);
            // pauseApp();
            // return setTimerStatus(timerStatusRef.current);
            return;
        }

        if (timerStatusRef.current === ETimerStatus.PAUSED) {
            timerStatusRef.current = ETimerStatus.RUNNING;
            startIdRef.current = requestAnimationFrame(moveRaf);
            return 
        }

        // timerStatusRef.current = ETimerStatus.RUNNING;
        // setAnimateIndicator(false);
        // setTimerStatus(timerStatusRef.current);
        // playSoundDecorator(RUN_SOUND);
        // runApp();
        // dispatch(addRunning({value: ability.position}));
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


    const dirtyShiftFunction = (value: number) => {
        // value - должно быть задано в секундах.

        requestAnimationFrame(() => {
            if (!circleRef.current) return
            const piece = LENGTH / initialCountdownRef.current;
            const _shiftValue = value * piece;
            strokeDashoffsetRef.current = strokeDashoffsetRef.current + _shiftValue;
            circleRef.current.style.strokeDashoffset = `${strokeDashoffsetRef.current}`;
        })
    }


    const dirtyShiftCountdown = () => {
        const totalTimeMS = initialCountdownRef.current;
        const currentRenderTimeStamp = Date.now();
        const startTimerTimeStamp = timeLeftRef.current;
        const timeLeft =  Math.floor(totalTimeMS - (currentRenderTimeStamp - startTimerTimeStamp));
    }


    // --> 02.02.26
    const isTimeToShowBorder = currentStage === EStages.PLAY && timerStatus === ETimerStatus.READY;
    const isTimeToShowHotkeyHint = currentStage === EStages.PLAY;
    const isTimerToShowPlayButton = currentStage === EStages.PLAY;
    const isTimerToShowSpellTools = currentStage === EStages.EDIT && !!outerContainer;
    // <-- 02.02.26

    const [run, setRun] = useState<string | false>(false)
    const [shiftPropForCircle, setShift] = useState<string | number | false>(false)

    // const getShiftFromTimeController = () => {

    // }

    const setRunTrigger = () => {
        // полагаю нужно в самом TimerCircle слушать из контекста изменение shiftPropForCircle, а не менять пропс тут, но это дело стейта - это завтра все
        // false нужен чтобы при первом получении shift - не сработал ненужный скачок
        if (!run) return setRun('run')
        if (!shiftPropForCircle) return setShift(3)
        // const shiftPropForCircle = getShiftFromTimeController()
        if (typeof shiftPropForCircle === 'string') return setShift(-3)
        return setShift('-3')
    }

    return <div className="Timer" style={{backgroundImage: `url("${ability.img}")`}} ref={timerRef}>
        
                { currentHero && <ArtifactsOwner name={currentHero.name} img={currentHero.img}/> }
                { isTimeToShowHotkeyHint && <HotkeyHint hotkey={hotkey} isKeyPressed={keyPressed} /> }

                <div className="Timer__innerWrapper">
                    <TimerCircle
                        outerRunTrigger={ run }
                        outerStopTrigger={ false }
                        outerResetTrigger={ false }
                        correctiveShift={ shiftPropForCircle }

                        onRun={ () => { console.log('runned') } }
                        onStop={ () => { console.log('stoped') } }
                        onReset={ () => { console.log('reseted') } }

                        countDownProp={initialTime}
                        circleRef={circleRef}

                        strokeWidth={STROKEWIDTH}
                        radius={RADIUS}
                        strokeDashoffset={0}
                    />

                    { isTimerToShowPlayButton && <PlayButton onClick={setRunTrigger} timerStatus={timerStatus}/> }

                    {
                        isTimerToShowSpellTools &&
                        <SpellTools isBinding={isBinding} 
                                    keyPressed={keyPressed} 
                                    handleBindKey={handleBindKey} 
                                    hotkey={hotkey} 
                                    timerStatus={timerStatus} 
                                    removeTimer={removeTimer} 
                                    ability={ability} 
                                    outerContainer={outerContainer} />
                    }

                    { isTimeToShowBorder && <AnimatedBorder outerContainer={outerContainer} isAnimated={animateIndicator} /> }
                </div>
    </div>
}

export default TimerView;