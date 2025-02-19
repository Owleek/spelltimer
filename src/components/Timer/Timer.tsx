// 1. Внешние зависимости.
// 2. Компоненты вашего проекта.
// 3. Утилиты и бизнес-логика.
// 4. Стили и ассеты.

import React, { JSX, useEffect, useRef, useState } from 'react';
import TickNotifier from '../../utils/TickNotifier';
import { ETimerStatus } from './TimerController';
import './Timer.scss';

interface IProps {
    timerCooldown: number
    status: ETimerStatus
    onClick: () => void
}

const RADIUS = 30;
const LENGTH = 2 * Math.PI * RADIUS;


const Timer = ({timerCooldown, status, onClick}: IProps): JSX.Element => {
    const circleRef = useRef<SVGCircleElement | null>(null);

    // ---> Countdown
    const countdownRef = useRef<number>(timerCooldown);
    const [countdown, setCountdown] = useState<number>(timerCooldown);
    
    const setCountdownRef = (number: number) => {
        countdownRef.current = number;
    }
    const setCountdownEntire = (number: number) => {
        countdownRef.current = number;
        setCountdown(countdownRef.current);
    }
    // <--- Countdown


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

    }

    const onVisibilityChange = () => {

    }

    const refreshTimer = () => {

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
                    {countdown}
                </div>
            </div>
        </div>
    );
}

export default Timer;