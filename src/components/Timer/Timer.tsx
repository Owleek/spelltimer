// 1. Внешние зависимости.
// 2. Компоненты вашего проекта.
// 3. Утилиты и бизнес-логика.
// 4. Стили и ассеты.

import React, { JSX, RefObject, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import TickNotifier from '../../utils/TickNotifier';
import { ETimerStatus, ITimerHandle } from './TimerController';
import {COUNT_OF_BLINKS_EQUIVALENT_TO_ONE_SECOND} from '../../utils/TickNotifier';
import './Timer.scss';

interface IProps {
    cooldown: number
    ref: RefObject<ITimerHandle | null>
    className?: string
}

const RADIUS = 30;
const CIRCLE_LENGTH = 2 * Math.PI * RADIUS;


const Timer = ({ cooldown, ref, className }: IProps): JSX.Element => {
    
    const step = CIRCLE_LENGTH / (COUNT_OF_BLINKS_EQUIVALENT_TO_ONE_SECOND * cooldown);

    const statusRef = useRef<ETimerStatus>(ETimerStatus.ready);
    const cooldownRef = useRef<number>(cooldown);
    const strokeDashoffsetRef = useRef<number>(0);
    const tickRef = useRef<number>(0);
    const circleRef = useRef<SVGCircleElement | null>(null);

    const [cooldownState, setCooldownState] = useState<number>(cooldown);

    const setStatusRefReady = () => {
        statusRef.current = ETimerStatus.ready;
    }

    const setStatusRefRunning = () => {
        statusRef.current = ETimerStatus.running;
    }

    const setStatusRefStopped = () => {
        statusRef.current = ETimerStatus.stopped;
    }

    const decreaseCooldown = () => {
        cooldownRef.current -= 1;
        setCooldownState(cooldownRef.current);
    }

    const resetCooldown = () => {
        cooldownRef.current = cooldown;
        setCooldownState(cooldownRef.current);
    }

    const resetTickRef = () => {
        tickRef.current = 0;
    }

    const increaseTickRef = () => {
        tickRef.current += 1;
    }

    const increaseStrokeDashOffsetRef = () => {
        if (!circleRef.current) throw new Error('increaseStrokeDashOffsetRef ------> circleRef.current is not defined');
        const _nextStrokeDashoffsetRef = strokeDashoffsetRef.current + step;

        strokeDashoffsetRef.current = _nextStrokeDashoffsetRef < CIRCLE_LENGTH ? _nextStrokeDashoffsetRef : CIRCLE_LENGTH - strokeDashoffsetRef.current;
        circleRef.current.style.strokeDashoffset = `${strokeDashoffsetRef.current}`;
    }

    const resetStrokeDashOffsetRef = () => {
        if (!circleRef.current) throw new Error('resetStrokeDashOffsetRef ------> circleRef.current is not defined');

        circleRef.current.style.display = 'none';
        strokeDashoffsetRef.current = 0;
        circleRef.current.style.strokeDashoffset = `${strokeDashoffsetRef.current}`;
    }

    const resetTimer = () => {
        setStatusRefReady();
        resetTickRef();
        resetCooldown();
        resetStrokeDashOffsetRef();
    }

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
        if (statusRef.current !== ETimerStatus.running) return;

        if (tickRef.current < COUNT_OF_BLINKS_EQUIVALENT_TO_ONE_SECOND) {
            increaseTickRef();
            increaseStrokeDashOffsetRef();
            return;
        }

        resetTickRef();

        if (cooldownRef.current - 1 <= 0) return resetTimer();

        decreaseCooldown();
        increaseStrokeDashOffsetRef();
    }

    const onVisibilityChange = () => {
        if (!circleRef.current) throw new Error('onVisibilityChange ------> circleRef.current is not defined');

        if (document.hidden) {
            circleRef.current.classList.remove('transition');
            return;
        }

        const timeout = setTimeout(() => {
            if (!circleRef.current) throw new Error('onVisibilityChange timeout ------> circleRef.current is not defined');
            circleRef.current.classList.add('transition');
            clearTimeout(timeout);
        }, 10)
    }

    const start = () => {
        if (!circleRef.current) throw new Error('start ------> circleRef.current is not defined');
        circleRef.current.style.display = 'block';
        setStatusRefRunning();
    };

    const stop = () => setStatusRefStopped();
    const reset = () => resetTimer();

    if (!ref) throw new Error('Timer component -----> ref is not defined');

    ref.current = { start, stop, reset };

    return (
        <div className={cn('Timer', className)}>
            <div className='Timer__padding'>
                <div className="Timer__container">
                    <svg className="Timer__svg" viewBox="0 0 120 120">
                        <circle className="Timer__circle transition"
                                ref={circleRef}
                                r={RADIUS}
                                strokeDasharray={CIRCLE_LENGTH}
                                strokeDashoffset="0"
                                cx="60"
                                cy="60"
                                strokeWidth="60"
                                fill="transparent"
                                transform="rotate(-90 60 60)" />
                    </svg>
                    {cooldownState}
                </div>
            </div>
        </div>
    );
}

export default Timer;