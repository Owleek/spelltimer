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
import SpellReducer from '../SpellReducer/SpellReducer';
import fetchData from '../../data/data';
import './Timer.scss';

interface IProps {
    ability: ITimerData
    appStatus: EAppStatus
    runApp: () => any
    pauseApp: () => any
    currentStage: EStages
    removeTimer: (slot: ITimerData) => void
    isBinding: boolean
}

enum ETimerStatus {
    READY = 'ready',
    RUNNING = 'running',
    PAUSED = 'paused'
}

const STROKEWIDTH = 70;
const RADIUS = 35;
const LENGTH = 2 * Math.PI * RADIUS;

const DumbTimer = ({ability, appStatus, runApp, pauseApp, currentStage, removeTimer, isBinding}: IProps): JSX.Element => {
    if (!ability) throw new Error('ability not found [Timer]');
    const dispatch = useDispatch();

    const typigEntitiesSlice = useSelector((state: TStoreState) => state.typingSlice);
    const shiftSlice = useSelector((state: TStoreState) => state.shiftSlice);

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

    const{ heroes } = fetchData;
    const currentHero = ability.owner ? heroes.find(hero => hero.name === ability.owner) : null;

    const timerRef = useRef<HTMLDivElement | null>(null);
    const bindingRef = useRef<boolean>(isBinding);
    const boundKeyRef = useRef<string>(ability.boundKey);
    const isTypingRef = useRef<boolean>(!!typigEntitiesSlice.entities.length);
    const shiftRef = useRef<IShift | null>(shiftSlice.shift);

    useEffect(() => {
        if (timerRef.current?.parentNode) setOuterContainer(timerRef.current?.parentNode as Element); // чтобы renderControls корректно отрисовал содержимое

        const instance = TickNotifier.getInstance();
        instance.subscribe(onTickNotify);
        document.addEventListener('visibilitychange', onVisibilityChange);
        document.addEventListener('keydown', onKeyDown);

        return () => {
            instance.unsubscribe(onTickNotify);
            document.removeEventListener('visibilitychange', onVisibilityChange);
            document.removeEventListener('keydown', onKeyDown);
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
        bindingRef.current = isBinding;
    }, [isBinding]);

    useEffect(() => {
        isTypingRef.current = !!typigEntitiesSlice.entities.length;
    }, [typigEntitiesSlice]);

    useEffect(() => {
        shiftRef.current = shiftSlice.shift;
        if (timerStatus === ETimerStatus.PAUSED) shiftTimer();
        if (timerStatusRef.current === ETimerStatus.READY) dispatch(removeShift());
    }, [shiftSlice]);

    const onKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.code !== boundKeyRef.current || bindingRef.current || isTypingRef.current) return;
        handleClickTimer();
    }, []);

    const onTickNotify = useCallback(() => {
        if (timerStatusRef.current !== ETimerStatus.RUNNING || !circleRef.current) return;

        const _strokeDashoffset = strokeDashoffsetRef.current;

        if (shiftRef.current) return shiftTimer();

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

        if (!shiftRef.current || !circleRef.current || !initialCountdownRef.current) return;

        const {direction, value} = shiftRef.current;
        const _strokeDashoffset = strokeDashoffsetRef.current;

        if (direction === EDirection.FORWARD) {
            if (value >= currentCountdownRef.current) return refreshTimer();

            currentCountdownRef.current = currentCountdownRef.current - value;

            const nextStrokeDashoffset = _strokeDashoffset + (stepRef.current * COUNT_OF_BLINKS_EQUIVALENT_TO_ONE_SECOND * value);

            strokeDashoffsetRef.current = nextStrokeDashoffset < LENGTH ? nextStrokeDashoffset : (LENGTH - nextStrokeDashoffset);

            circleRef.current.style.strokeDashoffset = `${strokeDashoffsetRef.current}`;

            setCurrentCountdown(currentCountdownRef.current);
            return dispatch(removeShift());
        } 

        if (currentCountdownRef.current + value >= initialCountdownRef.current) {

            currentCountdownRef.current = initialCountdownRef.current;
            strokeDashoffsetRef.current = 0;
            circleRef.current.style.strokeDashoffset = `${strokeDashoffsetRef.current}`;
            setCurrentCountdown(currentCountdownRef.current);
            return dispatch(removeShift());
        }

        currentCountdownRef.current = currentCountdownRef.current + value;
        const nextStrokeDashoffset = _strokeDashoffset - (stepRef.current * COUNT_OF_BLINKS_EQUIVALENT_TO_ONE_SECOND * value);
        strokeDashoffsetRef.current = nextStrokeDashoffset <= 0 ? 0 : nextStrokeDashoffset;
        circleRef.current.style.strokeDashoffset = `${strokeDashoffsetRef.current}`;
        setCurrentCountdown(currentCountdownRef.current);
        return dispatch(removeShift());

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

        dispatch(removeRunning({value: ability.position}));
        dispatch(removeShift());
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
        setTimerStatus(timerStatusRef.current);
        runApp();
        dispatch(addRunning({value: ability.position}));
    }

    return <div className="Timer" style={{backgroundImage: `url('${ability.img}')`}} ref={timerRef}>
                {        
                    currentHero && 
                    <div className="Timer__ownerBox">
                        <img className="Timer__ownerImg" src={currentHero.img}/>
                        <span className="Timer__ownerName">{currentHero.name}</span>
                    </div>
                }
                <div className="Timer__innerWrapper Playground__slotEasyShadow">
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
                            {
                                timerStatus !== ETimerStatus.RUNNING &&
                                <div className="Timer__play">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 27 30">
                                        <path d="M24.9 12.1623C26.9 13.317 26.9 16.2038 24.9 17.3585L4.5594 29.1021C2.5594 30.2568 0.0594025 28.8134 0.0594025 26.504V3.01675C0.0594025 0.707349 2.5594 -0.736029 4.5594 0.418672L24.9 12.1623Z"/>
                                    </svg>
                                </div>
                            }
                        </div>
                    }
                    {
                        currentStage === EStages.EDIT && !!outerContainer &&
                        createPortal(
                            <div className="Timer__controls">
                                {
                                    timerStatus !== ETimerStatus.READY &&
                                    <div className={cn('Timer__controlButton refresh')} onClick={refreshTimer}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
                                            <path d="M16.5 9C15.7381 9 15.3769 9.53688 15.25 10.1038C14.7931 12.1438 12.8544 15.25 9 15.25C5.54813 15.25 2.75 12.4512 2.75 9C2.75 5.54875 5.54813 2.75 9 2.75C10.4 2.75 11.6844 3.22063 12.725 4H11.5C10.81 4 10.25 4.56 10.25 5.25C10.25 5.94 10.81 6.5 11.5 6.5H15.25C15.94 6.5 16.5 5.94 16.5 5.25V1.5C16.5 0.81 15.94 0.25 15.25 0.25C14.56 0.25 14 0.81 14 1.5V1.82375C12.5831 0.8325 10.8606 0.25 9 0.25C4.1675 0.25 0.25 4.1675 0.25 9C0.25 13.8325 4.1675 17.75 9 17.75C15.2369 17.75 17.75 11.8125 17.75 10.3281C17.75 9.42 17.0863 9 16.5 9Z"/>
                                        </svg>
                                    </div>
                                }
                                <div className="Timer__controlButton remove" onClick={() => removeTimer(ability)}>
                                    {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45">
                                        <path d="M43.7147 1.4392C44.8865 2.61075 44.8866 4.51047 43.7149 5.68212L29.0215 20.3748C27.8498 21.5464 27.8498 23.4459 29.0214 24.6175L43.7152 39.3113C44.8868 40.4829 44.8868 42.3824 43.7152 43.554L43.454 43.8152C42.2824 44.9868 40.3829 44.9868 39.2113 43.8152L24.5175 29.1214C23.3459 27.9498 21.4464 27.9498 20.2748 29.1215L5.58212 43.8149C4.41047 44.9866 2.51076 44.9865 1.3392 43.8147L1.07845 43.5539C-0.0928846 42.3823 -0.092807 40.483 1.07862 39.3116L15.772 24.6174C16.9435 23.4459 16.9435 21.5464 15.7719 20.3749L1.07896 5.68189C-0.0926111 4.51032 -0.0926088 2.61083 1.07896 1.43925L1.33925 1.17896C2.51083 0.00739199 4.41032 0.00739157 5.58189 1.17896L20.2749 15.8719C21.4464 17.0435 23.3459 17.0435 24.5174 15.872L39.2116 1.17862C40.383 0.00719345 42.2823 0.00711489 43.4539 1.17845L43.7147 1.4392Z" />
                                    </svg> */}

                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 22">
                                        <path d="M8.05801 9.125C8.61029 9.125 9.05801 9.57271 9.05801 10.125V15.875C9.05783 16.4271 8.61018 16.875 8.05801 16.875C7.50598 16.8748 7.05818 16.427 7.05801 15.875V10.125C7.05801 9.57282 7.50587 9.12518 8.05801 9.125Z" />
                                        <path d="M11.892 9.125C12.4441 9.12518 12.892 9.57282 12.892 10.125V15.875C12.8918 16.427 12.444 16.8748 11.892 16.875C11.3398 16.875 10.8922 16.4271 10.892 15.875V10.125C10.892 9.57271 11.3397 9.125 11.892 9.125Z" />
                                        <path fillRule="evenodd" clipRule="evenodd" d="M11.892 0.5C12.6654 0.500086 13.4076 0.807588 13.9545 1.35449C14.5012 1.90143 14.809 2.64367 14.809 3.41699V4.33301H18.6L18.7025 4.33789C19.2067 4.38922 19.6 4.81533 19.6 5.33301C19.6 5.85068 19.2067 6.27679 18.7025 6.32812L18.6 6.33301H17.684V18.75C17.6839 19.5234 17.3764 20.2656 16.8295 20.8125C16.2826 21.3594 15.5404 21.6669 14.767 21.667H5.18398C4.41067 21.667 3.66842 21.3592 3.12148 20.8125C2.64292 20.3339 2.34798 19.7057 2.28164 19.0381L2.26699 18.75V6.33301H1.35C0.797715 6.33301 0.35 5.88529 0.35 5.33301C0.35 4.78072 0.797715 4.33301 1.35 4.33301H5.14199V3.41699C5.14199 2.64344 5.4495 1.90147 5.99648 1.35449C6.54347 0.807511 7.28544 0.5 8.05898 0.5H11.892ZM4.26699 18.75L4.27187 18.8408C4.29283 19.0504 4.38527 19.2482 4.53555 19.3984C4.70741 19.57 4.9411 19.667 5.18398 19.667H14.767C15.01 19.6669 15.2436 19.5703 15.4154 19.3984C15.5873 19.2266 15.6839 18.993 15.684 18.75V6.33301H4.26699V18.75ZM8.05898 2.5C7.81587 2.5 7.58246 2.59665 7.41055 2.76855C7.23864 2.94046 7.14199 3.17388 7.14199 3.41699V4.33301H12.809V3.41699C12.809 3.17411 12.712 2.94042 12.5404 2.76855C12.3686 2.59672 12.135 2.50009 11.892 2.5H8.05898Z" />
                                    </svg>
                                </div>
                            </div>, outerContainer as Element)
                    }
                </div>
    </div>
}

export default DumbTimer;