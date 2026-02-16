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
    correctiveShift: string | false

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
        (outerRunTrigger !== false) && run()
    }, [outerRunTrigger]) // у нас нет прямого вызовы функции, мы можем лишь передать новую любую true строку отличную от старой чтобы затриггерить функцию

    useLayoutEffect(() => {
        (outerStopTrigger !== false) && stop()
    }, [outerStopTrigger])

    useLayoutEffect(() => {
        (outerResetTrigger !== false) && reset()
    }, [outerResetTrigger])

    useLayoutEffect(() => {
        (correctiveShift !== false) && editRunWithCorrectiveShift(+correctiveShift[0])
    }, [correctiveShift])

    const run = () => {    // raf намеренно, чтобы точно посчитать разницу со следующим кадром, сначала показываем таймер, выдерживаем время до следующего кадра и на нем сдвигаем offset
        rafRef.current = requestAnimationFrame(currentTimestamp => {
            if (strokeDashoffsetRef.current === 0) return firstRun(currentTimestamp)
            renderFrame(currentTimestamp, defaultShiftValue) // defaultShiftValue чтобы после паузы не учитывалось время пройденное с момента паузы
        })
        setTimeout(() => onRun(), 0) // планирование а не прямой вызов функции, чтобы не попасть в цепочку последовательных вызовов в дебрях и чтобы не зациклиться.
    }

    const firstRun = (currentTimestamp: number) => {
        initCircleSets(currentTimestamp)
        goToNextFrame()
    }

    const initCircleSets = (renderTime: number) => {
        showCircle()
        saveRenderTimestamp(renderTime)
    }

    const goToNextFrame = () => {
        rafRef.current = requestAnimationFrame(currentTimestamp => {
            const calculatedShiftValue = calculateLostShiftValue(currentTimestamp)
            renderFrame(currentTimestamp, calculatedShiftValue)
        })
    }

    const calculateLostShiftValue = (currentTimestamp: number): number => {
        const timeDiff = currentTimestamp - lastShiftTimeStampRef.current
        const lostNraf = timeDiff / (globalThis as any).frameRate
        const lostShiftValue = lostNraf * defaultShiftValue
        return lostShiftValue
    }

    const renderFrame = (currentTimestamp: number, shiftvalue: number) => {
        const newStrokeDashoffset = getNewstrokeDashoffset(shiftvalue)
        const isLastRender = newStrokeDashoffset >= circleLength
        if (isLastRender) return resetWithoutRaf()

        saveRenderTimestamp(currentTimestamp)
        applyStrokeDashoffset(newStrokeDashoffset)
        goToNextFrame()
    }

    const editRunWithCorrectiveShift = (correctiveShift: number) => {
        rafRef.current = requestAnimationFrame((currentTimestamp) => {
            const correctiveShiftValue = calculateCorrectiveShiftValue(currentTimestamp, correctiveShift)
            renderFrame(currentTimestamp, correctiveShiftValue)
        })
    }

    const calculateCorrectiveShiftValue = (currentTimestamp: number, correctiveShift: number) => {
        const deltaValue = circleLength / countDownProp
        const shift = calculateLostShiftValue(currentTimestamp) + (deltaValue * correctiveShift)
        return shift
    }

    const saveRenderTimestamp = (renderTimestamp: number) => {
        lastShiftTimeStampRef.current = renderTimestamp
    }

    const getNewstrokeDashoffset = (shiftValue: number): number => strokeDashoffsetRef.current + shiftValue

    const applyStrokeDashoffset = (newOffset: number) => {
        strokeDashoffsetRef.current = newOffset
        circleRef.current.style.strokeDashoffset = `${newOffset}`
    }

    const showCircle = () => {
        circleRef.current.style.visibility = 'visible'
    }

    const hideCircle = () => {
        circleRef.current.style.visibility = 'hidden'
    }

    const clearRaf = () => {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = 0        //TODO  почему ref без обнуления не обнуляется
    }

    const resetWithoutRaf = () => {
        saveRenderTimestamp(0)
        applyStrokeDashoffset(circleLength)

        requestAnimationFrame( () => {
            applyStrokeDashoffset(0)
            hideCircle()
            clearRaf()
        })

        setTimeout(() =>  onReset(), 0);
    }

    const reset = () => {
        requestAnimationFrame(resetWithoutRaf)
    }

    const stop = () => {
        clearRaf()
        setTimeout(() => onStop(), 0)
    }

    // const handleClick = () => {
    //     !!rafRef.current ? stop() : run()
    // }

    return <React.Fragment>
                <svg className="Timer__svg" viewBox="0 0 120 120" >
                    <circle
                        ref={circleRef}
                        strokeWidth={strokeWidth}
                        r={radius}
                        strokeDasharray={circleLength}
                        strokeDashoffset="0"
                        className="Timer__circle"
                        cx="60"
                        cy="60"
                        transform="rotate(-90 60 60)"
                        fill="transparent" />
                </svg>

            {/* <div className="Timer__countdown">{countDownProp}</div> */}
    </React.Fragment>
}

const calculateDefaultShiftValue = (cooldown: number, circleLength: number): number => {
    let timeMs = cooldown * 1000 // перевод в миллисекунды
    const raf = (globalThis as any).frameRate
    const countOfRaf = timeMs / raf
    const shiftWidth = circleLength / countOfRaf
    return shiftWidth
}

export default TimerCircle;