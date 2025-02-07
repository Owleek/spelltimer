// 1. Внешние зависимости.
// 2. Компоненты вашего проекта.
// 3. Утилиты и бизнес-логика.
// 4. Стили и ассеты.

import React, { JSX, useEffect, useState } from 'react';

interface IProps {
    isTriggeredByMainControl: boolean
    tick: number
}

const Timer = ({isTriggeredByMainControl, tick}: IProps): JSX.Element => {

    const cooldown = 10;
    const [iterationTime, setIterationTime] = useState<number | null>(null);
    const [countDown, setCountDown] = useState<number | null>(cooldown);

    const calcTime = (iterationTime: number) => {
        if (!iterationTime) return null;

        const now = Date.now();
        const currentDelta = (now - iterationTime) / 1000;
        
        if (!countDown) return null;

        if (currentDelta > 0.5 && currentDelta < 1.1 && countDown >= 0) {
            console.log(currentDelta);
            setIterationTime(now);
            setCountDown(countDown - 1);
        }
    }

    if (iterationTime) calcTime(iterationTime);

    return <div onClick={() => setIterationTime(Date.now())}>{countDown}</div>
}

export default Timer;