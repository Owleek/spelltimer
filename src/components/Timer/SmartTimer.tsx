// 1. Внешние зависимости.
// 2. Компоненты вашего проекта.
// 3. Утилиты и бизнес-логика.
// 4. Стили и ассеты.

import React, { JSX, useEffect, useState } from 'react';
import TickNotifier, {COUNT_OF_BLINKS_EQUIVALENT_TO_ONE_SECOND} from '../../utils/TickNotifier';
import { IAbility } from '../../data/fillData';
import './Timer.scss';

interface IProps {
    ability: IAbility | undefined
}

enum ETimeStatus {
    ready = 'ready',
    running = 'running',
    paused = 'paused'
}

const SmartTimer = ({ability}: IProps): JSX.Element => {
    if (!ability) return <div>пусто</div>;

    const [cooldown, setCooldown] = useState<number>(ability.cooldown[0]);
    const [countOfBlinks, setCountOfBlinks] = useState<number>(0);
    const [blinks, setBlinks] = useState<boolean>(false);
    const [timeStatus, setTimeStatus] = useState<ETimeStatus>(ETimeStatus.ready);

    useEffect(() => {
        const instance = TickNotifier.getInstance();
        instance.subscribe(onTickNotifierUpdate);
        return () => instance.unsubscribe(onTickNotifierUpdate);
    }, []);

    useEffect(() => {
        if (timeStatus !== ETimeStatus.running) return;
        if (countOfBlinks < COUNT_OF_BLINKS_EQUIVALENT_TO_ONE_SECOND) return setCountOfBlinks(countOfBlinks + 1);

        setCountOfBlinks(0);
        setCooldown(cooldown - 1);
    }, [blinks]);

    const onTickNotifierUpdate = (): void => { 
        setBlinks((currentState) => !currentState);
    };
    
    const handleClickTimer = () => timeStatus !== ETimeStatus.running ? setTimeStatus(ETimeStatus.running) : setTimeStatus(ETimeStatus.paused);

    return <div className="SmartTimer" onClick={handleClickTimer}>{cooldown}</div>

}

export default SmartTimer;