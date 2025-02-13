// 1. Внешние зависимости.
// 2. Компоненты вашего проекта.
// 3. Утилиты и бизнес-логика.
// 4. Стили и ассеты.

import React, { JSX, useEffect, useRef, useState } from 'react';
import TickNotifier, {COUNT_OF_BLINKS_EQUIVALENT_TO_ONE_SECOND} from '../../utils/TickNotifier';
import { IAbility } from '../../data/fillData';
import './Timer.scss';

interface IProps {
    ability: IAbility | undefined
    isTimeRuns: boolean
}

enum ETimeStatus {
    ready = 'ready',
    running = 'running',
    paused = 'paused'
}

const DumbTimer = ({ability, isTimeRuns}: IProps): JSX.Element => {
    if (!ability) return <div></div>;

    const [cooldown, setCooldown] = useState<number>(ability.cooldown[0]);

    const countMSRef = useRef<number>(0);
    const cooldownRef = useRef<number>(ability.cooldown[0]);
    const timerStatusRef = useRef<ETimeStatus>(ETimeStatus.ready);
    const strokeDashoffsetRef = useRef<number>(0);

    const radius = 30;
    const length = 2 * Math.PI * radius;
    const step = length / (COUNT_OF_BLINKS_EQUIVALENT_TO_ONE_SECOND * ability.cooldown[0]);

    const circleRef = useRef<SVGCircleElement | null>(null);

    useEffect(() => {
        const instance = TickNotifier.getInstance();
        instance.subscribe(onTickNotify);
        return () => instance.unsubscribe(onTickNotify);
    }, []);

    useEffect(() => {
        if (!isTimeRuns && timerStatusRef.current === ETimeStatus.running) {
            timerStatusRef.current = ETimeStatus.paused;
        }

        if (isTimeRuns && timerStatusRef.current === ETimeStatus.paused) {
            timerStatusRef.current = ETimeStatus.running;
        }
    }, [isTimeRuns]);

    const onTickNotify = () => {
        const _countMS = countMSRef.current;
        const _cooldown = cooldownRef.current;
        const _timerStatus = timerStatusRef.current;
        const _circle = circleRef.current;
        const _strokeDashoffset = strokeDashoffsetRef.current;

        if (_cooldown === 0 || _timerStatus !== ETimeStatus.running || !_circle) return;

        if (_countMS === COUNT_OF_BLINKS_EQUIVALENT_TO_ONE_SECOND) {
            countMSRef.current = 0;
            cooldownRef.current -= 1;
            return setCooldown(cooldownRef.current);
        }

        countMSRef.current += 1;
        strokeDashoffsetRef.current += _strokeDashoffset + step < length ? step : length - _strokeDashoffset;
        _circle.setAttribute('stroke-dashoffset', `${strokeDashoffsetRef.current}`);
    }
    
    const handleClickTimer = () => {
        if (!isTimeRuns || timerStatusRef.current === ETimeStatus.running) {
            // showSpellToolbar
            return;
        }

        timerStatusRef.current = ETimeStatus.running
    }

    return <div className="DumbTimer" onClick={handleClickTimer}>
            <svg className="timer_svg" width="120" height="120" viewBox="0 0 120 120">
                    <circle ref={circleRef} className="Timer__circle"
                        cx="60"
                        cy="60"
                        strokeWidth="60"
                        r={radius}
                        fill="transparent"
                        strokeDasharray={length}
                        strokeDashoffset="0"
                        transform="rotate(-90 60 60)"
                        style={{ transition: `stroke-dashoffset 0.05s linear` }}
                    />
            </svg>
            {cooldown}
    </div>
}

export default DumbTimer;