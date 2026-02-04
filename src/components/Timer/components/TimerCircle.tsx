import React, { JSX, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
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

    countDownProp: number
    circleRef: any

    strokeWidth: number
    radius: number
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

        countDownProp,
        circleRef,

        strokeWidth,
        radius,
        strokeDashoffset
    } = props

    const circleLength = 2 * Math.PI * radius
    const strokeDashoffsetRef = useRef<number>(strokeDashoffset)
    const shiftValue = useMemo(() => calculateShiftValue(countDownProp, circleLength), [countDownProp, radius])
    const lastShiftTimeStampRef = useRef<number>(0)
    const rafRef = useRef<number>(0)

    useLayoutEffect(() => { 
        // у нас нет прямого вызовы функции, мы можем лишь передать новую любую true строку отличную от старой чтобы затриггерить функцию
        (outerRunTrigger !== false) && resolveRun()
    }, [outerRunTrigger])

    useLayoutEffect(() => {
        (outerStopTrigger !== false) && stop()
    }, [outerStopTrigger])

    useLayoutEffect(() => {
        (outerResetTrigger !== false) && reset()
    }, [outerResetTrigger])

    const resolveRun = () => {
        strokeDashoffsetRef.current === 0 ? firstRun() : runAfterStop()
        setTimeout(() => onRun(), 0) // планирование а не прямой вызов функции, чтобы не попасть в цепочку последовательных вызовов в дебрях и чтобы не зациклиться.
    }

    const firstRun = () => {
        requestAnimationFrame((startTimestamp) => {
            circleRef.current.style.visibility = 'visible'
            lastShiftTimeStampRef.current = startTimestamp

            rafRef.current = requestAnimationFrame((currentTimestamp) => {
                const offset = strokeDashoffsetRef.current + shiftValue
                applyChanges(offset, currentTimestamp)
                rafRef.current = requestAnimationFrame(proceed)
            })
        })
    }

    const runAfterStop = () => {
         requestAnimationFrame((startTimestamp) => {
            lastShiftTimeStampRef.current = startTimestamp
            rafRef.current = requestAnimationFrame(proceed)
        })
    }

    const proceed = () => {
        // calculating
        // calculating
        // calculating
        // calculating
        // calculating
        // applyChanges()
        // requestAnimationFrame(proceed)
    }

    const applyChanges = (newOffset: number, renderTimestamp: number) => {
        strokeDashoffsetRef.current = newOffset
        lastShiftTimeStampRef.current = renderTimestamp
        circleRef.current.style.strokeDashoffset = `${newOffset}`
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

const calculateShiftValue = (cooldown: number, circleLength: number): number => {
    let _T = cooldown * 1000; // перевод в миллисекунды
    const raf = (globalThis as any).frameRate;
    const _Nraf = _T / raf;
    const _l = circleLength / _Nraf;
    return _l;
}

export default TimerCircle;