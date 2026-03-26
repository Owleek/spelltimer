'use client';
import React, { JSX, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import cn from 'classnames';
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';

import { TStoreState } from '../../../../shared/store/store';
import { addRunning, removeRunning } from '../../../../shared/store/runningSlice';
import { EDirection } from '../../../../shared/store/shiftSlice';
import { EStages } from '../../../../shared/store/StageContext';
import { ITimerData } from '../../../../shared/data/data';
import fetchData from '../../../../shared/data/data';
import { getKeyFromCode } from '../../../../shared/data/keyCodeDictionary';
import { setHotkey } from '../../../../shared/store/hotkeySlice';
import { setBindingSlice } from '../../../../shared/store/bindingSlice';
import { playSound, preloadSound, unlockAudio, END_SOUND, RUN_SOUND, SOUND } from '../../../../shared/lib/sound';
import { EAppStatus } from '../../types';
import './Timer.scss';

interface IProps {
    ability: ITimerData
    appStatus: EAppStatus
    runApp: () => void
    pauseApp: () => void
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

const Timer = ({ ability, appStatus, runApp, pauseApp, currentStage, removeTimer, withSound = true }: IProps): JSX.Element => {
    const translate = useTranslations('PlaygroundPage.TimerPanel');
    const dispatch = useDispatch();

    const typingSlice = useSelector((state: TStoreState) => state.typingSlice);
    const someOneIsBinding = useSelector((state: TStoreState) => state.bindingSlice.value);
    const shiftCommand = useSelector((state: TStoreState) => state.shiftSlice);
    const refreshState = useSelector((state: TStoreState) => state.refreshSlice);

    const initialTime = useMemo(() => ability.customCooldown ?? ability.cooldown[ability.cooldownIndex], [ability]);
    const [currentCountdown, setCurrentCountdown] = useState<number>(initialTime);
    const [timerStatus, setTimerStatus] = useState<ETimerStatus>(ETimerStatus.READY);
    const [outerContainer, setOuterContainer] = useState<Element | null>(null);
    const [isBinding, setIsBinding] = useState<boolean>(false);
    const [keyPressed, setKeyPressed] = useState<boolean>(false);
    const [animateIndicator, setAnimateIndicator] = useState<boolean>(true);

    const timerRef = useRef<HTMLDivElement | null>(null);
    const circleRef = useRef<SVGCircleElement | null>(null);
    const rafRef = useRef<number>(0);
    const lastFrameTimestampRef = useRef<number | null>(null);
    const totalDurationSecondsRef = useRef<number>(initialTime);
    const remainingMsRef = useRef<number>(initialTime * 1000);
    const displayedCountdownRef = useRef<number>(initialTime);
    const strokeDashoffsetRef = useRef<number>(0);
    const timerStatusRef = useRef<ETimerStatus>(ETimerStatus.READY);
    const bindingRef = useRef<boolean>(someOneIsBinding);
    const boundKeyRef = useRef<string>(ability.boundKey);
    const isTypingRef = useRef<boolean>(!!typingSlice.entities.length);
    const withSoundRef = useRef<boolean>(withSound);
    const lastShiftTokenRef = useRef<number>(shiftCommand.token);
    const lastRefreshTokenRef = useRef<number>(refreshState.token);

    const { heroes } = fetchData;
    const currentHero = ability.owner ? heroes.find((hero) => hero.name === ability.owner) : null;

    const clearLoop = useCallback(() => {
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = 0;
        }

        lastFrameTimestampRef.current = null;
    }, []);

    const setCircleVisible = useCallback((visible: boolean) => {
        if (!circleRef.current) return;
        circleRef.current.style.display = visible ? 'block' : 'none';
    }, []);

    const syncCountdown = useCallback((nextRemainingMs: number) => {
        const nextCountdown = Math.max(0, Math.ceil(nextRemainingMs / 1000));

        if (displayedCountdownRef.current !== nextCountdown) {
            displayedCountdownRef.current = nextCountdown;
            setCurrentCountdown(nextCountdown);
        }
    }, []);

    const syncProgress = useCallback((nextRemainingMs: number) => {
        if (!circleRef.current) return;

        const durationMs = totalDurationSecondsRef.current * 1000;
        const safeRemainingMs = Math.max(0, Math.min(nextRemainingMs, durationMs));
        const progress = durationMs === 0 ? 1 : 1 - safeRemainingMs / durationMs;
        const nextOffset = Math.min(LENGTH, Math.max(0, LENGTH * progress));

        remainingMsRef.current = safeRemainingMs;
        strokeDashoffsetRef.current = nextOffset;
        circleRef.current.style.strokeDashoffset = `${nextOffset}`;
        syncCountdown(safeRemainingMs);
    }, [syncCountdown]);

    const playSoundDecorator = useCallback((src: string) => playSound(src, withSoundRef.current), []);

    const resetTimer = useCallback((playEndSound = false) => {
        clearLoop();

        if (playEndSound) {
            playSoundDecorator(END_SOUND);
        }

        totalDurationSecondsRef.current = ability.customCooldown ?? ability.cooldown[ability.cooldownIndex];
        remainingMsRef.current = totalDurationSecondsRef.current * 1000;
        displayedCountdownRef.current = totalDurationSecondsRef.current;
        strokeDashoffsetRef.current = 0;
        timerStatusRef.current = ETimerStatus.READY;

        setTimerStatus(ETimerStatus.READY);
        setCurrentCountdown(totalDurationSecondsRef.current);
        setAnimateIndicator(true);
        setCircleVisible(false);

        if (circleRef.current) {
            circleRef.current.style.strokeDashoffset = '0';
        }

        dispatch(removeRunning({ value: ability.position }));
    }, [ability, clearLoop, dispatch, playSoundDecorator, setCircleVisible]);

    const loop = useCallback((timestamp: number) => {
        if (timerStatusRef.current !== ETimerStatus.RUNNING) return;

        if (lastFrameTimestampRef.current === null) {
            lastFrameTimestampRef.current = timestamp;
            rafRef.current = requestAnimationFrame(loop);
            return;
        }

        const delta = timestamp - lastFrameTimestampRef.current;
        lastFrameTimestampRef.current = timestamp;

        const nextRemainingMs = remainingMsRef.current - delta;

        if (nextRemainingMs <= 0) {
            resetTimer(true);
            return;
        }

        syncProgress(nextRemainingMs);
        rafRef.current = requestAnimationFrame(loop);
    }, [resetTimer, syncProgress]);

    const startLoop = useCallback(() => {
        if (rafRef.current) return;
        lastFrameTimestampRef.current = null;
        rafRef.current = requestAnimationFrame(loop);
    }, [loop]);

    const applyShift = useCallback((seconds: number, direction: EDirection) => {
        const shiftMs = seconds * 1000;
        const durationMs = totalDurationSecondsRef.current * 1000;

        if (direction === EDirection.FORWARD) {
            const nextRemainingMs = remainingMsRef.current - shiftMs;
            if (nextRemainingMs <= 0) {
                resetTimer();
                return;
            }

            syncProgress(nextRemainingMs);
            return;
        }

        const nextRemainingMs = Math.min(durationMs, remainingMsRef.current + shiftMs);
        syncProgress(nextRemainingMs);
    }, [resetTimer, syncProgress]);

    const pauseTimer = useCallback(() => {
        clearLoop();
        timerStatusRef.current = ETimerStatus.PAUSED;
        setTimerStatus(ETimerStatus.PAUSED);
    }, [clearLoop]);

    const startTimer = useCallback(() => {
        unlockAudio();
        setCircleVisible(true);
        setAnimateIndicator(false);
        timerStatusRef.current = ETimerStatus.RUNNING;
        setTimerStatus(ETimerStatus.RUNNING);
        playSoundDecorator(RUN_SOUND);
        dispatch(addRunning({ value: ability.position }));
        startLoop();
    }, [ability.position, dispatch, playSoundDecorator, setCircleVisible, startLoop]);

    const handleClickTimer = useCallback(() => {
        if (timerStatusRef.current === ETimerStatus.RUNNING) {
            pauseTimer();
            pauseApp();
            return;
        }

        startTimer();
        runApp();
    }, [pauseApp, pauseTimer, runApp, startTimer]);

    const handleBindKey = useCallback(() => {
        setIsBinding(true);
        dispatch(setBindingSlice(true));
    }, [dispatch]);

    const hotkey = getKeyFromCode(ability.boundKey);

    useEffect(() => {
        if (timerRef.current?.parentElement) {
            setOuterContainer(timerRef.current.parentElement);
        }
    }, []);

    useEffect(() => {
        totalDurationSecondsRef.current = initialTime;
        boundKeyRef.current = ability.boundKey;

        if (timerStatusRef.current === ETimerStatus.READY) {
            resetTimer();
        }
    }, [ability, initialTime, resetTimer]);

    useEffect(() => {
        bindingRef.current = someOneIsBinding;
    }, [someOneIsBinding]);

    useEffect(() => {
        isTypingRef.current = !!typingSlice.entities.length;
    }, [typingSlice]);

    useEffect(() => {
        withSoundRef.current = withSound;
    }, [withSound]);

    useEffect(() => {
        preloadSound(RUN_SOUND);
        preloadSound(END_SOUND);
        preloadSound(SOUND);
    }, []);

    useEffect(() => {
        if (refreshState.token === lastRefreshTokenRef.current) return;
        lastRefreshTokenRef.current = refreshState.token;
        resetTimer();
    }, [refreshState.token, resetTimer]);

    useEffect(() => {
        if (shiftCommand.token === lastShiftTokenRef.current) return;
        lastShiftTokenRef.current = shiftCommand.token;

        if (!shiftCommand.value || !shiftCommand.direction || timerStatusRef.current === ETimerStatus.READY) {
            return;
        }

        applyShift(shiftCommand.value, shiftCommand.direction);
    }, [applyShift, shiftCommand]);

    useEffect(() => {
        if (appStatus === EAppStatus.PAUSED && timerStatusRef.current === ETimerStatus.RUNNING) {
            pauseTimer();
            return;
        }

        if (appStatus === EAppStatus.RUNNING && timerStatusRef.current === ETimerStatus.PAUSED) {
            timerStatusRef.current = ETimerStatus.RUNNING;
            setTimerStatus(ETimerStatus.RUNNING);
            startLoop();
        }
    }, [appStatus, pauseTimer, startLoop]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (isBinding) return;
            if (event.code !== boundKeyRef.current || bindingRef.current || isTypingRef.current) return;
            setKeyPressed(true);
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            if (event.code !== boundKeyRef.current || bindingRef.current || isTypingRef.current) return;
            setKeyPressed(false);
            handleClickTimer();
        };

        const bindHotkey = (event: KeyboardEvent) => {
            if (!isBinding) return;

            setIsBinding(false);
            dispatch(setBindingSlice(false));

            if (event.code === 'Escape') return;

            dispatch(setHotkey({ key: event.code, id: ability.position, type: 'slot' }));
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        document.addEventListener('keyup', bindHotkey);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
            document.removeEventListener('keyup', bindHotkey);
        };
    }, [ability.position, dispatch, handleClickTimer, isBinding]);

    useEffect(() => () => clearLoop(), [clearLoop]);

    return (
        <div className="Timer" style={{ backgroundImage: `url("${ability.img}")` }} ref={timerRef}>
            {currentHero && (
                <div className="Timer__ownerBox">
                    <img className="Timer__ownerImg" src={currentHero.img} alt={currentHero.name} />
                    <span className="Timer__ownerName">{currentHero.name}</span>
                </div>
            )}

            {currentStage === EStages.PLAY && (
                <div className={cn('Timer__hint', { highlight: keyPressed })}>
                    <span className="Timer__hintText">{hotkey}</span>
                </div>
            )}

            <div className="Timer__innerWrapper">
                <svg className="Timer__svg" viewBox="0 0 120 120">
                    <circle
                        className="Timer__circle"
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

                {currentStage === EStages.PLAY && (
                    <div className="Timer__cover" onClick={handleClickTimer} title={translate(timerStatus === ETimerStatus.RUNNING ? 'pause' : 'start')}>
                        <div className="Timer__play">
                            {timerStatus === ETimerStatus.RUNNING ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 42">
                                    <path d="M9 3C9 1.34315 10.3431 0 12 0H18C19.6569 0 21 1.34315 21 3V39C21 40.6569 19.6569 42 18 42H12C10.3431 42 9 40.6569 9 39V3Z" />
                                    <path d="M29 3C29 1.34315 30.3431 0 32 0H38C39.6569 0 41 1.34315 41 3V39C41 40.6569 39.6569 42 38 42H32C30.3431 42 29 40.6569 29 39V3Z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 27 30">
                                    <path d="M24.9 12.1623C26.9 13.317 26.9 16.2038 24.9 17.3585L4.5594 29.1021C2.5594 30.2568 0.0594025 28.8134 0.0594025 26.504V3.01675C0.0594025 0.707349 2.5594 -0.736029 4.5594 0.418672L24.9 12.1623Z" />
                                </svg>
                            )}
                        </div>
                    </div>
                )}

                {currentStage === EStages.EDIT && outerContainer && createPortal(
                    <>
                        <div className="Timer__disabled"></div>

                        <div className={cn('Timer__slotHotkey', { isBinding, highlight: keyPressed })} onClick={handleBindKey} title={translate('hotkey_toggle_timer')}>
                            <div className="Timer__slotHotKeyTextBox">
                                <span className="Timer__slotHotKeyText">{isBinding ? <span>...</span> : hotkey}</span>
                            </div>
                        </div>

                        <div className="Timer__controls">
                            <div className={cn('Timer__controlButton refresh', { hidden: timerStatus === ETimerStatus.READY })} onClick={() => resetTimer()} title={translate('reset_timer')}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
                                    <path d="M16.5 9C15.7381 9 15.3769 9.53688 15.25 10.1038C14.7931 12.1438 12.8544 15.25 9 15.25C5.54813 15.25 2.75 12.4512 2.75 9C2.75 5.54875 5.54813 2.75 9 2.75C10.4 2.75 11.6844 3.22063 12.725 4H11.5C10.81 4 10.25 4.56 10.25 5.25C10.25 5.94 10.81 6.5 11.5 6.5H15.25C15.94 6.5 16.5 5.94 16.5 5.25V1.5C16.5 0.81 15.94 0.25 15.25 0.25C14.56 0.25 14 0.81 14 1.5V1.82375C12.5831 0.8325 10.8606 0.25 9 0.25C4.1675 0.25 0.25 4.1675 0.25 9C0.25 13.8325 4.1675 17.75 9 17.75C15.2369 17.75 17.75 11.8125 17.75 10.3281C17.75 9.42 17.0863 9 16.5 9Z" />
                                </svg>
                            </div>
                            <div className="Timer__controlButton remove" onClick={() => removeTimer(ability)} title={translate('delete')}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 22">
                                    <path d="M8.05801 9.125C8.61029 9.125 9.05801 9.57271 9.05801 10.125V15.875C9.05783 16.4271 8.61018 16.875 8.05801 16.875C7.50598 16.8748 7.05818 16.427 7.05801 15.875V10.125C7.05801 9.57282 7.50587 9.12518 8.05801 9.125Z" />
                                    <path d="M11.892 9.125C12.4441 9.12518 12.892 9.57282 12.892 10.125V15.875C12.8918 16.427 12.444 16.8748 11.892 16.875C11.3398 16.875 10.8922 16.4271 10.892 15.875V10.125C10.892 9.57271 11.3397 9.125 11.892 9.125Z" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M11.892 0.5C12.6654 0.500086 13.4076 0.807588 13.9545 1.35449C14.5012 1.90143 14.809 2.64367 14.809 3.41699V4.33301H18.6L18.7025 4.33789C19.2067 4.38922 19.6 4.81533 19.6 5.33301C19.6 5.85068 19.2067 6.27679 18.7025 6.32812L18.6 6.33301H17.684V18.75C17.6839 19.5234 17.3764 20.2656 16.8295 20.8125C16.2826 21.3594 15.5404 21.6669 14.767 21.667H5.18398C4.41067 21.667 3.66842 21.3592 3.12148 20.8125C2.64292 20.3339 2.34798 19.7057 2.28164 19.0381L2.26699 18.75V6.33301H1.35C0.797715 6.33301 0.35 5.88529 0.35 5.33301C0.35 4.78072 0.797715 4.33301 1.35 4.33301H5.14199V3.41699C5.14199 2.64344 5.4495 1.90147 5.99648 1.35449C6.54347 0.807511 7.28544 0.5 8.05898 0.5H11.892ZM4.26699 18.75L4.27187 18.8408C4.29283 19.0504 4.38527 19.2482 4.53555 19.3984C4.70741 19.57 4.9411 19.667 5.18398 19.667H14.767C15.01 19.6669 15.2436 19.5703 15.4154 19.3984C15.5873 19.2266 15.6839 18.993 15.684 18.75V6.33301H4.26699V18.75ZM8.05898 2.5C7.81587 2.5 7.58246 2.59665 7.41055 2.76855C7.23864 2.94046 7.14199 3.17388 7.14199 3.41699V4.33301H12.809V3.41699C12.809 3.17411 12.712 2.94042 12.5404 2.76855C12.3686 2.59672 12.135 2.50009 11.892 2.5H8.05898Z" />
                                </svg>
                            </div>
                        </div>
                    </>,
                    outerContainer
                )}

                {currentStage === EStages.PLAY && timerStatus === ETimerStatus.READY && outerContainer && createPortal(
                    <div className={cn('Timer__statusBox', { animateIndicator })}>
                        <div className="Timer__statusInnerWrapper">
                            <div className="Timer__statusIndicatorBackground"></div>
                            <div className="Timer__statusIndicatorBackground"></div>
                            <div className="Timer__statusIndicatorBackground"></div>
                            <div className="Timer__statusIndicatorBackground"></div>
                            <span className="Timer__statusIndicator"></span>
                            <span className="Timer__statusIndicator"></span>
                            <span className="Timer__statusIndicator"></span>
                            <span className="Timer__statusIndicator"></span>
                        </div>
                    </div>,
                    outerContainer
                )}
            </div>
        </div>
    );
};

export default Timer;