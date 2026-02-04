import React, { JSX, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {EStages} from '../../../store/StageContext';
import { ITimerData } from '../../../data/data';
import { EAppStatus } from '../../../pages/PlaygroundPage/SettingsStage/SettingsStage';
import '../Timer.scss';

interface IProps {
    // если не любая true строка, значит это тот частый маунт при котором не нужно тригерить
    outerRunTrigger: string | false
    outerStopTrigger: string | false
    outerResetTrigger: string | false

    onRun: () => void
    onStop: () => void
    onReset: () => void

    countDown: number
    circleRef: any

    strokeWidth: number
    radius: number
    circleLength: number
    strokeDashoffset: number
}


const TimerCircle = (props: IProps): JSX.Element => {
    
    const { 
        outerRunTrigger,
        outerStopTrigger,
        outerResetTrigger,

        onRun,
        onStop,
        onReset,

        countDown,
        circleRef,

        strokeWidth,
        radius,
        circleLength,
        strokeDashoffset
    } = props


    useLayoutEffect(() => { 
        // у нас нет прямого вызовы функции, мы можем лишь передать новую любую true строку отличную от старой чтобы затриггерить функцию
        (outerRunTrigger !== false) && run()
    }, [outerRunTrigger])

    useLayoutEffect(() => {
        (outerStopTrigger !== false) && stop()
    }, [outerStopTrigger])

    useLayoutEffect(() => {
        (outerResetTrigger !== false) && reset()
    }, [outerResetTrigger])

    const changeOffset = () => {

    }

    const run = () => {
        onRun()
    }

    const stop = () => {
        onStop()
    }

    const reset = () => {
        onReset()
    }

    const handleClick = () => {

    }

    return <React.Fragment>
            <svg className="Timer__svg" viewBox="0 0 120 120" onClick={handleClick}>
                <circle
                    ref={circleRef}
                    strokeWidth={strokeWidth}
                    r={radius}
                    strokeDasharray={circleLength}
                    strokeDashoffset={strokeDashoffset}
                    className="Timer__circle"
                    cx="60"
                    cy="60"
                    transform="rotate(-90 60 60)"
                    fill="transparent" />
            </svg>
            <div className="Timer__countdown">00</div>
    </React.Fragment>
}

export default TimerCircle;