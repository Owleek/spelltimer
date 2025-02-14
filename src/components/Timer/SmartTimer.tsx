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
}

enum ETimerStatus {
    ready = 'ready',
    running = 'running',
    paused = 'paused'
}

const SmartTimer = ({ability}: IProps): JSX.Element => {
    if (!ability) return <div></div>;

    const [cooldown, setCooldown] = useState<number>(ability.cooldown[0]);

    const countMSRef = useRef<number>(0);
    const cooldownRef = useRef<number>(ability.cooldown[0]);
    const timerStatusRef = useRef<ETimerStatus>(ETimerStatus.ready);

    useEffect(() => {
        const instance = TickNotifier.getInstance();
        instance.subscribe(onTickNotify);
        return () => instance.unsubscribe(onTickNotify);
    }, []);

    const onTickNotify = () => {
        if (cooldownRef.current === 0 || timerStatusRef.current !== ETimerStatus.running) return;
        if (countMSRef.current < COUNT_OF_BLINKS_EQUIVALENT_TO_ONE_SECOND) {
            countMSRef.current += 1;
            return;
        }

        countMSRef.current = 0;
        cooldownRef.current -= 1;
        setCooldown(cooldownRef.current);
    }

    const setTimerStatusMain = () => {
        timerStatusRef.current = timerStatusRef.current !== ETimerStatus.running ? ETimerStatus.running : ETimerStatus.paused;
    }
    
    const handleClickTimer = () => setTimerStatusMain();

    return <div className="SmartTimer" onClick={handleClickTimer}>{cooldown}</div>

}

export default SmartTimer;