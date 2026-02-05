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
    correctiveShift: number

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
        correctiveShift,

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
    const defaultShiftValue = useMemo(() => calculateDefaultShiftValue(countDownProp, circleLength), [countDownProp, radius])
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
        requestAnimationFrame((startTimestamp) => { // таймер не запускается при первом raf намеренно, 
                                                    // чтобы точно посчитать разницу со следующим кадром, 
                                                    // сначала показываем таймер, выдерживаем время до следующего кадра и на нем сдвигаем offset
            circleRef.current.style.visibility = 'visible'
            lastShiftTimeStampRef.current = startTimestamp

            rafRef.current = requestAnimationFrame(() => {
                const newStrokeDashoffset = getNewstrokeDashoffset(defaultShiftValue)
                resolveRender(newStrokeDashoffset)
            })
        })
    }

    const resolveRender = (newStrokeDashoffset: number) => {
        const isLastRender = newStrokeDashoffset >= circleLength

        if (isLastRender) return shutDown()


        rafRef.current = requestAnimationFrame(() => {})
    }

    const runAfterStop = () => {
         requestAnimationFrame((startTimestamp) => {
            lastShiftTimeStampRef.current = startTimestamp
            rafRef.current = requestAnimationFrame(proceed)
        })
    }

    const proceed = (currentTimestamp: number) => {
        const shiftValue = calculateLostShiftValue(currentTimestamp, lastShiftTimeStampRef.current, defaultShiftValue)
        let strokeDashoffset = getNewstrokeDashoffset(shiftValue)

        if (strokeDashoffset >= circleLength) {
            
        }

        // calculating
        // calculating
        // calculating
        // calculating
        // calculating
        // applyChanges()
        // rafRef.current = requestAnimationFrame(proceed)
    }

    const getNewstrokeDashoffset = (shiftValue: number): number => strokeDashoffsetRef.current + shiftValue

    const applyChanges = (newStrokeDashoffset: number, currentTimestamp: number) => {
        changeStrokeDashoffset(newStrokeDashoffset)
        saveLastRenderTimestamp(currentTimestamp)
    }

    const changeStrokeDashoffset = (newOffset: number) => {
        strokeDashoffsetRef.current = newOffset
        circleRef.current.style.strokeDashoffset = `${newOffset}`
    }

    const saveLastRenderTimestamp = (renderTimestamp: number) => {
        lastShiftTimeStampRef.current = renderTimestamp
    }

    const shutDown = () => {
        requestAnimationFrame(() => {
            changeStrokeDashoffset(circleLength)
            saveLastRenderTimestamp(0)
            circleRef.current.style.visibility = 'hidden'
            rafRef.current = 0
        })
    }

    const stop = () => {
        onStop()
    }

    const reset = () => {
        requestAnimationFrame(() => {

        })

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

const calculateDefaultShiftValue = (cooldown: number, circleLength: number): number => {
    let _T = cooldown * 1000; // перевод в миллисекунды
    const raf = (globalThis as any).frameRate;
    const _Nraf = _T / raf;
    const _l = circleLength / _Nraf;
    return _l;
}

const calculateLostShiftValue = (currentTimestamp: number, lastRendeTimestamp: number, defaultShiftValue: number): number => {
    const timeDiff = currentTimestamp - lastRendeTimestamp
    const lostNraf = timeDiff / (globalThis as any).frameRate
    const lostShiftValue = lostNraf * defaultShiftValue
    return lostShiftValue
}

export default TimerCircle;