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

    useEffect(() => {
        const instance = TickNotifier.getInstance();
        instance.subscribe(onTickNotify);
        return () => instance.unsubscribe(onTickNotify);
    }, []);

    useEffect(() => {
        if (!isTimeRuns && timerStatusRef.current === ETimeStatus.running) {
            timerStatusRef.current = ETimeStatus.paused;
            return;
        } 

        timerStatusRef.current = timerStatusRef.current === ETimeStatus.paused ? ETimeStatus.running : timerStatusRef.current;
    }, [isTimeRuns]);

    const onTickNotify = () => {
        if (cooldownRef.current === 0 || timerStatusRef.current !== ETimeStatus.running) return;
        if (countMSRef.current < COUNT_OF_BLINKS_EQUIVALENT_TO_ONE_SECOND) {
            countMSRef.current += 1;
            return;
        }

        countMSRef.current = 0;
        cooldownRef.current -= 1;
        setCooldown(cooldownRef.current);
    }

    const setTimerStatusMain = () => {
        if (!isTimeRuns) return;
        timerStatusRef.current = timerStatusRef.current !== ETimeStatus.running ? ETimeStatus.running : ETimeStatus.paused;
    }
    
    const handleClickTimer = () => setTimerStatusMain();

    return <div className="DumbTimer" onClick={handleClickTimer}>{cooldown}</div>
}

export default DumbTimer;