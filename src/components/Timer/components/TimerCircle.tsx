import React, { JSX } from 'react';
import {EStages} from '../../../store/StageContext';
import { ITimerData } from '../../../data/data';
import { EAppStatus } from '../../../pages/PlaygroundPage/SettingsStage/SettingsStage';
import '../Timer.scss';

interface IProps {
    ability?: ITimerData
    appStatus?: EAppStatus
    runApp?: () => any
    pauseApp?: () => any
    currentStage?: EStages
    removeTimer?: (slot: ITimerData) => void
    withSound?: boolean
    currentCountdown?: number
    circleRef: any
}

const STROKEWIDTH = 70;
const RADIUS = 35;
const LENGTH = 2 * Math.PI * RADIUS;
const STROKEDASHARRAY = LENGTH;

const TimerCircle = (props: IProps): JSX.Element => {
    
    const changeOffset = () => {

    }

    const play = () => {

    }

    const stop = () => {

    }

    const reset = () => {

    }

    const handleClick = () => {

    }

    return <React.Fragment>
            <svg className="Timer__svg" viewBox="0 0 120 120" onClick={handleClick}>
                <circle
                    className="Timer__circle"
                    ref={props.circleRef}
                    strokeWidth={STROKEWIDTH}
                    r={RADIUS}
                    strokeDasharray={STROKEDASHARRAY}
                    cx="60"
                    cy="60"
                    strokeDashoffset="0"
                    transform="rotate(-90 60 60)"
                    fill="transparent"/>
            </svg>
            <div className="Timer__countdown">00</div>
    </React.Fragment>
}

export default TimerCircle;