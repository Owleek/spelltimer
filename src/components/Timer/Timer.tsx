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
    return <div>{tick}</div>
}

export default Timer;