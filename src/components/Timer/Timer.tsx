// 1. Внешние зависимости.
// 2. Компоненты вашего проекта.
// 3. Утилиты и бизнес-логика.
// 4. Стили и ассеты.

import React, { JSX, useCallback, useEffect, useRef, useState } from 'react';
import TickNotifier from '../../utils/TickNotifier';
import { ETimerStatus } from './TimerController';
import {COUNT_OF_BLINKS_EQUIVALENT_TO_ONE_SECOND} from '../../utils/TickNotifier';
import './Timer.scss';

interface IProps {
    cooldown: number
    status: ETimerStatus
    onClick: () => void
    onStart: () => void
    onReady: () => void
    onPaused: () => void
    onExpired: () => void
    onDisabled: () => void
}

const RADIUS = 30;
const LENGTH = 2 * Math.PI * RADIUS;


const Timer = (props: IProps): JSX.Element => {
    const { cooldown, status, onClick, onStart, onPaused, onReady, onExpired, onDisabled } = props;

    const circleRef = useRef<SVGCircleElement | null>(null);

    // ---> TimerCooldown
    const timerCooldownRef = useRef<number>(cooldown);
    const [timerCooldown, setTimerCooldown] = useState<number>(cooldown);
    
    const setTimerCooldownRef = (number: number) => {
        timerCooldownRef.current = number;
    }
    const setTimerCooldownEntire = (number: number) => {
        timerCooldownRef.current = number;
        setTimerCooldown(timerCooldownRef.current);
    }
    // <--- TimerCooldown


    // ---> StrokeDashoffset
    const strokeDashoffsetRef = useRef<number>(0);
    const [strokeDashoffset, setStrokeDashoffset] = useState<number>(0);

    const setStrokeDashoffsetRef = (number: number) => {
        strokeDashoffsetRef.current = number;
    }
    const setStrokeDashoffsetEntire = (number: number) => {
        strokeDashoffsetRef.current = number;
        setStrokeDashoffset(strokeDashoffsetRef.current);
    }
    // <--- StrokeDashoffset


    // ---> TimerStatus
    const timerStatusRef = useRef<ETimerStatus>(ETimerStatus.ready);
    const [timerStatus, setTimerStatus] = useState<ETimerStatus>(ETimerStatus.ready);

    const setTimerStatusRef = (value: ETimerStatus) => {
        timerStatusRef.current = value;
    }
    const setTimerStatusEntire = (value: ETimerStatus) => {
        timerStatusRef.current = value;
        setTimerStatus(timerStatusRef.current);
    }

    useEffect(() => {
        setTimerStatusRef(status);
    }, [status]);
    // <--- TimerStatus


    // ---> Tick
    const tickRef = useRef<number>(0);

    const setTickRef = (number: number) => {
        tickRef.current = number;
    }
    // <--- Tick

    useEffect(() => {
        const instance = TickNotifier.getInstance();
        instance.subscribe(onTickNotify);
        document.addEventListener('visibilitychange', onVisibilityChange);

        return () => {
            instance.unsubscribe(onTickNotify);
            document.removeEventListener('visibilitychange', onVisibilityChange);
        };
    }, []);

    const onTickNotify = () => {
        switch(timerStatusRef.current) {
            case ETimerStatus.disabled:
                return disableTimer();
            case ETimerStatus.paused:
                return pauseTimer();
            case ETimerStatus.ready:
                return refreshTimer();
            case ETimerStatus.running:
                return runTimer();
        }
    }

    const onVisibilityChange = () => {

    }

    const disableTimer = () => {
        // setDisable
        onDisabled();
    }

    const pauseTimer = () => {
        // setPause
        onPaused();
    }

    const refreshTimer = () => {
        // setRefresh
    }

    const runTimer = () => {
        // setRunTimer

        if (tickRef.current === COUNT_OF_BLINKS_EQUIVALENT_TO_ONE_SECOND) {
            setTickRef(0);
            return timerCooldownRef.current - 1 === 0 ? refreshTimer() : setTimerCooldownEntire(cooldown);
        }

        // const _strokeDashoffset =  strokeDashoffsetRef.current;
        // const _nextStrokeDashoffset = _strokeDashoffset + step;

        // setTickRef(tickRef.current + 1);
        // setStrokeDashoffsetRef(nextStrokeDashoffset < length ? _nextStrokeDashoffset : length - _strokeDashoffset);

    }

    return (
        <div className="Timer" onClick={onClick}>
            <div className='Timer__padding'>
                <div className="Timer__container">
                    <svg className="Timer__svg" viewBox="0 0 120 120">
                        <circle className="Timer__circle transition"
                                ref={circleRef}
                                r={RADIUS}
                                strokeDasharray={LENGTH}
                                strokeDashoffset={strokeDashoffsetRef.current}
                                cx="60"
                                cy="60"
                                strokeWidth="60"
                                fill="transparent"
                                transform="rotate(-90 60 60)" />
                    </svg>
                    {timerCooldown}
                </div>
            </div>
        </div>
    );
}

export default Timer;