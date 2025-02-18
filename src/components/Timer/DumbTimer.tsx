// 1. Внешние зависимости.
// 2. Компоненты вашего проекта.
// 3. Утилиты и бизнес-логика.
// 4. Стили и ассеты.

import React, { JSX, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import TickNotifier, {COUNT_OF_BLINKS_EQUIVALENT_TO_ONE_SECOND} from '../../utils/TickNotifier';
import { IDataItem, ISpells, IFeatures, IArtifacts, TMixedDataItem } from '../../data/data';
import './Timer.scss';

interface IProps {
    ability: TMixedDataItem | undefined
    isTimeRuns: boolean
}

enum ETimerStatus {
    ready = 'ready',
    running = 'running',
    paused = 'paused'
}

const DumbTimer = ({ability, isTimeRuns = true}: IProps): JSX.Element => {
    if (!ability) return <div></div>;

    const [cooldown, setCooldown] = useState<number>(ability.cooldown[0]);
    const [timerStatus, setTimerStatus] = useState<ETimerStatus>(ETimerStatus.ready);

    const countMSRef = useRef<number>(0);
    const cooldownRef = useRef<number>(ability.cooldown[0]);
    const timerStatusRef = useRef<ETimerStatus>(ETimerStatus.ready);

    const circleRef = useRef<SVGCircleElement | null>(null);
    const strokeDashoffsetRef = useRef<number>(0);

    const radius = 30;
    const length = 2 * Math.PI * radius;
    const step = length / (COUNT_OF_BLINKS_EQUIVALENT_TO_ONE_SECOND * ability.cooldown[0]);

    useEffect(() => {
        const instance = TickNotifier.getInstance();
        instance.subscribe(onTickNotify);
        document.addEventListener('visibilitychange', onVisibilityChange);

        return () => {
            instance.unsubscribe(onTickNotify);
            document.removeEventListener('visibilitychange', onVisibilityChange);
        };
    }, []);

    // useEffect(() => {

    //     if (!isTimeRuns && timerStatusRef.current === ETimerStatus.running) {
    //         timerStatusRef.current = ETimerStatus.paused;
    //     }

    //     if (isTimeRuns && timerStatusRef.current === ETimerStatus.paused) {
    //         timerStatusRef.current = ETimerStatus.running;
    //     }

    // }, [isTimeRuns]);

    const onTickNotify = () => {
        const _countMS = countMSRef.current;
        const _cooldown = cooldownRef.current;
        const _timerStatus = timerStatusRef.current;
        const _circle = circleRef.current;
        const _strokeDashoffset = strokeDashoffsetRef.current;

        if (_cooldown === 0 || _timerStatus !== ETimerStatus.running || !_circle) return;

        if (_countMS === COUNT_OF_BLINKS_EQUIVALENT_TO_ONE_SECOND) {
            countMSRef.current = 0;
            cooldownRef.current -= 1;
            return cooldownRef.current === 0 ? refreshTimer() : setCooldown(cooldownRef.current);
        }

        countMSRef.current += 1;
        strokeDashoffsetRef.current += _strokeDashoffset + step < length ? step : length - _strokeDashoffset;
        _circle.style.strokeDashoffset = `${strokeDashoffsetRef.current}`;
    }

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

    const refreshTimer = () => {
        if (!circleRef.current) return;

        timerStatusRef.current = ETimerStatus.ready;
        cooldownRef.current = ability.cooldown[0];
        setCooldown(cooldownRef.current);
        setTimerStatus(timerStatusRef.current);

        const timeOutId = setTimeout(() => {
            if (!circleRef.current) return;

            circleRef.current.style.display = 'none';
            strokeDashoffsetRef.current = 0;
            circleRef.current.style.strokeDashoffset = `${strokeDashoffsetRef.current}`;
            clearTimeout(timeOutId);
        }, 10);
    }

    const handleClickTimer = () => {
        if (!isTimeRuns && (timerStatusRef.current === ETimerStatus.running)) {
            // showSpellToolbar
            return;
        }

        if ((timerStatusRef.current === ETimerStatus.ready) && circleRef.current) {
            circleRef.current.style.display = 'block';
        }

        timerStatusRef.current = ETimerStatus.running;
        setTimerStatus(timerStatusRef.current);
    }

    return <div className="DumbTimer" onClick={handleClickTimer}>
            <div className='DumbTimer__padding'>
                <div className={cn('DumbTimer__innerContainer', {ready: timerStatus === ETimerStatus.ready})} style={{backgroundImage: `url('${ability.img}')`}}>

                    <svg className="TimerSVG" viewBox="0 0 120 120">
                        <circle
                            ref={circleRef}
                            className={cn('TimerSVG__circle transition')}
                            cx="60"
                            cy="60"
                            strokeWidth="60"
                            r={radius}
                            fill="transparent"
                            strokeDasharray={length}
                            strokeDashoffset={strokeDashoffsetRef.current}
                            transform="rotate(-90 60 60)"/>
                        </svg>

                    {cooldown}

                </div>
            </div>
    </div>
}

export default DumbTimer;