// 1. Внешние зависимости.
// 2. Компоненты вашего проекта.
// 3. Утилиты и бизнес-логика.
// 4. Стили и ассеты.

import React, { JSX, useEffect, useRef, useState, useContext, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {TStoreState} from '../../store/store';
import {createPortal} from 'react-dom';
import cn from 'classnames';
import TickNotifier, {COUNT_OF_BLINKS_EQUIVALENT_TO_ONE_SECOND} from '../../utils/TickNotifier';
// import { IDataItem, ISpells, IArtifacts, TMixedDataItem } from '../../data/data';
import {addRunning, removeRunning} from '../../store/runningSlice';
import {removeShift, EDirection, IShift} from '../../store/shiftSlice';
import StageContext, {EStages} from '../../store/StageContext';
import { ITimerData } from '../../data/data';
import { EAppStatus } from '../Playground/SettingsStage/SettingsStage';
import fetchData from '../../data/data';
import './Timer.scss';
import { IRefresh, removeRefresh } from '../../store/refreshSlice';
import { getKeyFromCode } from '../../data/keyCodeDictionary';
import {setHotkey} from '../../store/hotkeySlice';
import { setBindingSlice } from '../../store/bindingSlice';


interface IProps {
    ability: ITimerData
    appStatus: EAppStatus
    runApp: () => any
    pauseApp: () => any
    currentStage: EStages
    removeTimer: (slot: ITimerData) => void
}

enum ETimerStatus {
    READY = 'ready',
    RUNNING = 'running',
    PAUSED = 'paused'
}

const STROKEWIDTH = 70;
const RADIUS = 35;
const LENGTH = 2 * Math.PI * RADIUS;

const DumbTimer = ({ability, appStatus, runApp, pauseApp, currentStage, removeTimer}: IProps): JSX.Element => {
    if (!ability) throw new Error('ability not found [Timer]');
    const dispatch = useDispatch();

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

    const [animateIndicator, setAnimateIndicator] = useState<boolean>(false);

    const{ heroes } = fetchData;
    const currentHero = ability.owner ? heroes.find(hero => hero.name === ability.owner) : null;

    const timerRef = useRef<HTMLDivElement | null>(null);
    const bindingRef = useRef<boolean>(someOneIsBinding);
    const boundKeyRef = useRef<string>(ability.boundKey);
    const isTypingRef = useRef<boolean>(!!typigEntitiesSlice.entities.length);
    const shiftRef = useRef<IShift | null>(shiftSlice);
    const refreshRef = useRef<IRefresh>(refreshSlice);

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
            return currentCountdownRef.current === 0 ? refreshTimer() : setCurrentCountdown(currentCountdownRef.current);
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

    const refreshTimer = useCallback(() => {
        if (!circleRef.current) return;

        timerStatusRef.current = ETimerStatus.READY;
        currentCountdownRef.current = initialCountdownRef.current;
        stepRef.current = nextStepRef.current;

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
                            fill="transparent"/>
                    </svg>

                    <div className="Timer__countdown">{currentCountdown}</div>
                    
                    {
                        currentStage === EStages.PLAY &&
                        <div className="Timer__cover" onClick={handleClickTimer}>
                            <div className={cn('Timer__play')}>
                                {
                                    timerStatus === ETimerStatus.RUNNING ?
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 42">
                                            <path d="M9 3C9 1.34315 10.3431 0 12 0H18C19.6569 0 21 1.34315 21 3V39C21 40.6569 19.6569 42 18 42H12C10.3431 42 9 40.6569 9 39V3Z" />
                                            <path d="M29 3C29 1.34315 30.3431 0 32 0H38C39.6569 0 41 1.34315 41 3V39C41 40.6569 39.6569 42 38 42H32C30.3431 42 29 40.6569 29 39V3Z" />
                                        </svg>
                                    :
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 27 30">
                                            <path d="M24.9 12.1623C26.9 13.317 26.9 16.2038 24.9 17.3585L4.5594 29.1021C2.5594 30.2568 0.0594025 28.8134 0.0594025 26.504V3.01675C0.0594025 0.707349 2.5594 -0.736029 4.5594 0.418672L24.9 12.1623Z"/>
                                        </svg>
                                }
                            </div>
                        </div>
                    }

                    {
                        currentStage === EStages.EDIT && !!outerContainer &&
                        createPortal(
                            <React.Fragment>

                                <div className={cn('Timer__slotHotkey', {isBinding: isBinding, highlight: keyPressed})} onClick={handleBindKey} title={hotkey}>
                                    <div className='Timer__slotHotKeyTextBox'>
                                        <span className="Timer__slotHotKeyText">
                                            { isBinding ? <span>...</span> : hotkey }
                                        </span>
                                    </div>
                                </div>

                                <div className="Timer__controls">
                                    <div className={cn('Timer__controlButton refresh', {hidden: timerStatus === ETimerStatus.READY})} onClick={refreshTimer}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
                                            <path d="M16.5 9C15.7381 9 15.3769 9.53688 15.25 10.1038C14.7931 12.1438 12.8544 15.25 9 15.25C5.54813 15.25 2.75 12.4512 2.75 9C2.75 5.54875 5.54813 2.75 9 2.75C10.4 2.75 11.6844 3.22063 12.725 4H11.5C10.81 4 10.25 4.56 10.25 5.25C10.25 5.94 10.81 6.5 11.5 6.5H15.25C15.94 6.5 16.5 5.94 16.5 5.25V1.5C16.5 0.81 15.94 0.25 15.25 0.25C14.56 0.25 14 0.81 14 1.5V1.82375C12.5831 0.8325 10.8606 0.25 9 0.25C4.1675 0.25 0.25 4.1675 0.25 9C0.25 13.8325 4.1675 17.75 9 17.75C15.2369 17.75 17.75 11.8125 17.75 10.3281C17.75 9.42 17.0863 9 16.5 9Z"/>
                                        </svg>
                                    </div>
                                    <div className="Timer__controlButton remove" onClick={() => removeTimer(ability)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 22">
                                            <path d="M8.05801 9.125C8.61029 9.125 9.05801 9.57271 9.05801 10.125V15.875C9.05783 16.4271 8.61018 16.875 8.05801 16.875C7.50598 16.8748 7.05818 16.427 7.05801 15.875V10.125C7.05801 9.57282 7.50587 9.12518 8.05801 9.125Z" />
                                            <path d="M11.892 9.125C12.4441 9.12518 12.892 9.57282 12.892 10.125V15.875C12.8918 16.427 12.444 16.8748 11.892 16.875C11.3398 16.875 10.8922 16.4271 10.892 15.875V10.125C10.892 9.57271 11.3397 9.125 11.892 9.125Z" />
                                            <path fillRule="evenodd" clipRule="evenodd" d="M11.892 0.5C12.6654 0.500086 13.4076 0.807588 13.9545 1.35449C14.5012 1.90143 14.809 2.64367 14.809 3.41699V4.33301H18.6L18.7025 4.33789C19.2067 4.38922 19.6 4.81533 19.6 5.33301C19.6 5.85068 19.2067 6.27679 18.7025 6.32812L18.6 6.33301H17.684V18.75C17.6839 19.5234 17.3764 20.2656 16.8295 20.8125C16.2826 21.3594 15.5404 21.6669 14.767 21.667H5.18398C4.41067 21.667 3.66842 21.3592 3.12148 20.8125C2.64292 20.3339 2.34798 19.7057 2.28164 19.0381L2.26699 18.75V6.33301H1.35C0.797715 6.33301 0.35 5.88529 0.35 5.33301C0.35 4.78072 0.797715 4.33301 1.35 4.33301H5.14199V3.41699C5.14199 2.64344 5.4495 1.90147 5.99648 1.35449C6.54347 0.807511 7.28544 0.5 8.05898 0.5H11.892ZM4.26699 18.75L4.27187 18.8408C4.29283 19.0504 4.38527 19.2482 4.53555 19.3984C4.70741 19.57 4.9411 19.667 5.18398 19.667H14.767C15.01 19.6669 15.2436 19.5703 15.4154 19.3984C15.5873 19.2266 15.6839 18.993 15.684 18.75V6.33301H4.26699V18.75ZM8.05898 2.5C7.81587 2.5 7.58246 2.59665 7.41055 2.76855C7.23864 2.94046 7.14199 3.17388 7.14199 3.41699V4.33301H12.809V3.41699C12.809 3.17411 12.712 2.94042 12.5404 2.76855C12.3686 2.59672 12.135 2.50009 11.892 2.5H8.05898Z" />
                                        </svg>
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

export default DumbTimer;